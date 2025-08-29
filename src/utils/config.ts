// PortHub Configuration Utility
// "Configuration That Doesn't Suck"

import { WorkspaceConfig } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import chalk from 'chalk';

export interface ConfigOptions {
  configPath?: string;
  workspace?: string;
  createDefault?: boolean;
}

const CONFIG_FILENAMES = [
  'porthub.json',
  '.porthub.json',
  'porthub.config.json'
];

const DEFAULT_CONFIG: WorkspaceConfig = {
  name: 'default-workspace',
  description: 'Default PortHub workspace configuration',
  portRanges: {
    static: [1024, 65535],
    dynamic: [3000, 3999]
  },
  autoScan: true,
  notifications: true,
  theme: 'casting-consultant'
};

/**
 * Load PortHub configuration from various sources
 */
export async function loadConfiguration(options: ConfigOptions = {}): Promise<WorkspaceConfig> {
  console.log(chalk.hex('#FF9900')('⚙️  Loading PortHub configuration...'));
  
  try {
    // Try specific config path first
    if (options.configPath) {
      const config = await loadConfigFromFile(options.configPath);
      if (config) {
        console.log(chalk.green(`✅ Configuration loaded from ${options.configPath}`));
        return config;
      }
    }
    
    // Try to find config in standard locations
    const searchPaths = getConfigSearchPaths();
    
    for (const searchPath of searchPaths) {
      for (const filename of CONFIG_FILENAMES) {
        const configPath = path.join(searchPath, filename);
        const config = await loadConfigFromFile(configPath);
        
        if (config) {
          console.log(chalk.green(`✅ Configuration loaded from ${configPath}`));
          return config;
        }
      }
    }
    
    // No config found, create default
    if (options.createDefault) {
      const defaultConfigPath = path.join(process.cwd(), 'porthub.json');
      await saveConfiguration(DEFAULT_CONFIG, defaultConfigPath);
      console.log(chalk.blue(`📝 Default configuration created at ${defaultConfigPath}`));
      console.log(chalk.gray('"Fresh out of the box, ready to rock"'));
    }
    
    console.log(chalk.yellow('⚠️  No configuration file found, using defaults'));
    console.log(chalk.gray('"Default settings are like training wheels"'));
    
    return {
      ...DEFAULT_CONFIG,
      name: options.workspace || DEFAULT_CONFIG.name
    };
    
  } catch (error) {
    console.error(chalk.red('💥 Configuration loading failed:'), error);
    console.error(chalk.gray('"Configuration chaos, falling back to defaults"'));
    
    return {
      ...DEFAULT_CONFIG,
      name: options.workspace || DEFAULT_CONFIG.name
    };
  }
}

/**
 * Load configuration from a specific file
 */
async function loadConfigFromFile(filePath: string): Promise<WorkspaceConfig | null> {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const config = JSON.parse(fileContent);
    
    // Validate and merge with defaults
    const validatedConfig = validateConfiguration(config);
    
    return validatedConfig;
    
  } catch (error) {
    console.error(chalk.yellow(`⚠️  Error loading config from ${filePath}:`), error);
    return null;
  }
}

/**
 * Save configuration to file
 */
export async function saveConfiguration(config: WorkspaceConfig, filePath: string): Promise<void> {
  try {
    const configJson = JSON.stringify(config, null, 2);
    fs.writeFileSync(filePath, configJson, 'utf-8');
    
    console.log(chalk.green(`✅ Configuration saved to ${filePath}`));
    console.log(chalk.gray('"Your preferences are now safely tucked away"'));
    
  } catch (error) {
    console.error(chalk.red(`💥 Failed to save configuration to ${filePath}:`), error);
    throw error;
  }
}

/**
 * Validate configuration and merge with defaults
 */
