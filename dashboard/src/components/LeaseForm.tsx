import React, { useState } from 'react';

interface LeaseFormProps {
  onCreateLease: (port: number, project: string, service: string, ttl: string, permanent: boolean) => void;
}

export const LeaseForm: React.FC<LeaseFormProps> = ({ onCreateLease }) => {
  const [port, setPort] = useState<string>('');
  const [project, setProject] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [ttl, setTtl] = useState<string>('8h');
  const [permanent, setPermanent] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const portNum = parseInt(port);
    if (isNaN(portNum) || portNum < 1024 || portNum > 65535) {
      alert('Port must be between 1024 and 65535, you magnificent beast');
      return;
    }
    
    if (!project.trim() || !service.trim()) {
      alert('Project and service names are required, don\'t be lazy');
      return;
    }
    
    onCreateLease(portNum, project.trim(), service.trim(), permanent ? 'permanent' : ttl, permanent);
    
    // Reset form
    setPort('');
    setProject('');
    setService('');
    setTtl('8h');
    setPermanent(false);
    setIsExpanded(false);
  };

  const handlePortChange = (value: string) => {
    // Easter egg for port 69
    if (value === '69') {
      console.log('🎭 Nice choice, you cultured individual');
    }
    setPort(value);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <h3 style={styles.title}>
          {isExpanded ? '📝' : '➕'} Create New Lease
        </h3>
        <span style={styles.expandHint}>
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </span>
      </div>
      
      {isExpanded && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Port Number</label>
              <input
                type="number"
                value={port}
                onChange={(e) => handlePortChange(e.target.value)}
                placeholder="3000"
                min="1024"
                max="65535"
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Project Name</label>
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="MyReactApp"
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Service Name</label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="dev-server"
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={permanent}
                  onChange={(e) => setPermanent(e.target.checked)}
                  style={styles.checkbox}
                />
                Permanent Lease
              </label>
            </div>
          </div>
          
          {!permanent && (
            <div style={styles.ttlSection}>
              <label style={styles.label}>Lease Duration (TTL)</label>
              <div style={styles.ttlOptions}>
                {['1h', '2h', '4h', '8h', '24h'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    style={{
                      ...styles.ttlBtn,
                      backgroundColor: ttl === option ? '#FF9900' : 'transparent'
                    }}
                    onClick={() => setTtl(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
                placeholder="8h"
                style={styles.ttlInput}
              />
            </div>
          )}
          
          <div style={styles.formActions}>
            <button type="submit" style={styles.submitBtn}>
              🎯 Stake Your Claim
            </button>
            <button 
              type="button" 
              style={styles.cancelBtn}
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </button>
          </div>
          
          <div style={styles.snarkyHint}>
            "Book it. Bind it. Make it yours."
          </div>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    border: '1px solid #FF9900',
    borderRadius: '8px',
    margin: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(255, 153, 0, 0.2)',
  },
  header: {
    padding: '15px 20px',
    background: 'rgba(255, 153, 0, 0.1)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #FF9900',
  },
  title: {
    color: '#FF9900',
    fontSize: '16px',
    margin: 0,
    textShadow: '0 0 5px #FF9900',
  },
  expandHint: {
    color: '#888888',
    fontSize: '12px',
  },
  form: {
    padding: '20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    color: '#FFFFFF',
    fontSize: '14px',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  input: {
    background: '#333333',
    border: '1px solid #FF9900',
    borderRadius: '4px',
    padding: '8px 12px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'Courier New, monospace',
  },
  checkbox: {
    accentColor: '#FF9900',
  },
  ttlSection: {
    marginBottom: '20px',
  },
  ttlOptions: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
    flexWrap: 'wrap' as const,
  },
  ttlBtn: {
    background: 'transparent',
    border: '1px solid #FF9900',
    borderRadius: '4px',
    padding: '6px 12px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'background 0.2s ease',
  },
  ttlInput: {
    background: '#333333',
    border: '1px solid #FF9900',
    borderRadius: '4px',
    padding: '8px 12px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'Courier New, monospace',
    width: '100px',
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  submitBtn: {
    background: '#FF9900',
    color: '#000000',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  },
  cancelBtn: {
    background: 'transparent',
    color: '#FFFFFF',
    border: '1px solid #666666',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  snarkyHint: {
    color: '#FF9900',
    fontSize: '12px',
    fontStyle: 'italic',
    textAlign: 'center' as const,
  }
};
