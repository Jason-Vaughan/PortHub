// PortHub Daemon
// "Running in the background like a true professional"

import { PortRegistry, PortAssignment, WorkspaceConfig } from '../types';
import { createRegistry } from '../core/registry';
import { startIPCServer } from './ipc';
import { startWebSocketServer } from './websocket';
import { startStaticServer } from './staticServer';
import { startRestAPI } from './restAPI';
import chalk from 'chalk';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export interface DaemonOptions {
  port: number;
  configPath?: string;
  debug?: boolean;
}

export interface DaemonInstance {
  registry: PortRegistry;
  config: WorkspaceConfig;
  cleanupInterval?: NodeJS.Timeout;
  dashboardUrl?: string;
  apiUrl?: string;
  stop: () => Promise<void>;
}

let daemonInstance: DaemonInstance | null = null;

export async function startDaemon(options: DaemonOptions): Promise<DaemonInstance> {
  if (daemonInstance) {
    console.log(chalk.yellow('⚠️  PortHub daemon already running'));
    return daemonInstance;
  }

  try {
    console.log(chalk.hex('#FF9900')('🎭 Port Pimp initializing...'));
    
    // Load or create default configuration
    const config = await loadWorkspaceConfig(options.configPath);
    
    // Initialize port registry
    const registry = await createRegistry(config);
    
    // Start WebSocket server for real-time updates
    const wsServer = await startWebSocketServer(options.port, registry);
    
    // Start IPC server for CLI communication (with WebSocket for broadcasting)
    const ipcServer = await startIPCServer(registry, wsServer);
    
    // Start REST API server on port + 2 (8080 for WS, 8081 for dashboard, 8082 for API)
    const apiPort = options.port + 2;
    const apiServer = await startRestAPI(apiPort, registry, wsServer);
    
    // Start static file server for dashboard on port + 1
    const dashboardPort = options.port + 1;
    const dashboardPath = join(__dirname, '../../dashboard-dist');
    let staticServer = null;
    let dashboardUrl = null;
    
    try {
      staticServer = await startStaticServer(dashboardPort, dashboardPath);
      dashboardUrl = staticServer.url;
    } catch (error) {
      console.log(chalk.yellow('⚠️  Dashboard not available - built files not found'));
      console.log(chalk.gray('   Run "npm run build" in dashboard/ to enable web UI'));
    }
    
    daemonInstance = {
      registry,
      config,
      dashboardUrl: dashboardUrl || undefined,
      apiUrl: apiServer.url,
      stop: async () => {
        console.log(chalk.gray('"Shutting down gracefully like a true professional"'));
        await ipcServer.stop();
        await wsServer.stop();
        await apiServer.stop();
        if (staticServer) {
          await staticServer.stop();
        }
        daemonInstance = null;
      }
    };
    
    // Start lease cleanup timer with enhanced TTL management
    const cleanupInterval = setInterval(async () => {
      const { cleanupExpiredPorts } = await import('../core/registry');
      const expiredCount = await cleanupExpiredPorts(registry);
      
      if (expiredCount > 0) {
        console.log(chalk.blue(`🧹 Processed ${expiredCount} lease expirations`));
        console.log(chalk.gray('"DHCP housekeeping complete"'));
      }
    }, 15000); // Check every 15 seconds for tighter lease management
    
    // Add cleanup interval to daemon instance
    if (daemonInstance) {
      daemonInstance.cleanupInterval = cleanupInterval;
      
      // Update stop function to clear interval
      const originalStop = daemonInstance.stop;
      daemonInstance.stop = async () => {
        if (cleanupInterval) {
          clearInterval(cleanupInterval);
        }
        await originalStop();
      };
    }
    
    console.log(chalk.green('✅ PortHub daemon started successfully!'));
    console.log(chalk.gray(`🎭 Port Pimp listening on port ${options.port}`));
    console.log(chalk.blue(`🔌 REST API available at ${apiServer.url}`));
    if (dashboardUrl) {
      console.log(chalk.hex('#FF9900')(`🌐 Dashboard available at ${dashboardUrl}`));
    }
    console.log(chalk.gray('"Your ports are now under professional management"'));
    
    // Register PortHub's infrastructure ports as permanent leases
    setTimeout(async () => {
      try {
        await registerInfrastructurePorts(options.port, staticServer ? dashboardPort : undefined);
      } catch (error) {
        console.log(chalk.yellow('⚠️  Failed to register infrastructure ports:', error));
      }
    }, 1000); // Give daemon time to fully initialize
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\n🛑 Shutdown signal received...'));
      await daemonInstance?.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log(chalk.yellow('\n🛑 Termination signal received...'));
      await daemonInstance?.stop();
      process.exit(0);
    });
    
    return daemonInstance!;
    
  } catch (error) {
    console.error(chalk.red('💥 Failed to start PortHub daemon:'), error);
    throw error;
  }
}

async function loadWorkspaceConfig(configPath?: string): Promise<WorkspaceConfig> {
  const { loadConfiguration, showConfigurationSummary } = await import('../utils/config');
  
  const config = await loadConfiguration({
    configPath,
    createDefault: true
  });
  
  // Show configuration summary with PortHub personality
  showConfigurationSummary(config);
  
  return config;
}

export function getDaemonInstance(): DaemonInstance | null {
  return daemonInstance;
}

export async function stopDaemon(): Promise<void> {
  if (daemonInstance) {
    await daemonInstance.stop();
  }
}

/**
 * Register PortHub's own infrastructure ports as permanent leases
 */
async function registerInfrastructurePorts(daemonPort: number, dashboardPort?: number): Promise<void> {
  console.log(chalk.hex('#FF9900')('🏠 Registering PortHub infrastructure ports...'));
  console.log(chalk.gray('"Claiming our own territory first"'));
  
  if (!daemonInstance) {
    console.log(chalk.yellow('⚠️  Daemon instance not available for self-registration'));
    return;
  }
  
  const infrastructurePorts = [
    { port: daemonPort, service: 'websocket-server', description: 'PortHub WebSocket & API server' }
  ];
  
  if (dashboardPort) {
    infrastructurePorts.push({ 
      port: dashboardPort, 
      service: 'dashboard-server', 
      description: 'PortHub web dashboard static files' 
    });
  }
  
  // Add future infrastructure ports
  infrastructurePorts.push(
    { port: 8082, service: 'metrics-server', description: 'PortHub metrics & monitoring (future)' },
    { port: 8888, service: 'admin-api', description: 'PortHub admin API (future)' }
  );
  
  const { registerPort } = await import('../core/registry');
  
  for (const { port, service, description } of infrastructurePorts) {
    try {
      await registerPort(
        daemonInstance.registry,
        port,
        'porthub-system',
        service,
        {
          description,
          type: 'static',
          project: 'porthub-system',
          workspace: 'system',
          tags: ['infrastructure', 'permanent'],
          ttl: -1 // Permanent
        }
      );
      
      console.log(chalk.green(`✅ Port ${port} registered permanently: ${service}`));
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Port ${port} registration failed:`, error));
    }
  }
  
  console.log(chalk.gray('"Infrastructure ports secured"'));
}