function validateConfiguration(config: any): WorkspaceConfig {
  const validated: WorkspaceConfig = {
    name: config.name || DEFAULT_CONFIG.name,
    description: config.description || DEFAULT_CONFIG.description,
    portRanges: {
      static: config.portRanges?.static || DEFAULT_CONFIG.portRanges.static,
      dynamic: config.portRanges?.dynamic || DEFAULT_CONFIG.portRanges.dynamic
    },
    autoScan: config.autoScan !== undefined ? config.autoScan : DEFAULT_CONFIG.autoScan,
    notifications: config.notifications !== undefined ? config.notifications : DEFAULT_CONFIG.notifications,
    theme: config.theme || DEFAULT_CONFIG.theme
  };
  
  // Validate port ranges
  if (validated.portRanges.static[0] >= validated.portRanges.static[1]) {
    console.warn(chalk.yellow('⚠️  Invalid static port range, using defaults'));
    validated.portRanges.static = DEFAULT_CONFIG.portRanges.static;
  }
  
  if (validated.portRanges.dynamic[0] >= validated.portRanges.dynamic[1]) {
    console.warn(chalk.yellow('⚠️  Invalid dynamic port range, using defaults'));
    validated.portRanges.dynamic = DEFAULT_CONFIG.portRanges.dynamic;
  }
  
  // Validate theme
  const validThemes = ['full-pimp', 'casting-consultant', 'voyeur'];
  if (!validThemes.includes(validated.theme)) {
    console.warn(chalk.yellow(`⚠️  Invalid theme "${validated.theme}", using default`));
    validated.theme = DEFAULT_CONFIG.theme;
  }
  
  return validated;
}

/**
 * Get configuration search paths in order of priority
 */
function getConfigSearchPaths(): string[] {
  return [
    // Current working directory (highest priority)
    process.cwd(),
    
    // User home directory
    os.homedir(),
    
    // User config directory
    path.join(os.homedir(), '.config', 'porthub'),
    
    // System config directory (Unix)
    '/etc/porthub',
    
    // Application directory (as fallback)
    path.dirname(process.execPath)
  ].filter(dir => {
    try {
      return fs.existsSync(dir);
    } catch {
      return false;
    }
  });
}

/**
 * Discover all workspace configurations across the system
 * Multi-workspace support for true DHCP-style port management
 */
export async function discoverWorkspaces(): Promise<WorkspaceConfig[]> {
  console.log(chalk.hex('#FF9900')('🔍 Discovering PortHub workspaces...'));
  console.log(chalk.gray('"Hunting for configurations like a professional"'));
  
  const workspaces: WorkspaceConfig[] = [];
  const searchPaths = getConfigSearchPaths();
  
  // Add additional search paths for workspace discovery
  const additionalPaths = [
    // Common project directories
    path.join(os.homedir(), 'Documents', 'Projects'),
    path.join(os.homedir(), 'Documents', 'GitHub'),
    path.join(os.homedir(), 'Projects'),
    path.join(os.homedir(), 'Code'),
    path.join(os.homedir(), 'Development'),
    path.join(os.homedir(), 'dev'),
    '/opt/projects',
    '/var/projects'
  ];
  
  const allSearchPaths = [...searchPaths, ...additionalPaths.filter(dir => {
    try {
      return fs.existsSync(dir);
    } catch {
      return false;
    }
  })];
  
  for (const searchPath of allSearchPaths) {
    await discoverWorkspacesInDirectory(searchPath, workspaces);
  }
  
  if (workspaces.length > 0) {
    console.log(chalk.green(`✅ Discovered ${workspaces.length} workspace configuration(s)`));
    workspaces.forEach(ws => {
      console.log(chalk.gray(`   📝 ${ws.name}: ${ws.description || 'No description'}`));
    });
  } else {
    console.log(chalk.yellow('⚠️  No workspace configurations found'));
  }
  
  console.log(chalk.gray('"Multi-workspace discovery complete"'));
  return workspaces;
}

/**
 * Recursively discover workspace configurations in a directory
 */
