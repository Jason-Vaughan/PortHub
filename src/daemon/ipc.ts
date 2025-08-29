// PortHub IPC Server
// "Inter-Process Communication for the Professional"

import { PortRegistry, PortHubProtocolPacket, ProtocolCommand } from '../types';
import { registerPort, releasePort, listPorts, updateHeartbeat } from '../core/registry';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as net from 'net';

export interface IPCServer {
  stop: () => Promise<void>;
  socketPath: string;
}

const IPC_SOCKET_NAME = 'porthub.sock';

export async function startIPCServer(registry: PortRegistry, wsServer?: any): Promise<IPCServer> {
  console.log(chalk.hex('#FF9900')('🔌 Starting IPC server...'));
  
  // Create socket path in temp directory
  const socketPath = path.join(os.tmpdir(), IPC_SOCKET_NAME);
  
  // Clean up existing socket if it exists
  try {
    if (fs.existsSync(socketPath)) {
      fs.unlinkSync(socketPath);
    }
  } catch (error) {
    // Ignore cleanup errors
  }
  
  // Create Unix domain socket server
  const server = net.createServer((socket) => {
    console.log(chalk.gray('🔗 Client connected to IPC server'));
    
    let buffer = '';
    
    socket.on('data', async (data) => {
      buffer += data.toString();
      
      // Process complete messages (terminated by newline)
      while (buffer.includes('\n')) {
        const messageEndIndex = buffer.indexOf('\n');
        const message = buffer.slice(0, messageEndIndex);
        buffer = buffer.slice(messageEndIndex + 1);
        
        try {
          const packet: PortHubProtocolPacket = JSON.parse(message);
          console.log(chalk.cyan(`📨 Received ${packet.command} command from ${packet.clientId}`));
          
          const response = await processIPCCommand(registry, packet, wsServer);
          const responseMessage = JSON.stringify(response) + '\n';
          socket.write(responseMessage);
          
        } catch (error) {
          console.error(chalk.red('💥 Error processing IPC command:'), error);
          const errorResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
          socket.write(JSON.stringify(errorResponse) + '\n');
        }
      }
    });
    
    socket.on('error', (error) => {
      console.error(chalk.yellow('⚠️  IPC socket error:'), error);
    });
    
    socket.on('end', () => {
      console.log(chalk.gray('🔗 Client disconnected from IPC server'));
    });
  });
  
  // Start listening on Unix domain socket
  server.listen(socketPath, () => {
    console.log(chalk.green(`✅ IPC server listening on ${socketPath}`));
    console.log(chalk.gray('"Ready for professional port management"'));
  });
  
  return {
    socketPath,
    stop: async () => {
      return new Promise((resolve) => {
        server.close(() => {
          try {
            if (fs.existsSync(socketPath)) {
              fs.unlinkSync(socketPath);
            }
            console.log(chalk.gray('🔌 IPC server stopped gracefully'));
            resolve();
          } catch (error) {
            console.error(chalk.yellow('⚠️  Error stopping IPC server:'), error);
            resolve();
          }
        });
      });
    }
  };
}

/**
 * Process IPC commands from CLI clients
 */
export async function processIPCCommand(
  registry: PortRegistry,
  packet: PortHubProtocolPacket,
  wsServer?: any
): Promise<any> {
  const { command, clientId, requestedPort, metadata } = packet;
  
  try {
    switch (command) {
      case 'LEASE':
        if (!requestedPort || !metadata?.service) {
          throw new Error('Port and service required for lease');
        }
        
        const { requestLease } = await import('../utils/leaseManager');
        const leaseResult = await requestLease(registry, {
          port: requestedPort,
          project: metadata.project,
          service: metadata.service,
          ttl: metadata.permanent ? 'permanent' : (packet.ttl || '2h'),
          description: metadata.description,
          autoRenew: metadata.autoRenew || false,
          permanent: metadata.permanent || false
        });
        
        // Broadcast registry update to WebSocket clients
        if (leaseResult.success && wsServer) {
          const { broadcastRegistryUpdate } = await import('./websocket');
          broadcastRegistryUpdate(wsServer, registry);
        }
        
        return {
          success: leaseResult.success,
          message: leaseResult.message,
          lease: leaseResult.lease,
          alternative: leaseResult.alternative
        };
        
      case 'REGISTER':
        if (!requestedPort || !metadata?.name) {
          throw new Error('Port and name required for registration');
        }
        
        const assignment = await registerPort(
          registry,
          requestedPort,
          clientId,
          metadata.name,
          {
            description: metadata.description,
            type: 'static',
            workspace: metadata.workspace,
            project: metadata.project,
            tags: metadata.tags
          }
        );
        
        return {
          success: true,
          message: `Port ${requestedPort} registered successfully`,
          assignment
        };
        
      case 'RELEASE':
        if (!requestedPort) {
          throw new Error('Port required for release');
        }
        
        const released = await releasePort(registry, requestedPort, clientId);
        
        // Broadcast registry update to WebSocket clients
        if (released && wsServer) {
          const { broadcastRegistryUpdate } = await import('./websocket');
          broadcastRegistryUpdate(wsServer, registry);
        }
        
        return {
          success: true,
          message: `Port ${requestedPort} released successfully`,
          released
        };
        
      case 'STATUS':
        const ports = await listPorts(registry);
        
        // Transform ports to lease format for CLI compatibility
        const leases = ports.map(port => ({
          port: port.port,
          project: port.metadata?.project || port.project || 'unknown',
          service: port.metadata?.service || port.name,
          expiresAt: port.expiresAt,
          permanent: port.status === 'permanent' || port.metadata?.permanent || false,
          status: port.status,
          lastHeartbeat: port.lastHeartbeat
        }));
        
        return {
          success: true,
          message: 'Port registry status',
          leases,
          totalPorts: ports.length,
          activePorts: ports.filter(p => p.status === 'active' || p.status === 'permanent').length
        };
        
      case 'HEARTBEAT':
        if (!requestedPort) {
          throw new Error('Port required for heartbeat');
        }
        
        const updated = await updateHeartbeat(registry, requestedPort, clientId);
        
        return {
          success: updated,
          message: updated ? 'Heartbeat updated' : 'Port not found or access denied'
        };
        
      default:
        throw new Error(`Unknown command: ${command}`);
    }
    
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error
    };
  }
}
