// PortHub Lease Management
// "DHCP for Developers - Lease It Like You Mean It"

import { PortRegistry, LeaseRequest, LeaseInfo, PortAssignment } from '../types';
import { registerPort, releasePort, listPorts, updateHeartbeat } from '../core/registry';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Parse human-readable TTL string to milliseconds
 */
export function parseTTL(ttlString: string): number {
  // Handle permanent leases
  if (ttlString.toLowerCase() === 'permanent' || ttlString.toLowerCase() === 'perm') {
    return -1; // Special value for permanent leases
  }
  
  const units: Record<string, number> = {
    's': 1000,
    'm': 60 * 1000,
    'h': 60 * 60 * 1000,
    'd': 24 * 60 * 60 * 1000,
    'w': 7 * 24 * 60 * 60 * 1000
  };
  
  const match = ttlString.match(/^(\d+)([smhdw]?)$/i);
  if (!match) {
    throw new Error(`Invalid TTL format: ${ttlString}. Use formats like "2h", "30m", "1d", or "permanent"`);
  }
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase() || 'h'; // Default to hours
  
  return value * units[unit];
}

/**
 * Format TTL milliseconds to human readable string
 */
export function formatTTL(ttlMs: number): string {
  const units = [
    { name: 'w', ms: 7 * 24 * 60 * 60 * 1000 },
    { name: 'd', ms: 24 * 60 * 60 * 1000 },
    { name: 'h', ms: 60 * 60 * 1000 },
    { name: 'm', ms: 60 * 1000 },
    { name: 's', ms: 1000 }
  ];
  
  for (const unit of units) {
    if (ttlMs >= unit.ms) {
      const value = Math.floor(ttlMs / unit.ms);
      const remainder = ttlMs % unit.ms;
      
      if (remainder === 0) {
        return `${value}${unit.name}`;
      } else {
        return `${value}${unit.name} ${formatTTL(remainder)}`;
      }
    }
  }
  
  return '0s';
}

/**
 * Auto-detect project context from current directory
 */