async function discoverWorkspacesInDirectory(
  directory: string, 
  workspaces: WorkspaceConfig[], 
  maxDepth: number = 3, 
  currentDepth: number = 0
): Promise<void> {
  if (currentDepth >= maxDepth) return;
  
  try {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    
    // Check for config files in current directory
    for (const filename of CONFIG_FILENAMES) {
      const configPath = path.join(directory, filename);
      const config = await loadConfigFromFile(configPath);
      
      if (config) {
        // Avoid duplicates
        if (!workspaces.find(ws => ws.name === config.name)) {
          workspaces.push(config);
        }
      }
    }
    
    // Recurse into subdirectories
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.includes('node_modules')) {
        const subDir = path.join(directory, entry.name);
        await discoverWorkspacesInDirectory(subDir, workspaces, maxDepth, currentDepth + 1);
      }
    }
    
  } catch (error) {
    // Silently ignore directories we can't read
  }
}

/**
 * Register PortHub's own ports as permanent infrastructure
 */
export async function registerPortHubPorts(): Promise<void> {
  console.log(chalk.hex('#FF9900')('🏠 Registering PortHub infrastructure ports...'));
  console.log(chalk.gray('"Claiming our own territory first"'));
  
  const { sendToMaemon, isDaemonRunning } = await import('./ipcClient');
  
  if (!isDaemonRunning()) {
    console.log(chalk.yellow('⚠️  PortHub daemon not running, cannot register infrastructure ports'));
    return;
  }
  
  const infrastructurePorts = [
    { port: 8080, service: 'websocket-server', description: 'PortHub WebSocket & API server' },
    { port: 8081, service: 'dashboard-server', description: 'PortHub web dashboard static files' },
    { port: 8082, service: 'metrics-server', description: 'PortHub metrics & monitoring (future)' },
    { port: 8888, service: 'admin-api', description: 'PortHub admin API (future)' }
  ];
  
  for (const { port, service, description } of infrastructurePorts) {
    try {
      const result = await sendToMaemon('LEASE', {
        port,
        metadata: {
          project: 'porthub-system',
          service,
          description,
          permanent: true,
          infrastructure: true
        },
        ttl: 'permanent'
      });
      
      if (result.success) {
        console.log(chalk.green(`✅ Port ${port} registered permanently: ${service}`));
      } else {
        console.log(chalk.yellow(`⚠️  Port ${port} registration failed: ${result.message}`));
      }
      
    } catch (error) {
      console.log(chalk.red(`💥 Failed to register port ${port}: ${error}`));
    }
  }
  
  console.log(chalk.gray('"PortHub infrastructure secured permanently"'));
}

/**
 * Generate a default configuration file with PortHub personality
 */
export function generateDefaultConfigContent(): string {
  const config = {
    ...DEFAULT_CONFIG,
    "$schema": "https://porthub.dev/schema/config.json",
    "_comment": "PortHub Configuration - No Bloat. No Debt. No Bullshit.",
    "_personality": "Configure it. Own it. Love it."
  };
  
  return JSON.stringify(config, null, 2);
}

/**
 * Show configuration summary with PortHub style
 */
export function showConfigurationSummary(config: WorkspaceConfig): void {
  console.log(chalk.hex('#FF9900')('\n⚙️  PortHub Configuration Summary'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  
  console.log(chalk.blue(`📝 Workspace: ${config.name}`));
  if (config.description) {
    console.log(chalk.gray(`   ${config.description}`));
  }
  
  console.log(chalk.cyan(`🔌 Port Ranges:`));
  console.log(chalk.gray(`   Static: ${config.portRanges.static[0]}-${config.portRanges.static[1]}`));
  console.log(chalk.gray(`   Dynamic: ${config.portRanges.dynamic[0]}-${config.portRanges.dynamic[1]}`));
  
  console.log(chalk.magenta(`🎭 Theme: ${config.theme}`));
  console.log(chalk.yellow(`🔍 Auto Scan: ${config.autoScan ? 'Enabled' : 'Disabled'}`));
  console.log(chalk.green(`🔔 Notifications: ${config.notifications ? 'Enabled' : 'Disabled'}`));
  
  console.log(chalk.gray('\n"Your configuration is locked and loaded"'));
}
