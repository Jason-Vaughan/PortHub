import { useState, useEffect, useCallback, useRef } from 'react';
import { WebSocketMessage, LeaseInfo, DashboardStats } from '../types';

export const usePortHub = (wsUrl: string = 'ws://localhost:8080') => {
  const [connected, setConnected] = useState(false);
  const [leases, setLeases] = useState<LeaseInfo[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeases: 0,
    activeLeases: 0,
    expiredLeases: 0,
    permanentLeases: 0,
    portRangeUsage: { used: 0, total: 65535 - 1024, percentage: 0 }
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate stats from leases
  const calculateStats = useCallback((leaseList: LeaseInfo[]): DashboardStats => {
    const totalLeases = leaseList.length;
    const activeLeases = leaseList.filter(l => l.status === 'active').length;
    const expiredLeases = leaseList.filter(l => l.status === 'expired').length;
    const permanentLeases = leaseList.filter(l => l.status === 'permanent').length;
    
    return {
      totalLeases,
      activeLeases,
      expiredLeases,
      permanentLeases,
      portRangeUsage: {
        used: totalLeases,
        total: 65535 - 1024,
        percentage: Math.round((totalLeases / (65535 - 1024)) * 100)
      }
    };
  }, []);

  // Parse registry data from WebSocket
  const parseRegistryData = useCallback((data: any): LeaseInfo[] => {
    // Handle both "assignments" and "ports" (newer format)
    const assignments = data.assignments || data.ports || data;
    if (!assignments) return [];
    
    const leaseList: LeaseInfo[] = [];
    
    // Handle Map-like object from daemon
    Object.entries(assignments).forEach(([port, assignment]: [string, any]) => {
      const lease: LeaseInfo = {
        port: parseInt(port),
        project: assignment.project || 'unknown',
        service: assignment.service || assignment.name || 'unknown',
        ttl: assignment.metadata?.permanent ? 'permanent' : `${Math.round((assignment.metadata?.ttl || 7200000) / 1000)}s`,
        status: assignment.status || (assignment.metadata?.permanent ? 'permanent' : 'active'),
        // Parse expiresAt from string if present, otherwise undefined for permanent leases
        expiresAt: assignment.expiresAt ? new Date(assignment.expiresAt) : undefined
      };
      leaseList.push(lease);
    });
    
    return leaseList.sort((a, b) => a.port - b.port);
  }, []);

  // Note: Time formatting is now handled in LeaseTable component for live updates

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      setError(null);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('🎭 Connected to PortHub WebSocket');
        setConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 PortHub message:', message);
          
          switch (message.type) {
            case 'welcome':
              console.log('🎉 PortHub welcome:', message.message);
              break;
              
            case 'registry_update':
              if (message.data) {
                const newLeases = parseRegistryData(message.data);
                setLeases(newLeases);
                setStats(calculateStats(newLeases));
                setLastUpdate(new Date());
              }
              break;
              
            case 'error':
              console.error('❌ PortHub error:', message.message);
              setError(message.message || 'Unknown error');
              break;
              
            default:
              console.log('📦 Other message:', message.type);
          }
        } catch (err) {
          console.error('❌ Failed to parse WebSocket message:', err);
          setError('Failed to parse server message');
        }
      };

      ws.onclose = () => {
        console.log('🔗 PortHub WebSocket closed');
        setConnected(false);
        
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('❌ PortHub WebSocket error:', error);
        setError('WebSocket connection failed');
        setConnected(false);
      };

    } catch (err) {
      console.error('❌ Failed to create WebSocket connection:', err);
      setError('Failed to connect to PortHub daemon');
    }
  }, [wsUrl, parseRegistryData, calculateStats]);

  // Send ping to keep connection alive
  const sendPing = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'ping' }));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
  }, [connect]);

  // Send ping every 30 seconds
  useEffect(() => {
    const pingInterval = setInterval(sendPing, 30000);
    return () => clearInterval(pingInterval);
  }, [sendPing]);

  return {
    connected,
    leases,
    stats,
    lastUpdate,
    error,
    reconnect: connect
  };
};
