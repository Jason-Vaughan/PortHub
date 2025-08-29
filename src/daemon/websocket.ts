// PortHub WebSocket Server
// "Real-time Communication for the Connected"

import { PortRegistry, PortAssignment } from '../types';
import { WebSocketServer as WSServer } from 'ws';
import { createServer } from 'http';
import chalk from 'chalk';

export interface WebSocketServer {
  stop: () => Promise<void>;
  port: number;
  url: string;
  clients: Set<any>;
}

export async function startWebSocketServer(port: number, registry: PortRegistry): Promise<WebSocketServer> {
  console.log(chalk.hex('#FF9900')(`🌐 Starting WebSocket server on port ${port}...`));
  
  return new Promise((resolve, reject) => {
    try {
      // Create HTTP server for WebSocket upgrade
      const server = createServer();
      
      // Create WebSocket server
      const wss = new WSServer({ server });
      
      // Track connected clients
      const clients = new Set<any>();
      
      wss.on('connection', (ws, request) => {
        clients.add(ws);
        console.log(chalk.blue(`🔌 Client connected (${clients.size} total)`));
        console.log(chalk.gray('"Another satisfied customer"'));
        
        // Send welcome message with PortHub personality
        ws.send(JSON.stringify({
          type: 'welcome',
          message: 'Welcome to PortHub - Your ports are now under professional management',
          timestamp: new Date().toISOString(),
          registryVersion: registry.version
        }));
        
        // Handle client messages
        ws.on('message', async (data) => {
          try {
            const message = JSON.parse(data.toString());
            await handleWebSocketMessage(ws, message, registry);
          } catch (error) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid message format',
              error: error instanceof Error ? error.message : 'Unknown error'
            }));
          }
        });
        
        // Handle client disconnect
        ws.on('close', () => {
          clients.delete(ws);
          console.log(chalk.yellow(`📴 Client disconnected (${clients.size} remaining)`));
          console.log(chalk.gray('"They always come back for more"'));
        });
        
        // Handle errors
        ws.on('error', (error) => {
          console.error(chalk.red('💥 WebSocket client error:'), error);
          clients.delete(ws);
        });
      });
      
      // Start the server
      server.listen(port, () => {
        const url = `ws://localhost:${port}`;
        console.log(chalk.green(`✅ WebSocket server listening on ${url}`));
        console.log(chalk.gray('"Real-time port updates, because you\'re worth it"'));
        
        resolve({
          port,
          url,
          clients, // Expose clients for broadcasting
          stop: async () => {
            console.log(chalk.gray('🌐 Stopping WebSocket server...'));
            
            // Close all client connections
            clients.forEach(client => {
              try {
                client.close();
              } catch (error) {
                // Ignore close errors
              }
            });
            
            // Close the server
            return new Promise<void>((resolveStop) => {
              server.close(() => {
                console.log(chalk.gray('🌐 WebSocket server stopped gracefully'));
                resolveStop();
              });
            });
          }
        });
      });
      
      // Handle server errors
      server.on('error', (error) => {
        console.error(chalk.red('💥 WebSocket server error:'), error);
        reject(error);
      });
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Handle WebSocket messages from clients
 */
async function handleWebSocketMessage(ws: any, message: any, registry: PortRegistry): Promise<void> {
  const { type, ...data } = message;
  
  try {
    switch (type) {
      case 'subscribe_registry':
        // Send current registry state
        ws.send(JSON.stringify({
          type: 'registry_update',
          data: {
            version: registry.version,
            ports: Array.from(registry.ports.values()),
            lastUpdated: registry.lastUpdated
          }
        }));
        break;
        
      case 'ping':
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: new Date().toISOString()
        }));
        break;
        
      default:
        ws.send(JSON.stringify({
          type: 'error',
          message: `Unknown message type: ${type}`
        }));
    }
    
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Error processing message',
      error: error instanceof Error ? error.message : 'Unknown error'
    }));
  }
}

/**
 * Broadcast registry updates to all connected clients
 */
export function broadcastRegistryUpdate(wsServer: any, registry: PortRegistry): void {
  const message = JSON.stringify({
    type: 'registry_update',
    data: {
      version: registry.version,
      ports: Array.from(registry.ports.values()),
      lastUpdated: registry.lastUpdated
    },
    timestamp: new Date().toISOString()
  });
  
  // Use the clients Set from our WebSocket server
  if (wsServer.clients) {
    wsServer.clients.forEach((client: any) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(message);
          console.log(chalk.gray('📡 Broadcasted registry update to WebSocket client'));
        } catch (error) {
          console.error(chalk.yellow('⚠️  Error broadcasting to client:'), error);
        }
      }
    });
  }
}
