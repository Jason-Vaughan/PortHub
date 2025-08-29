// PortHub Port Scanner Utility
// "SneakySniffer: Port Scanning with Attitude"

import { exec } from 'child_process';
import { promisify } from 'util';
import { ServiceInfo, ScanResult } from '../types';
import chalk from 'chalk';

const execAsync = promisify(exec);

export interface PortScanOptions {
  portRange?: string;
  protocol?: 'tcp' | 'udp' | 'both';
  timeout?: number;
  aggressive?: boolean;
}

export interface PortScannerResult {
  totalPorts: number;
  activePorts: ServiceInfo[];
  conflicts: ServiceInfo[];
  unregistered: ServiceInfo[];
  scanTime: number;
}

/**
 * Scan ports using macOS netstat command
 * Returns detailed information about active ports and services
 */
export async function scanPorts(options: PortScanOptions = {}): Promise<PortScannerResult> {
  const startTime = Date.now();
  
  try {
    console.log(chalk.hex('#FF9900')('👃 SneakySniffer scanning ports...'));
    console.log(chalk.gray('"Let\'s see what\'s lurking in the shadows"'));
    
    // Use netstat to get port information
    const netstatCommand = buildNetstatCommand(options);
    const { stdout: netstatOutput } = await execAsync(netstatCommand);
    
    // Parse netstat output
    const activePorts = parseNetstatOutput(netstatOutput);
    
    // Use lsof for additional process information
    const enrichedPorts = await enrichWithProcessInfo(activePorts);
    
    // Filter by port range if specified
    const filteredPorts = filterByPortRange(enrichedPorts, options.portRange);
    
    const scanTime = Date.now() - startTime;
    
    console.log(chalk.green(`✅ Port scan completed in ${scanTime}ms`));
    console.log(chalk.gray(`"Found ${filteredPorts.length} active ports"`));
    
    return {
      totalPorts: filteredPorts.length,
      activePorts: filteredPorts,
      conflicts: [], // TODO: Implement conflict detection with registry
      unregistered: filteredPorts, // For now, all ports are unregistered
      scanTime
    };
    
  } catch (error) {
    console.error(chalk.red('💥 Port scan failed:'), error);
    console.error(chalk.gray('"Even the best sniffers have off days"'));
    throw error;
  }
}

/**
 * Build netstat command based on options
 */
function buildNetstatCommand(options: PortScanOptions): string {
  let command = 'netstat -an';
  
  // Add protocol filter
  if (options.protocol === 'tcp') {
    command += ' -p tcp';
  } else if (options.protocol === 'udp') {
    command += ' -p udp';
  }
  
  // Add listening ports only
  command += ' | grep LISTEN';
  
  return command;
}

/**
 * Parse netstat output to extract port information
 */
function parseNetstatOutput(output: string): ServiceInfo[] {
  const lines = output.trim().split('\n');
  const ports: ServiceInfo[] = [];
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    // Parse netstat line format: tcp4   0   0  *.3000  *.* LISTEN
    const parts = line.trim().split(/\s+/);
    if (parts.length < 4) continue;
    
    const protocol = parts[0];
    const localAddress = parts[3];
    
    // Extract port from address (e.g., "*.3000" or "127.0.0.1.3000")
    const portMatch = localAddress.match(/[.*:](\d+)$/);
    if (!portMatch) continue;
    
    const port = parseInt(portMatch[1]);
    if (isNaN(port)) continue;
    
    ports.push({
      pid: 0, // Will be enriched with lsof
      name: 'unknown',
      port,
      protocol: protocol.includes('tcp') ? 'tcp' : 'udp',
      status: 'listening',
      processPath: undefined,
      commandLine: undefined
    });
  }
  
  return ports;
}

/**
 * Enrich port information with process details using lsof
 */
async function enrichWithProcessInfo(ports: ServiceInfo[]): Promise<ServiceInfo[]> {
  const enrichedPorts: ServiceInfo[] = [];
  
  for (const portInfo of ports) {
    try {
      // Use lsof to get process information for this port
      const lsofCommand = `lsof -i :${portInfo.port} -n -P`;
      const { stdout: lsofOutput } = await execAsync(lsofCommand);
      
      const enriched = parseLsofOutput(lsofOutput, portInfo);
      enrichedPorts.push(enriched);
      
    } catch (error) {
      // If lsof fails, keep the original port info
      enrichedPorts.push(portInfo);
    }
  }
  
  return enrichedPorts;
}

/**
 * Parse lsof output to extract process information
 */
function parseLsofOutput(output: string, basePort: ServiceInfo): ServiceInfo {
  const lines = output.trim().split('\n');
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Parse lsof line format: COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
    const parts = line.trim().split(/\s+/);
    if (parts.length < 9) continue;
    
    const command = parts[0];
    const pid = parseInt(parts[1]);
    const user = parts[2];
    
    if (!isNaN(pid)) {
      return {
        ...basePort,
        pid,
        name: command,
        processPath: `${user}/${command}`,
        commandLine: `${command} (PID: ${pid})`
      };
    }
  }
  
  return basePort;
}

/**
 * Filter ports by specified port range
 */
function filterByPortRange(ports: ServiceInfo[], portRange?: string): ServiceInfo[] {
  if (!portRange) return ports;
  
  // Parse range like "3000-4000" or single port "3000"
  const rangeMatch = portRange.match(/^(\d+)(?:-(\d+))?$/);
  if (!rangeMatch) return ports;
  
  const startPort = parseInt(rangeMatch[1]);
  const endPort = rangeMatch[2] ? parseInt(rangeMatch[2]) : startPort;
  
  return ports.filter(port => port.port >= startPort && port.port <= endPort);
}

/**
 * Display scan results with PortHub personality
 */
export function displayScanResults(result: PortScannerResult, options: PortScanOptions = {}): void {
  console.log(chalk.hex('#FF9900')('\n🎯 SneakySniffer Results'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  
  console.log(chalk.blue(`📊 Scan Summary:`));
  console.log(chalk.gray(`   ⏱️  Scan time: ${result.scanTime}ms`));
  console.log(chalk.gray(`   🔌 Active ports: ${result.totalPorts}`));
  console.log(chalk.gray(`   ⚠️  Conflicts: ${result.conflicts.length}`));
  console.log(chalk.gray(`   👻 Unregistered: ${result.unregistered.length}`));
  
  if (result.activePorts.length === 0) {
    console.log(chalk.yellow('\n🤷 No active ports found'));
    console.log(chalk.gray('"Looks like a quiet neighborhood"'));
    return;
  }
  
  console.log(chalk.hex('#FF9900')('\n🍆 Active Ports:'));
  result.activePorts.forEach(port => {
    const statusEmoji = port.protocol === 'tcp' ? '🔌' : '📡';
    const processInfo = port.name !== 'unknown' ? chalk.cyan(port.name) : chalk.gray('unknown');
    const pidInfo = port.pid > 0 ? chalk.gray(`(PID: ${port.pid})`) : '';
    
    console.log(`   ${statusEmoji} Port ${chalk.hex('#FF9900')(port.port.toString())} - ${processInfo} ${pidInfo}`);
    
    if (options.aggressive && port.processPath) {
      console.log(chalk.gray(`      📁 ${port.processPath}`));
    }
  });
  
  console.log(chalk.hex('#FF9900')('\n🎭 "Your ports are now under surveillance"'));
}
