#!/usr/bin/env node

// PortHub CLI - "The Protocol Registry That Parties Responsibly"
// "Bind it. Spit on it. Make it yours."

import { Command } from 'commander';
import chalk from 'chalk';
import { showBanner } from '../utils/banner';
import { readFileSync } from 'fs';
import { join } from 'path';

const program = new Command();

// Get version from package.json
const getVersion = (): string => {
  try {
    const packageJsonPath = join(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    return '0.1.0-alpha.5'; // Fallback version
  }
};

// PortHub CLI Setup with Personality
program
  .name('porthub')
  .description('The Protocol Registry That Parties Responsibly')
  .version(getVersion(), '-v, --version', 'Show PortHub version')
  .option('-d, --debug', 'Enable debug mode (for when things get dirty)')
  .option('--raw', 'Raw output mode (no fancy formatting)')
  .hook('preAction', (thisCommand) => {
    if (!thisCommand.opts().raw) {
      showBanner();
    }
  });

// Start Command - "Get it up. Get it bound. Stay registered."
const startCommand = program
  .command('start')
  .description('Start PortHub services and daemons')
  .option('-p, --port <number>', 'Port for daemon to listen on', '3000')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('--daemon', 'Run as background daemon')
  .option('--debug', 'Enable debug logging')
  .action(async (options) => {
    try {
      console.log(chalk.hex('#FF9900')('🚀 Starting PortHub services...'));
      console.log(chalk.gray('"Get it up. Get it bound. Stay registered."'));
      
      if (options.port) {
        console.log(chalk.blue(`🎯 Daemon will listen on port ${options.port}`));
      }
      if (options.daemon) {
        console.log(chalk.gray('"Running in the background like a true professional"'));
      }
      if (options.debug) {
        console.log(chalk.yellow('🐛 Debug mode enabled'));
      }
      
      // Import and start the actual daemon
      const { startDaemon } = await import('../daemon/daemon');
      
      const daemonInstance = await startDaemon({
        port: parseInt(options.port) || 3000,
        configPath: options.config,
        debug: options.debug || false
      });
      
      console.log(chalk.green('\n✅ PortHub daemon started successfully!'));
      console.log(chalk.gray('"Your ports are now under professional management"'));
      
      // Keep the process running
      process.on('SIGINT', async () => {
        console.log(chalk.yellow('\n🛑 Graceful shutdown initiated...'));
        await daemonInstance.stop();
        process.exit(0);
      });
      
    } catch (error) {
      console.error(chalk.red('💥 Failed to start PortHub daemon:'), error);
      console.error(chalk.gray('"Even the best pimps have bad days"'));
      process.exit(1);
    }
  });

// Add SneakySniffer subcommand with REAL port scanning
startCommand
  .command('sneakysniffer')
  .description('Start the SneakySniffer port scanning service')
  .option('--dirty', 'Enable aggressive scanning')
  .option('--clean', 'Clean mode - only scan registered ports')
  .option('--diponly', 'Deep inspection only - no surface scanning')
  .option('--range <range>', 'Port range to scan (e.g., 3000-4000)')
  .option('--timeout <ms>', 'Scan timeout in milliseconds', '5000')
  .action(async (options) => {
    try {
      // Import port scanner
      const { scanPorts, displayScanResults } = await import('../utils/portScanner');
      
      console.log(chalk.hex('#FF9900')('👃 Starting SneakySniffer...'));
      console.log(chalk.gray('"We keep it clean. Your services won\'t."'));
      
      // Configure scan options based on flags
      const scanOptions = {
        portRange: options.range,
        protocol: options.diponly ? 'tcp' : 'both' as 'tcp' | 'udp' | 'both',
        timeout: parseInt(options.timeout) || 5000,
        aggressive: options.dirty || false
      };
      
      if (options.dirty) {
        console.log(chalk.yellow('⚠️  Dirty mode enabled - aggressive scanning active'));
      }
      if (options.clean) {
        console.log(chalk.blue('🧼 Clean mode - only scanning registered ports'));
      }
      if (options.diponly) {
        console.log(chalk.magenta('🔍 Deep inspection mode - thorough analysis'));
      }
      if (options.range) {
        console.log(chalk.cyan(`🎯 Scanning port range: ${options.range}`));
      }
      
      // Perform actual port scan
      const scanResult = await scanPorts(scanOptions);
      
      // Display results with PortHub personality
      displayScanResults(scanResult, scanOptions);
      
      console.log(chalk.green('\n✅ SneakySniffer scan completed successfully!'));
      console.log(chalk.gray('"Your network secrets have been exposed"'));
      
    } catch (error) {
      console.error(chalk.red('💥 SneakySniffer scan failed:'), error);
      console.error(chalk.gray('"Even the best sniffers have off days"'));
      process.exit(1);
    }
  });

// Pimp Command - "Port Pimp: Your Personal Port Manager"
const pimpCommand = program
  .command('pimp')
  .description('Port Pimp: Your Personal Port Manager')
  .option('-v, --verbose', 'Verbose output')
  .option('--force', 'Force operations without confirmation')
  .action(async (options) => {
    console.log(chalk.hex('#FF9900')('🎭 Port Pimp at your service...'));
    console.log(chalk.gray('"I\'ll handle this crisis for you, sir"'));
    
    if (options.verbose) {
      console.log(chalk.blue('📊 Verbose mode enabled'));
    }
    if (options.force) {
      console.log(chalk.yellow('⚡ Force mode enabled'));
    }
    
    // TODO: Implement Port Pimp functionality
    console.log(chalk.gray('Port Pimp functionality coming soon...'));
  });

// Add pimp status subcommand
pimpCommand
  .command('status')
  .description('Show current Port Pimp status')
  .option('--json', 'Output in JSON format')
  .action(async (options) => {
    console.log(chalk.hex('#FF9900')('📊 Port Pimp Status Report'));
    console.log(chalk.gray('"Here\'s what I\'m managing for you"'));
    
    if (options.json) {
      console.log(chalk.blue('📋 JSON output enabled'));
    }
    
    // TODO: Implement status reporting
    console.log(chalk.gray('Status reporting coming soon...'));
  });

// Explode Command - "Port Exploder: Dashboard and Management"
program
  .command('explode')
  .description('Port Exploder: Dashboard and Management')
  .action(async (options) => {
    console.log(chalk.hex('#FF9900')('💥 Port Exploder activated...'));
    console.log(chalk.gray('"Here\'s what happened, good luck figuring it out"'));
  });

// Fluff Command - "Port Fluffer: Notifications and Help"
program
  .command('fluff')
  .description('Port Fluffer: Notifications and Help')
  .action(async (options) => {
    console.log(chalk.hex('#FF9900')('🧼 Port Fluffer ready to help...'));
    console.log(chalk.gray('"Little Snitch-style notifications for conflicts"'));
  });

// Lease Command - "DHCP for Developers"
program
  .command('lease')
  .description('Lease a port like a true professional')
  .argument('<port>', 'Port number to lease')
  .option('-p, --project <name>', 'Project name (auto-detected if not specified)')
  .option('-s, --service <name>', 'Service name', 'default-service')
  .option('-t, --ttl <duration>', 'Lease duration (e.g., "2h", "30m", "1d", "permanent")', '2h')
  .option('-d, --description <desc>', 'Port description')
  .option('--auto-renew', 'Enable automatic lease renewal')
  .option('--permanent', 'Create permanent lease (never expires)')
  .action(async (portStr, options) => {
    try {
      const port = parseInt(portStr);
      if (isNaN(port) || port < 1024 || port > 65535) {
        console.error(chalk.red('💥 Invalid port number. Use ports between 1024-65535'));
        process.exit(1);
      }
      
      const { sendToMaemon, isDaemonRunning } = await import('../utils/ipcClient');
      
      if (!isDaemonRunning()) {
        console.error(chalk.red('💥 PortHub daemon not running'));
        console.log(chalk.gray('Start it with: porthub start --daemon'));
        process.exit(1);
      }
      
      const result = await sendToMaemon('LEASE', {
        port,
        metadata: {
          project: options.project,
          service: options.service,
          description: options.description,
          autoRenew: options.autoRenew,
          permanent: options.permanent
        },
        ttl: options.ttl
      });
      
      if (result.success) {
        console.log(chalk.green(`✅ ${result.message}`));
        if (options.permanent || options.ttl === 'permanent') {
          console.log(chalk.magenta('♾️  Lease: PERMANENT (never expires)'));
        } else {
          console.log(chalk.cyan(`⏰ Expires: ${result.expiresAt?.toLocaleString()}`));
        }
        console.log(chalk.gray('"Your port is now officially yours, you magnificent beast"'));
      } else {
        console.error(chalk.red(`💥 Lease failed: ${result.message}`));
        process.exit(1);
      }
      
    } catch (error) {
      console.error(chalk.red('💥 Lease command failed:'), error);
      process.exit(1);
    }
  });

// Release Command - "Set Your Ports Free"
program
  .command('release')
  .description('Release a port lease')
  .argument('<port>', 'Port number to release')
  .option('-p, --project <name>', 'Project name (for verification)')
  .action(async (portStr, options) => {
    try {
      const port = parseInt(portStr);
      if (isNaN(port)) {
        console.error(chalk.red('💥 Invalid port number'));
        process.exit(1);
      }
      
      const { sendToMaemon, isDaemonRunning } = await import('../utils/ipcClient');
      
      if (!isDaemonRunning()) {
        console.error(chalk.red('💥 PortHub daemon not running'));
        console.log(chalk.gray('Start it with: porthub start --daemon'));
        process.exit(1);
      }
      
      const result = await sendToMaemon('RELEASE', {
        port,
        metadata: {
          project: options.project
        }
      });
      
      if (result.success) {
        console.log(chalk.green(`✅ ${result.message}`));
        console.log(chalk.gray('"Port released and ready for its next adventure"'));
      } else {
        console.error(chalk.red(`💥 Release failed: ${result.message}`));
        process.exit(1);
      }
      
    } catch (error) {
      console.error(chalk.red('💥 Release command failed:'), error);
      process.exit(1);
    }
  });

// Status Command - "See What's Getting Action"
program
  .command('status')
  .description('Show all active port leases')
  .option('--json', 'Output in JSON format')
  .action(async (options) => {
    try {
      const { sendToMaemon, isDaemonRunning } = await import('../utils/ipcClient');
      
      if (!isDaemonRunning()) {
        console.error(chalk.red('💥 PortHub daemon not running'));
        console.log(chalk.gray('Start it with: porthub start --daemon'));
        process.exit(1);
      }
      
      const result = await sendToMaemon('STATUS');
      
      if (result.success) {
        if (options.json) {
          console.log(JSON.stringify(result.leases, null, 2));
        } else {
          console.log(chalk.hex('#FF9900')('\n📊 PortHub Lease Status'));
          console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
          
          if (result.leases.length === 0) {
            console.log(chalk.yellow('🤷 No active leases found'));
            console.log(chalk.gray('"Looks like a quiet neighborhood"'));
          } else {
            console.log(chalk.blue(`📈 Active Leases: ${result.leases.length}`));
            console.log(chalk.hex('#FF9900')('\n🍆 Active Port Leases:'));
            
            result.leases.forEach((lease: any) => {
              const statusEmoji = lease.permanent ? '♾️' : '🔌';
              const statusText = lease.permanent ? 'PERMANENT' : `Expires ${lease.expiresAt ? new Date(lease.expiresAt).toLocaleString() : 'unknown'}`;
              const statusColor = lease.permanent ? chalk.magenta : chalk.green;
              
              console.log(`   ${statusEmoji} Port ${chalk.hex('#FF9900')(lease.port.toString())} - ${chalk.cyan(lease.project)}/${chalk.magenta(lease.service)}`);
              console.log(`      ${statusColor(statusText)}`);
            });
          }
          console.log(chalk.gray('\n"Your port status has been revealed"'));
        }
      } else {
        console.error(chalk.red('💥 Failed to get status'));
        process.exit(1);
      }
      
    } catch (error) {
      console.error(chalk.red('💥 Status command failed:'), error);
      process.exit(1);
    }
  });

// Heartbeat Command - "Keep It Alive"
program
  .command('heartbeat')
  .description('Send heartbeat to keep lease alive')
  .argument('<port>', 'Port number to renew')
  .option('-p, --project <name>', 'Project name (for verification)')
  .action(async (portStr, options) => {
    try {
      const port = parseInt(portStr);
      if (isNaN(port)) {
        console.error(chalk.red('💥 Invalid port number'));
        process.exit(1);
      }
      
      const { sendToMaemon, isDaemonRunning } = await import('../utils/ipcClient');
      
      if (!isDaemonRunning()) {
        console.error(chalk.red('💥 PortHub daemon not running'));
        console.log(chalk.gray('Start it with: porthub start --daemon'));
        process.exit(1);
      }
      
      const result = await sendToMaemon('HEARTBEAT', {
        port,
        metadata: {
          project: options.project
        }
      });
      
      if (result.success) {
        console.log(chalk.green(`✅ ${result.message}`));
        console.log(chalk.cyan(`💓 Lease extended until: ${result.expiresAt?.toLocaleString()}`));
        console.log(chalk.gray('"Your port is feeling the love"'));
      } else {
        console.error(chalk.red(`💥 Heartbeat failed: ${result.message}`));
        process.exit(1);
      }
      
    } catch (error) {
      console.error(chalk.red('💥 Heartbeat command failed:'), error);
      process.exit(1);
    }
  });

// Discover Command - "Multi-Workspace Discovery"
program
  .command('discover')
  .description('Discover PortHub workspaces across the system')
  .option('--register', 'Register PortHub infrastructure ports permanently')
  .action(async (options) => {
    try {
      const { showBanner } = await import('../utils/banner');
      const { discoverWorkspaces, registerPortHubPorts } = await import('../utils/config');
      
      showBanner();
      
      console.log(chalk.hex('#FF9900')('🔍 Starting workspace discovery...'));
      console.log(chalk.gray('"Let\'s see what we\'re working with"'));
      
      // Discover workspaces
      const workspaces = await discoverWorkspaces();
      
      if (workspaces.length === 0) {
        console.log(chalk.yellow('📝 No workspace configurations found'));
        console.log(chalk.gray('💡 Create a porthub.json file in your project directories'));
        console.log(chalk.gray('   Run: porthub init'));
      } else {
        console.log(chalk.hex('#FF9900')('\n🏢 Discovered Workspaces:'));
        console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        
        workspaces.forEach((workspace, index) => {
          console.log(chalk.blue(`📝 ${index + 1}. ${workspace.name}`));
          if (workspace.description) {
            console.log(chalk.gray(`   ${workspace.description}`));
          }
          console.log(chalk.cyan(`   🔌 Static: ${workspace.portRanges.static[0]}-${workspace.portRanges.static[1]}`));
          console.log(chalk.cyan(`   🔌 Dynamic: ${workspace.portRanges.dynamic[0]}-${workspace.portRanges.dynamic[1]}`));
          console.log(chalk.magenta(`   🎭 Theme: ${workspace.theme}`));
          console.log('');
        });
      }
      
      // Register infrastructure ports if requested
      if (options.register) {
        console.log(chalk.hex('#FF9900')('\n🏠 Registering PortHub Infrastructure...'));
        console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        await registerPortHubPorts();
      } else {
        console.log(chalk.yellow('\n💡 Tip: Use --register to claim PortHub infrastructure ports permanently'));
        console.log(chalk.gray('   porthub discover --register'));
      }
      
      console.log(chalk.gray('\n"Discovery mission accomplished"'));
      
    } catch (error) {
      console.error(chalk.red('💥 PortHub discovery failed:'), error);
      process.exit(1);
    }
  });

// SneakySniffer Command - "Port Scanning with Attitude"
program
  .command('sneakysniffer')
  .description('Port Scanning with Attitude')
  .action(async (options) => {
    console.log(chalk.hex('#FF9900')('👃 SneakySniffer on the prowl...'));
    console.log(chalk.gray('"We keep it clean. Your services won\'t."'));
  });

// Global Error Handler with PortHub Personality
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('💥 PortHub had a nuclear moment:'), reason);
  console.error(chalk.gray('"Sometimes things get a little too hot to handle"'));
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error(chalk.red('💀 PortHub crashed and burned:'), error.message);
  console.error(chalk.gray('"Even the best pimps have bad days"'));
  process.exit(1);
});

// Parse and execute
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  showBanner();
  console.log(chalk.hex('#FF9900')('🎭 PortHub CLI Help'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  program.outputHelp();
  console.log(chalk.hex('#FF9900')('\n🎭 Remember: "No Conflicts. Just Connections."'));
  console.log(chalk.gray('"Get it up. Get it bound. Stay registered."'));
}
