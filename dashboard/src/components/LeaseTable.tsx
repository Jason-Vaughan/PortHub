import React, { useState, useEffect } from 'react';
import { LeaseInfo } from '../types';
import { ForeverEasterEgg } from './ForeverEasterEgg';
// import { formatTimeRemaining } from '../utils/taglines'; // Using inline calculation

interface LeaseTableProps {
  leases: LeaseInfo[];
  onRelease: (port: number) => void;
  onHeartbeat: (port: number) => void;
  onEdit: (port: number) => void;
}

export const LeaseTable: React.FC<LeaseTableProps> = ({ leases, onRelease, onHeartbeat, onEdit }) => {
  const [sortField, setSortField] = useState<keyof LeaseInfo>('port');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  // Update component every second for live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update time displays
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Keep currentTime for forcing re-renders
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleSort = (field: keyof LeaseInfo) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedLeases = [...leases].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];
    
    // Handle undefined values
    if (aVal === undefined) aVal = '';
    if (bVal === undefined) bVal = '';
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🔌';
      case 'permanent': return '♾️';
      case 'expired': return '💀';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'permanent': return '#FF9900';
      case 'expired': return '#F44336';
      default: return '#888888';
    }
  };

  const getLiveTimeRemaining = (lease: LeaseInfo): string => {
    if (lease.status === 'permanent') return 'Forever';
    if (!lease.expiresAt) return 'Unknown';
    
    // Force re-calculation using current time
    const now = currentTime.getTime();
    const diff = lease.expiresAt.getTime() - now;
    
    if (diff <= 0) return 'Expired';
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const isPortHubInfrastructure = (lease: LeaseInfo): boolean => {
    return lease.project === 'porthub-system' || 
           lease.service?.includes('porthub') ||
           [8080, 8081, 8082, 8888].includes(lease.port);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🎭 Active Port Leases</h3>
        {leases.length === 0 && (
          <p style={styles.emptyState}>"Looks like a quiet neighborhood"</p>
        )}
      </div>
      
      {leases.length > 0 && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th} onClick={() => handleSort('port')}>
                  Port {sortField === 'port' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th style={styles.th} onClick={() => handleSort('project')}>
                  Project {sortField === 'project' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th style={styles.th} onClick={() => handleSort('service')}>
                  Service {sortField === 'service' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th style={styles.th} onClick={() => handleSort('status')}>
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th style={styles.th}>Time Remaining</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeases.map((lease) => (
                <tr key={lease.port} style={styles.row}>
                  <td style={styles.td}>
                    <strong style={styles.portNumber}>{lease.port}</strong>
                  </td>
                  <td style={styles.td}>{lease.project}</td>
                  <td style={styles.td}>{lease.service}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(lease.status)
                    }}>
                      {getStatusIcon(lease.status)} {lease.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      color: lease.status === 'expired' ? '#F44336' : '#FFFFFF'
                    }}>
                      {getLiveTimeRemaining(lease) === 'Forever' ? (
                        <ForeverEasterEgg>Forever</ForeverEasterEgg>
                      ) : (
                        getLiveTimeRemaining(lease)
                      )}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      {!isPortHubInfrastructure(lease) && (
                        <>
                          {lease.status === 'active' && (
                            <button 
                              style={styles.actionBtn}
                              onClick={() => onHeartbeat(lease.port)}
                              title="Extend lease"
                            >
                              💓
                            </button>
                          )}
                          {lease.status !== 'permanent' && (
                            <button 
                              style={{...styles.actionBtn, backgroundColor: '#FF9900'}}
                              onClick={() => onEdit(lease.port)}
                              title="Edit lease"
                            >
                              ⚙️
                            </button>
                          )}
                          {lease.status !== 'permanent' && (
                            <button 
                              style={{...styles.actionBtn, backgroundColor: '#F44336'}}
                              onClick={() => onRelease(lease.port)}
                              title="Release lease"
                            >
                              🗑️
                            </button>
                          )}
                        </>
                      )}
                      {isPortHubInfrastructure(lease) && (
                        <span style={styles.protectedLabel}>
                          🔒 Protected
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    margin: '20px',
  },
  header: {
    marginBottom: '15px',
  },
  title: {
    color: '#FF9900',
    fontSize: '18px',
    margin: '0 0 10px 0',
    textShadow: '0 0 5px #FF9900',
  },
  emptyState: {
    color: '#888888',
    fontSize: '16px',
    fontStyle: 'italic',
    textAlign: 'center' as const,
    margin: '40px 0',
  },
  tableContainer: {
    background: 'rgba(255, 153, 0, 0.05)',
    border: '1px solid #FF9900',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  headerRow: {
    background: 'rgba(255, 153, 0, 0.2)',
  },
  th: {
    padding: '12px 15px',
    textAlign: 'left' as const,
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderBottom: '2px solid #FF9900',
    userSelect: 'none' as const,
  },
  row: {
    borderBottom: '1px solid #333333',
    transition: 'background 0.2s ease',
  },
  td: {
    padding: '12px 15px',
    color: '#FFFFFF',
    fontSize: '14px',
    verticalAlign: 'middle' as const,
  },
  portNumber: {
    color: '#FF9900',
    fontSize: '16px',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#000000',
    display: 'inline-block',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    background: '#FF9900',
    color: '#000000',
    border: 'none',
    padding: '6px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'opacity 0.2s ease',
  },
  protectedLabel: {
    color: '#888888',
    fontSize: '12px',
    fontStyle: 'italic',
    padding: '6px 8px',
  }
};
