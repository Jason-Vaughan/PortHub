import React from 'react';
import { DashboardStats } from '../types';

interface StatsPanelProps {
  stats: DashboardStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>📊 Port Registry Statistics</h3>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalLeases}</div>
          <div style={styles.statLabel}>Total Leases</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: '#4CAF50'}}>{stats.activeLeases}</div>
          <div style={styles.statLabel}>Active</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: '#FF9900'}}>{stats.permanentLeases}</div>
          <div style={styles.statLabel}>Permanent</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: '#F44336'}}>{stats.expiredLeases}</div>
          <div style={styles.statLabel}>Expired</div>
        </div>
      </div>
      
      <div style={styles.portUsage}>
        <div style={styles.usageLabel}>
          Port Range Usage: {stats.portRangeUsage.used} / {stats.portRangeUsage.total} 
          ({stats.portRangeUsage.percentage}%)
        </div>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${Math.min(stats.portRangeUsage.percentage, 100)}%`
            }}
          />
        </div>
      </div>
      
      <div style={styles.snarkyComment}>
        {getSnarkyComment(stats)}
      </div>
    </div>
  );
};

const getSnarkyComment = (stats: DashboardStats): string => {
  if (stats.totalLeases === 0) return '"Looks like a quiet neighborhood"';
  if (stats.expiredLeases > stats.activeLeases) return '"Time to clean house, you hoarder"';
  if (stats.permanentLeases > 5) return '"Someone likes commitment"';
  if (stats.portRangeUsage.percentage > 50) return '"Getting a little crowded in here"';
  if (stats.activeLeases === 1) return '"Flying solo tonight"';
  return '"Your ports are under professional management"';
};

const styles = {
  panel: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    border: '1px solid #FF9900',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px',
    boxShadow: '0 4px 8px rgba(255, 153, 0, 0.2)',
  },
  title: {
    color: '#FF9900',
    fontSize: '18px',
    margin: '0 0 20px 0',
    textAlign: 'center' as const,
    textShadow: '0 0 5px #FF9900',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px',
    marginBottom: '20px',
  },
  statCard: {
    background: 'rgba(255, 153, 0, 0.1)',
    border: '1px solid #FF9900',
    borderRadius: '6px',
    padding: '15px',
    textAlign: 'center' as const,
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#CCCCCC',
    textTransform: 'uppercase' as const,
  },
  portUsage: {
    marginBottom: '15px',
  },
  usageLabel: {
    color: '#FFFFFF',
    fontSize: '14px',
    marginBottom: '8px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#333333',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4CAF50 0%, #FF9900 50%, #F44336 100%)',
    transition: 'width 0.3s ease',
  },
  snarkyComment: {
    color: '#FF9900',
    fontSize: '14px',
    fontStyle: 'italic',
    textAlign: 'center' as const,
    marginTop: '10px',
  }
};
