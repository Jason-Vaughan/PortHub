// PortHub REST API
// "Providing professional endpoints for your viewing pleasure"

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import chalk from 'chalk';
import { PortRegistry } from '../types';
import { WebSocketServer, broadcastRegistryUpdate } from './websocket';

export interface RestAPIServer {
  stop: () => Promise<void>;
  port: number;
  url: string;
}

export async function startRestAPI(port: number, registry: PortRegistry, wsServer: WebSocketServer): Promise<RestAPIServer> {
  console.log(chalk.hex('#FF9900')(`🔌 Starting PortHub REST API on port ${port}...`));

  return new Promise((resolve, reject) => {
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      // Enable CORS for dashboard
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      try {
        const url = new URL(req.url!, `http://localhost:${port}`);
        const path = url.pathname;
        const method = req.method;

        console.log(chalk.gray(`📡 ${method} ${path}`));

        // Parse JSON body for POST/PUT requests
        let body = '';
        if (method === 'POST' || method === 'PUT') {
          req.on('data', chunk => body += chunk);
          req.on('end', () => handleRequest(path, method, body));
        } else {
          handleRequest(path, method || 'GET');
        }

        async function handleRequest(path: string, method: string, requestBody = '') {
          try {
            let data;
            if (requestBody) {
              data = JSON.parse(requestBody);
            }

            // Route handlers
            if (path === '/api/leases' && method === 'GET') {
              // Get all leases
              const leases = Array.from(registry.ports.values());
              sendJSON(res, { leases });
              
            } else if (path === '/api/leases' && method === 'POST') {
              // Create new lease
              const { port, project, service, ttl, permanent } = data;
              const { registerPort } = await import('../core/registry');
              
              await registerPort(
                registry,
                port,
                'dashboard-client',
                service,
                {
                  project,
                  type: 'dynamic',
                  ttl: permanent ? -1 : parseTTL(ttl),
                  description: `Created via dashboard`
                }
              );
              
              // Broadcast update
              broadcastRegistryUpdate(wsServer, registry);
              
              sendJSON(res, { success: true, message: `Port ${port} leased successfully` });
              console.log(chalk.green(`✅ Dashboard created lease for port ${port}`));
              
            } else if (path.startsWith('/api/leases/') && method === 'DELETE') {
              // Release lease
              const portStr = path.split('/')[3];
              const port = parseInt(portStr);
              
              if (isNaN(port)) {
                sendError(res, 400, 'Invalid port number');
                return;
              }
              
              const { releasePort } = await import('../core/registry');
              
              // Get the lease to find the correct clientId
              const lease = registry.ports.get(port);
              if (!lease) {
                sendError(res, 404, `Port ${port} not found`);
                return;
              }
              
              const success = await releasePort(registry, port, lease.clientId);
              
              if (success) {
                // Broadcast update
                broadcastRegistryUpdate(wsServer, registry);
                sendJSON(res, { success: true, message: `Port ${port} released successfully` });
                console.log(chalk.green(`✅ Dashboard released lease for port ${port}`));
              } else {
                sendError(res, 404, `Port ${port} not found or cannot be released`);
              }
              
            } else if (path.startsWith('/api/leases/') && path.endsWith('/heartbeat') && method === 'POST') {
              // Extend lease
              const portStr = path.split('/')[3];
              const port = parseInt(portStr);
              
              if (isNaN(port)) {
                sendError(res, 400, 'Invalid port number');
                return;
              }
              
              const { heartbeatPort } = await import('../core/registry');
              
              // Get the lease to find the correct clientId
              const lease = registry.ports.get(port);
              if (!lease) {
                sendError(res, 404, `Port ${port} not found`);
                return;
              }
              
              const success = await heartbeatPort(registry, port, lease.clientId);
              
              if (success) {
                // Broadcast update
                broadcastRegistryUpdate(wsServer, registry);
                sendJSON(res, { success: true, message: `Port ${port} lease extended successfully` });
                console.log(chalk.green(`💓 Dashboard extended lease for port ${port}`));
              } else {
                sendError(res, 404, `Port ${port} not found or cannot be extended`);
              }
              
            } else if (path === '/api/stats' && method === 'GET') {
              // Get registry statistics
              const leases = Array.from(registry.ports.values());
              const stats = {
                total: leases.length,
                active: leases.filter(l => l.status === 'active').length,
                permanent: leases.filter(l => l.status === 'permanent').length,
                expired: leases.filter(l => l.status === 'expired').length
              };
              sendJSON(res, stats);
              
            } else {
              sendError(res, 404, 'Endpoint not found');
            }
            
          } catch (error) {
            console.error(chalk.red('💥 REST API error:'), error);
            sendError(res, 500, 'Internal server error');
          }
        }

      } catch (error) {
        console.error(chalk.red('💥 REST API request error:'), error);
        sendError(res, 500, 'Internal server error');
      }
    });

    server.listen(port, () => {
      const url = `http://localhost:${port}`;
      console.log(chalk.green(`✅ PortHub REST API listening on ${url}`));
      console.log(chalk.gray('"Professional endpoints ready for business"'));
      resolve({
        port,
        url,
        stop: async () => {
          console.log(chalk.gray('🔌 Stopping PortHub REST API...'));
          return new Promise<void>((resolveStop) => {
            server.close(() => {
              console.log(chalk.gray('🔌 REST API stopped gracefully'));
              resolveStop();
            });
          });
        }
      });
    });

    server.on('error', (error) => {
      console.error(chalk.red('💥 PortHub REST API error:'), error);
      reject(error);
    });
  });
}

function sendJSON(res: ServerResponse, data: any) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function sendError(res: ServerResponse, status: number, message: string) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: message }));
}

// broadcastRegistryUpdate is now imported from websocket module

function parseTTL(ttl: string): number {
  if (!ttl) return 3600; // 1 hour default
  
  const match = ttl.match(/^(\d+)([smhd]?)$/);
  if (!match) return 3600;
  
  const [, num, unit] = match;
  const value = parseInt(num);
  
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default: return value; // assume seconds if no unit
  }
}
