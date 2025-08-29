import React, { useState, useEffect } from 'react';
import { LeaseInfo } from '../types';

interface EditLeaseModalProps {
  isOpen: boolean;
  lease: LeaseInfo | null;
  onSave: (port: number, updates: { project: string; service: string; ttl: string }) => void;
  onCancel: () => void;
}

export const EditLeaseModal: React.FC<EditLeaseModalProps> = ({
  isOpen,
  lease,
  onSave,
  onCancel
}) => {
  const [project, setProject] = useState('');
  const [service, setService] = useState('');
  const [ttl, setTtl] = useState('');

  useEffect(() => {
    if (lease) {
      setProject(lease.project || '');
      setService(lease.service || '');
      setTtl(lease.ttl === 'permanent' ? 'permanent' : lease.ttl || '2h');
    }
  }, [lease]);

  if (!isOpen || !lease) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (project.trim() && service.trim() && ttl.trim()) {
      onSave(lease.port, { project: project.trim(), service: service.trim(), ttl: ttl.trim() });
    }
  };

  const getTtlOptions = () => [
    { value: '1h', label: '1 hour' },
    { value: '2h', label: '2 hours' },
    { value: '4h', label: '4 hours' },
    { value: '8h', label: '8 hours' },
    { value: '1d', label: '1 day' },
    { value: 'permanent', label: 'Permanent' }
  ];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>⚙️ Edit Port Lease</h3>
          <p style={styles.subtitle}>Port {lease.port}</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Project Name:</label>
            <input
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              style={styles.input}
              placeholder="e.g., MyApp"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Service Name:</label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              style={styles.input}
              placeholder="e.g., react-dev"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Lease Duration:</label>
            <select
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
              style={styles.select}
              required
            >
              {getTtlOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div style={styles.actions}>
            <button 
              type="button"
              onClick={onCancel}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={styles.saveBtn}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    border: '2px solid #FF9900',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 8px 32px rgba(255, 153, 0, 0.3)',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    margin: '0 0 8px 0',
    fontWeight: 'bold',
    color: '#FF9900',
    textShadow: '0 0 5px #FF9900',
  },
  subtitle: {
    fontSize: '14px',
    margin: 0,
    color: '#CCCCCC',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  label: {
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  input: {
    background: '#333333',
    color: '#FFFFFF',
    border: '1px solid #666666',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  select: {
    background: '#333333',
    color: '#FFFFFF',
    border: '1px solid #666666',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  cancelBtn: {
    background: 'transparent',
    color: '#FFFFFF',
    border: '1px solid #666666',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  saveBtn: {
    background: '#FF9900',
    color: '#000000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }
};
