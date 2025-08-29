// PortHub Daemon
// "Running in the background like a true professional"

import { PortRegistry, PortAssignment, WorkspaceConfig } from '../types';
import { createRegistry } from '../core/registry';
import { startIPCServer } from './ipc';
import { startWebSocketServer } from './websocket';
import chalk from 'chalk';

export interface DaemonOptions {
  port: number;
  configPath?: string;
  debug?: boolean;
}

export interface DaemonInstance {
  registry: PortRegistry;
  config: WorkspaceConfig;
  cleanupInterval?: NodeJS.Timeout;
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
    
    daemonInstance = {
      registry,
      config,
      stop: async () => {
        console.log(chalk.gray('"Shutting down gracefully like a true professional"'));
        await ipcServer.stop();
        await wsServer.stop();
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
    daemonInstance.cleanupInterval = cleanupInterval;
    
    // Update stop function to clear interval
    const originalStop = daemonInstance.stop;
    daemonInstance.stop = async () => {
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
      }
      await originalStop();
    };
    
    console.log(chalk.green('✅ PortHub daemon started successfully!'));
    console.log(chalk.gray(`🎭 Port Pimp listening on port ${options.port}`));
    console.log(chalk.gray('"Your ports are now under professional management"'));
    
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
    
    return daemonInstance;
    
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
