// PortHub Core Registry
// "Where Every Port Gets Action"

import { PortRegistry, PortAssignment, WorkspaceConfig } from '../types';
import chalk from 'chalk';

export async function createRegistry(config: WorkspaceConfig): Promise<PortRegistry> {
  console.log(chalk.hex('#FF9900')('🏗️  Creating PortHub registry...'));
  
  const registry: PortRegistry = {
    version: 1,
    ports: new Map(),
    lastUpdated: new Date()
  };
  
  console.log(chalk.green('✅ Registry created successfully'));
  return registry;
}

export async function registerPort(
  registry: PortRegistry,
  port: number,
  clientId: string,
  name: string,
  options: {
    description?: string;
    type?: 'static' | 'dynamic';
    workspace?: string;
    project?: string;
    tags?: string[];
    ttl?: number;
  } = {}
): Promise<PortAssignment> {
  // Check if port is already registered
  if (registry.ports.has(port)) {
    const existing = registry.ports.get(port)!;
    if (existing.status === 'active') {
      throw new Error(`Port ${port} is already claimed by ${existing.clientId} - "Port already claimed, you greedy bastard"`);
    }
  }
  
  const now = new Date();
  const assignment: PortAssignment = {
    port,
    clientId,
    name,
    description: options.description,
    type: options.type || 'dynamic',
    workspace: options.workspace,
    project: options.project,
    tags: options.tags || [],
    registeredAt: now,
    assignedAt: now,
    lastHeartbeat: now,
    status: 'active',
    metadata: {}
  };
  
  // Set expiration for dynamic ports
  if (options.ttl && assignment.type === 'dynamic') {
    assignment.expiresAt = new Date(now.getTime() + options.ttl * 1000);
  }
  
  registry.ports.set(port, assignment);
  registry.lastUpdated = now;
  
  console.log(chalk.green(`✅ Port ${port} registered successfully`));
  console.log(chalk.gray(`"Port ${port} is yours, you magnificent beast"`));
  
  return assignment;
}

export async function releasePort(
  registry: PortRegistry,
  port: number,
  clientId: string
): Promise<boolean> {
  const assignment = registry.ports.get(port);
  
  if (!assignment) {
    throw new Error(`Port ${port} is not registered`);
  }
  
  if (assignment.clientId !== clientId) {
    throw new Error(`Port ${port} is not yours to release - "That's not your port to give away"`);
  }
  
  registry.ports.delete(port);
  registry.lastUpdated = new Date();
  
  console.log(chalk.yellow(`🔄 Port ${port} released successfully`));
  console.log(chalk.gray(`"Port ${port} is back on the market"`));
  
  return true;
}

export async function getPortAssignment(
  registry: PortRegistry,
  port: number
): Promise<PortAssignment | null> {
  return registry.ports.get(port) || null;
}

export async function listPorts(
  registry: PortRegistry,
  filter?: {
    status?: string;
    type?: string;
    workspace?: string;
    project?: string;
  }
): Promise<PortAssignment[]> {
  let ports = Array.from(registry.ports.values());
  
  if (filter) {
    if (filter.status) {
      ports = ports.filter(p => p.status === filter.status);
    }
    if (filter.type) {
      ports = ports.filter(p => p.type === filter.type);
    }
    if (filter.workspace) {
      ports = ports.filter(p => p.workspace === filter.workspace);
    }
    if (filter.project) {
      ports = ports.filter(p => p.project === filter.project);
    }
  }
  
  return ports.sort((a, b) => a.port - b.port);
}

export async function updateHeartbeat(
  registry: PortRegistry,
  port: number,
  clientId: string
): Promise<boolean> {
  const assignment = registry.ports.get(port);
  
  if (!assignment) {
    return false;
  }
  
  if (assignment.clientId !== clientId) {
    return false;
  }
  
  assignment.lastHeartbeat = new Date();
  registry.lastUpdated = new Date();
  
  return true;
}

export async function cleanupExpiredPorts(registry: PortRegistry): Promise<number> {
  const now = new Date();
  let cleanedCount = 0;
  
  for (const [port, assignment] of registry.ports.entries()) {
    // Skip permanent leases - they never expire
    if (assignment.status === 'permanent' || assignment.metadata?.permanent) {
      continue;
    }
    
    if (assignment.expiresAt && assignment.expiresAt < now) {
      // Check if auto-renewal is enabled
      if (assignment.metadata?.autoRenew) {
        // Extend lease by original TTL
        const originalTTL = assignment.metadata?.ttl || (2 * 60 * 60 * 1000); // Default 2 hours
        assignment.expiresAt = new Date(now.getTime() + originalTTL);
        assignment.lastHeartbeat = now;
        
        console.log(chalk.blue(`🔄 Auto-renewed lease for port ${port} (${assignment.name})`));
        console.log(chalk.gray(`"${assignment.metadata?.project || 'Unknown'} gets another round"`));
      } else {
        // Mark as expired but don't remove yet (for status reporting)
        assignment.status = 'expired';
        cleanedCount++;
        
        const project = assignment.metadata?.project || 'unknown';
        const service = assignment.metadata?.service || assignment.name;
        
        console.log(chalk.yellow(`⏰ Lease expired for port ${port} - ${project}/${service}`));
        console.log(chalk.gray('"Time\'s up, checkout time"'));
      }
    }
  }
  
  if (cleanedCount > 0) {
    registry.version++;
    registry.lastUpdated = now;
  }
  
  return cleanedCount;
}

/**
 * Get lease information for a port
 */
export async function getLeaseInfo(registry: PortRegistry, port: number): Promise<any | null> {
  const assignment = registry.ports.get(port);
  if (!assignment) {
    return null;
  }
  
  const now = Date.now();
  const expiresAt = assignment.expiresAt ? assignment.expiresAt.getTime() : now;
  const timeLeft = Math.max(0, expiresAt - now);
  
  return {
    port: assignment.port,
    project: assignment.metadata?.project || 'unknown',
    service: assignment.metadata?.service || assignment.name,
    clientId: assignment.clientId,
    assignedAt: assignment.assignedAt,
    expiresAt: assignment.expiresAt,
    ttl: assignment.metadata?.ttl || 0,
    timeLeft,
    status: timeLeft > 0 ? 'active' : 'expired',
    lastHeartbeat: assignment.lastHeartbeat,
    autoRenew: assignment.metadata?.autoRenew || false
  };
}

/**
 * Extend lease TTL for a port
 */
export async function extendLease(
  registry: PortRegistry, 
  port: number, 
  clientId: string, 
  additionalTTL: number
): Promise<boolean> {
  const assignment = registry.ports.get(port);
  
  if (!assignment || assignment.clientId !== clientId) {
    return false;
  }
  
  const now = new Date();
  const currentExpiry = assignment.expiresAt ? assignment.expiresAt.getTime() : now.getTime();
  const newExpiry = new Date(Math.max(currentExpiry, now.getTime()) + additionalTTL);
  
  assignment.expiresAt = newExpiry;
  assignment.lastHeartbeat = now;
  
  registry.version++;
  registry.lastUpdated = now;
  
  console.log(chalk.green(`🔄 Extended lease for port ${port} until ${newExpiry.toLocaleString()}`));
  console.log(chalk.gray('"More time for more action"'));
  
  return true;
}