export async function detectProjectContext(): Promise<{ project: string; workspace: string }> {
  const cwd = process.cwd();
  let project = path.basename(cwd);
  let workspace = 'default-workspace';
  
  try {
    // Try to get git project name
    const { stdout: gitRemote } = await execAsync('git remote get-url origin 2>/dev/null || echo ""');
    if (gitRemote.trim()) {
      const match = gitRemote.match(/\/([^\/]+?)(?:\.git)?$/);
      if (match) {
        project = match[1];
      }
    }
    
    // Try to get workspace from git root or package.json
    try {
      const { stdout: gitRoot } = await execAsync('git rev-parse --show-toplevel 2>/dev/null || echo ""');
      if (gitRoot.trim()) {
        workspace = path.basename(gitRoot.trim());
      }
    } catch {
      // Fall back to directory-based detection
    }
    
    // Try package.json for project name
    const packageJsonPath = path.join(cwd, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      if (packageJson.name) {
        project = packageJson.name.replace(/^@.*\//, ''); // Remove scope
      }
    }
    
  } catch (error) {
    // Use directory name as fallback
  }
  
  return { project, workspace };
}

/**
 * Request a port lease with DHCP-style conflict resolution
 */
export async function requestLease(
  registry: PortRegistry,
  request: LeaseRequest
): Promise<{ success: boolean; lease?: LeaseInfo; alternative?: number; message: string }> {
  
  const { project: detectedProject, workspace } = await detectProjectContext();
  const project = request.project || detectedProject;
  const service = request.service || 'default-service';
  const clientId = `${project}/${service}`;
  
  console.log(chalk.hex('#FF9900')(`🎯 Requesting lease for port ${request.port}...`));
  console.log(chalk.gray(`"${project}/${service}" wants to get down and dirty`));
  
  try {
    // Check if port is already in use
    const existingAssignment = registry.ports.get(request.port);
    
    if (existingAssignment && existingAssignment.status === 'active') {
      // Port conflict - suggest alternative
      const alternative = await findAlternativePort(registry, request.port);
      
      console.log(chalk.yellow(`⚠️  Port ${request.port} is already claimed by ${existingAssignment.name}`));
      console.log(chalk.blue(`🎯 Suggested alternative: Port ${alternative}`));
      console.log(chalk.gray('"Conflicts happen. Alternatives are sexier."'));
      
      return {
        success: false,
        alternative,
        message: `Port ${request.port} conflicts with ${existingAssignment.name}. Try port ${alternative} instead.`
      };
    }
    
    // Calculate TTL  
    const ttlMs = request.ttl ? parseTTL(request.ttl) : parseTTL('2h'); // Default 2 hours
    const isPermanent = request.permanent || ttlMs === -1;
    const expiresAt = isPermanent ? undefined : new Date(Date.now() + ttlMs);
    
    // Register the port
    const assignment = await registerPort(
      registry,
      request.port,
      clientId,
      service,
      {
        description: request.description,
        type: 'dynamic',
        workspace,
        project,
        tags: ['lease', project, service]
      }
    );
    
    // Update with lease-specific fields
    assignment.expiresAt = expiresAt;
    assignment.status = isPermanent ? 'permanent' : 'active';
    assignment.metadata = {
      ...assignment.metadata,
      ttl: isPermanent ? undefined : ttlMs,
      permanent: isPermanent,
      autoRenew: request.autoRenew || false
    };
    
    const lease: LeaseInfo = {
      port: request.port,
      project,
      service,
      clientId,
      assignedAt: assignment.assignedAt,
      expiresAt,
      ttl: isPermanent ? undefined : ttlMs,
      status: isPermanent ? 'permanent' : 'active',
      lastHeartbeat: assignment.lastHeartbeat,
      autoRenew: request.autoRenew || false,
      permanent: isPermanent
    };
    
    console.log(chalk.green(`✅ Port ${request.port} leased successfully!`));
    console.log(chalk.cyan(`🎭 Project: ${project}`));
    console.log(chalk.cyan(`🔧 Service: ${service}`));
    if (isPermanent) {
      console.log(chalk.magenta(`♾️  Lease: PERMANENT (never expires)`));
    } else {
      console.log(chalk.cyan(`⏰ Expires: ${formatTTL(ttlMs)} (${expiresAt?.toLocaleString()})`));
    }
    console.log(chalk.gray('"Your port is now officially yours, you magnificent beast"'));
    
    return {
      success: true,
      lease,
      message: `Port ${request.port} leased to ${project}/${service} for ${formatTTL(ttlMs)}`
    };
    
  } catch (error) {
    console.error(chalk.red('💥 Lease request failed:'), error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown lease error'
    };
  }
}

/**
 * Release a port lease
 */
export async function releaseLease(
  registry: PortRegistry,
  port: number,
  project?: string
): Promise<{ success: boolean; message: string }> {
  
  console.log(chalk.hex('#FF9900')(`🔓 Releasing lease for port ${port}...`));
  
  const assignment = registry.ports.get(port);
  if (!assignment) {
    console.log(chalk.yellow(`⚠️  Port ${port} is not currently leased`));
    return {
      success: false,
      message: `Port ${port} is not currently leased`
    };
  }
  
  // If project specified, verify ownership
  if (project && assignment.metadata?.project !== project) {
    console.log(chalk.red(`❌ Access denied: Port ${port} belongs to ${assignment.metadata?.project}`));
    return {
      success: false,
      message: `Access denied: Port ${port} belongs to ${assignment.metadata?.project}`
    };
  }
  
  try {
    const released = await releasePort(registry, port, assignment.clientId);
    
    if (released) {
      console.log(chalk.green(`✅ Port ${port} released successfully!`));
      console.log(chalk.gray('"Another satisfied customer checks out"'));
      return {
        success: true,
        message: `Port ${port} released successfully`
      };
    } else {
      return {
        success: false,
        message: `Failed to release port ${port}`
      };
    }
    
  } catch (error) {
    console.error(chalk.red('💥 Release failed:'), error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown release error'
    };
  }
}

/**
 * Show all active leases with DHCP-style status
 */
export async function showLeaseStatus(registry: PortRegistry): Promise<void> {
  const ports = await listPorts(registry);
  const activeLeases = ports.filter(p => p.status === 'active' && p.metadata?.ttl);
  
  console.log(chalk.hex('#FF9900')('\n📊 PortHub Lease Status'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  
  if (activeLeases.length === 0) {
    console.log(chalk.yellow('🤷 No active leases found'));
    console.log(chalk.gray('"Looks like a quiet neighborhood"'));
    return;
  }
  
  console.log(chalk.blue(`📈 Active Leases: ${activeLeases.length}`));
  console.log(chalk.gray(`📍 Registry Version: ${registry.version}`));
  
  console.log(chalk.hex('#FF9900')('\n🍆 Active Port Leases:'));
  
  activeLeases.forEach(assignment => {
    const now = Date.now();
    const isPermanent = assignment.status === 'permanent' || assignment.metadata?.permanent;
    const expiresAt = assignment.expiresAt ? assignment.expiresAt.getTime() : now;
    const timeLeft = isPermanent ? Infinity : Math.max(0, expiresAt - now);
    
    const statusEmoji = isPermanent ? '♾️' : (timeLeft > 0 ? '🔌' : '⏰');
    const project = assignment.metadata?.project || 'unknown';
    const service = assignment.metadata?.service || assignment.name;
    const ttlLeft = isPermanent ? 'PERMANENT' : (timeLeft > 0 ? formatTTL(timeLeft) : 'EXPIRED');
    
    const statusColor = isPermanent ? chalk.magenta : (timeLeft > 0 ? chalk.green : chalk.red);
    
    console.log(`   ${statusEmoji} Port ${chalk.hex('#FF9900')(assignment.port.toString())} - ${chalk.cyan(project)}/${chalk.magenta(service)}`);
    console.log(`      ${statusColor(`Expires in ${ttlLeft}`)} ${chalk.gray(`(${assignment.expiresAt?.toLocaleString()})`)}`);
    
    if (assignment.metadata?.autoRenew) {
      console.log(chalk.gray(`      🔄 Auto-renewal enabled`));
    }
  });
  
  console.log(chalk.hex('#FF9900')('\n🎭 "Your leases are under professional management"'));
}

/**
 * Send heartbeat to keep lease alive
 */
export async function sendHeartbeat(
  registry: PortRegistry,
  port: number,
  project?: string
): Promise<{ success: boolean; message: string; timeLeft?: string }> {
  
  const assignment = registry.ports.get(port);
  if (!assignment) {
    return {
      success: false,
      message: `Port ${port} is not currently leased`
    };
  }
  
  // Verify project ownership if specified
  if (project && assignment.metadata?.project !== project) {
    return {
      success: false,
      message: `Access denied: Port ${port} belongs to ${assignment.metadata?.project}`
    };
  }
  
  try {
    const updated = await updateHeartbeat(registry, port, assignment.clientId);
    
    if (updated) {
      const now = Date.now();
      const expiresAt = assignment.expiresAt ? assignment.expiresAt.getTime() : now;
      const timeLeft = Math.max(0, expiresAt - now);
      
      return {
        success: true,
        message: `Heartbeat sent for port ${port}`,
        timeLeft: formatTTL(timeLeft)
      };
    } else {
      return {
        success: false,
        message: `Failed to send heartbeat for port ${port}`
      };
    }
    
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown heartbeat error'
    };
  }
}

/**
 * Find an alternative port when conflicts occur
 */
async function findAlternativePort(registry: PortRegistry, requestedPort: number): Promise<number> {
  // Try ports near the requested port first
  const candidates = [
    requestedPort + 1,
    requestedPort + 2,
    requestedPort + 10,
    requestedPort + 100,
    requestedPort - 1,
    requestedPort - 2,
    3000 + Math.floor(Math.random() * 1000), // Random in 3000-4000 range
    8000 + Math.floor(Math.random() * 1000)  // Random in 8000-9000 range
  ];
  
  for (const candidate of candidates) {
    if (candidate > 1024 && candidate < 65535) {
      const existing = registry.ports.get(candidate);
      if (!existing || existing.status !== 'active') {
        return candidate;
      }
    }
  }
  
  // Fallback to random port in dynamic range
  return 3000 + Math.floor(Math.random() * 1000);
}
