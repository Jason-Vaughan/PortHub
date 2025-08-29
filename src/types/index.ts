// PortHub Core Type Definitions
// "Where Every Port Gets Action"

export interface PortRegistry {
  version: number;
  ports: Map<number, PortAssignment>;
  lastUpdated: Date;
}

export interface PortAssignment {
  port: number;
  clientId: string;
  name: string;
  description?: string;
  type: 'static' | 'dynamic';
  workspace?: string;
  project?: string;
  tags?: string[];
  registeredAt: Date;
  assignedAt: Date;
  expiresAt?: Date;
  lastHeartbeat: Date;
  status: 'active' | 'expired' | 'conflict' | 'ghost' | 'permanent';
  metadata?: Record<string, any>;
}

export interface PortHubProtocolPacket {
  version: string;
  command: ProtocolCommand;
  clientId: string;
  requestedPort?: number;
  ttl?: string;
  metadata?: {
    name?: string;
    description?: string;
    tags?: string[];
    project?: string;
    workspace?: string;
    service?: string;
    autoRenew?: boolean;
    permanent?: boolean;
  };
  timestamp: Date;
}

export type ProtocolCommand = 
  | 'DISCOVER'
  | 'REQUEST' 
  | 'LEASE'
  | 'RENEW'
  | 'RELEASE'
  | 'REGISTER'
  | 'REJECT'
  | 'HEARTBEAT'
  | 'SCAN'
  | 'STATUS';

export interface ServiceInfo {
  pid: number;
  name: string;
  port: number;
  protocol: 'tcp' | 'udp';
  status: 'listening' | 'established' | 'time_wait';
  processPath?: string;
  commandLine?: string;
}

export interface WorkspaceConfig {
  name: string;
  description?: string;
  portRanges: {
    static: [number, number];
    dynamic: [number, number];
  };
  autoScan: boolean;
  notifications: boolean;
  theme: 'full-pimp' | 'casting-consultant' | 'voyeur';
}

export interface LeaseRequest {
  port: number;
  project?: string;
  service?: string;
  ttl?: string; // Human readable like "2h", "30m", "1d", or "permanent"
  description?: string;
  autoRenew?: boolean;
  permanent?: boolean; // For persistent services that never expire
}

export interface LeaseInfo {
  port: number;
  project: string;
  service: string;
  clientId: string;
  assignedAt: Date;
  expiresAt?: Date; // undefined for permanent leases
  ttl?: number; // undefined for permanent leases
  status: 'active' | 'expired' | 'conflict' | 'permanent';
  lastHeartbeat: Date;
  autoRenew: boolean;
  permanent: boolean;
}

export interface ScanResult {
  port: number;
  status: 'open' | 'closed' | 'filtered';
  service?: ServiceInfo;
  registered: boolean;
  assignment?: PortAssignment;
  recommendation: 'claim' | 'ignore' | 'block';
}

export interface CLICommand {
  name: string;
  description: string;
  usage: string;
  examples: string[];
  options: CLIOption[];
  action: (args: any, options: any) => Promise<void>;
}

export interface CLIOption {
  name: string;
  description: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'array';
  default?: any;
  alias?: string;
}

// PortHub Personality Types
export type PortCategory = 
  | 'nubiles'    // New ports < 1 week
  | 'milfs'      // Ports > 6 months  
  | 'gmilfs'     // Legacy services
  | 'trampstamps' // Appear/disappear unclaimed
  | 'bindstormers' // Cycle ports or multi-bind
  | 'fluffers';  // Helper daemons

export interface PortHubTheme {
  colors: {
    background: string;
    primary: string;
    accent: string;
    warning: string;
    error: string;
    success: string;
  };
  personality: 'snarky' | 'sleazy-tech' | 'self-aware' | 'deadpan-absurd';
}
