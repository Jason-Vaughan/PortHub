// PortHub Dashboard Types - Mirror core types for frontend
export interface PortAssignment {
  port: number;
  name: string;
  description: string;
  assignedAt: Date;
  lastHeartbeat: Date;
  ttl: number;
  autoRenew: boolean;
  status: 'active' | 'expired' | 'permanent';
  project: string;
  service: string;
  clientId: string;
}

export interface PortRegistry {
  version: number;
  assignments: Map<number, PortAssignment>;
  lastUpdated: Date;
}

export interface WebSocketMessage {
  type: 'welcome' | 'registry_update' | 'lease_update' | 'error' | 'pong';
  message?: string;
  timestamp: string;
  registryVersion?: number;
  data?: any;
}

export interface LeaseInfo {
  port: number;
  project: string;
  service: string;
  ttl: string;
  status: 'active' | 'expired' | 'permanent';
  expiresAt?: Date;
  timeRemaining?: string;
}

export interface DashboardStats {
  totalLeases: number;
  activeLeases: number;
  expiredLeases: number;
  permanentLeases: number;
  portRangeUsage: {
    used: number;
    total: number;
    percentage: number;
  };
}

export interface PortHubTagline {
  text: string;
  category: 'snarky' | 'professional' | 'sleazy' | 'motivational';
}

export interface DashboardTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  personality: 'casting-consultant' | 'full-pimp' | 'voyeur';
}
