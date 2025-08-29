import { useState } from 'react';
import { Header } from './components/Header';
import { StatsPanel } from './components/StatsPanel';
import { LeaseTable } from './components/LeaseTable';
import { LeaseForm } from './components/LeaseForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { EditLeaseModal } from './components/EditLeaseModal';
import { usePortHub } from './hooks/usePortHub';

function App() {
  const { connected, leases, stats, lastUpdate, error, reconnect } = usePortHub();
  const [notification, setNotification] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'warning' | 'danger' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    lease: any;
  }>({
    isOpen: false,
    lease: null
  });

  // Handle lease creation via CLI call
  const handleCreateLease = async (port: number, project: string, service: string, ttl: string, permanent: boolean) => {
    try {
      // Call PortHub CLI via fetch to daemon (future enhancement)
      // For now, show notification that this would call the CLI
      const command = permanent 
        ? `porthub lease ${port} --service "${service}" --project "${project}" --permanent`
        : `porthub lease ${port} --service "${service}" --project "${project}" --ttl ${ttl}`;
      
      setNotification(`Would execute: ${command}`);
      setTimeout(() => setNotification(null), 5000);
      
      console.log('🎯 Would execute CLI command:', command);
    } catch (err) {
      console.error('❌ Failed to create lease:', err);
      setNotification('Failed to create lease - check console');
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Handle lease release with confirmation
  const handleReleaseLease = async (port: number) => {
    const lease = leases.find(l => l.port === port);
    if (!lease) return;
    
    // Show confirmation dialog
    setConfirmDialog({
      isOpen: true,
      title: 'Release Port Lease',
      message: `Are you sure you want to release port ${port} (${lease.project}/${lease.service})?\n\nThis action cannot be undone.`,
      type: 'danger',
      onConfirm: () => executeReleaseLease(port)
    });
  };
  
  // Actually execute the release via REST API
  const executeReleaseLease = async (port: number) => {
    try {
      const response = await fetch(`http://localhost:8082/api/leases/${port}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setNotification(`✅ ${result.message}`);
        console.log('🗑️ Lease released successfully:', result);
      } else {
        const error = await response.json();
        setNotification(`❌ ${error.error || 'Failed to release lease'}`);
        console.error('❌ API error:', error);
      }
      
      // Close dialog
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('❌ Failed to release lease:', err);
      setNotification('❌ Network error - check if daemon is running');
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Handle heartbeat/renewal with confirmation
  const handleHeartbeat = async (port: number) => {
    const lease = leases.find(l => l.port === port);
    if (!lease) return;
    
    // Show confirmation dialog
    setConfirmDialog({
      isOpen: true,
      title: 'Extend Port Lease',
      message: `Extend the lease for port ${port} (${lease.project}/${lease.service})?\n\nThis will refresh the lease duration.`,
      type: 'info',
      onConfirm: () => executeHeartbeat(port)
    });
  };
  
  // Actually execute the heartbeat via REST API
  const executeHeartbeat = async (port: number) => {
    try {
      const response = await fetch(`http://localhost:8082/api/leases/${port}/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setNotification(`💓 ${result.message}`);
        console.log('💓 Lease extended successfully:', result);
      } else {
        const error = await response.json();
        setNotification(`❌ ${error.error || 'Failed to extend lease'}`);
        console.error('❌ API error:', error);
      }
      
      // Close dialog
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('❌ Failed to send heartbeat:', err);
      setNotification('❌ Network error - check if daemon is running');
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Handle edit lease
  const handleEditLease = (port: number) => {
    const lease = leases.find(l => l.port === port);
    if (lease) {
      setEditModal({
        isOpen: true,
        lease
      });
    }
  };

  // Handle save edited lease
  const handleSaveEditedLease = async (port: number, updates: { project: string; service: string; ttl: string }) => {
    try {
      // For now, show a notification that editing is not yet implemented
      setNotification(`✏️ Edit functionality coming soon! Would update port ${port} with ${updates.project}/${updates.service}`);
      console.log('🎨 Would edit lease:', { port, updates });
      
      // Close modal
      setEditModal({ isOpen: false, lease: null });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('❌ Failed to edit lease:', err);
      setNotification('❌ Failed to edit lease');
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div style={styles.app}>
      <Header 
        connected={connected}
        lastUpdate={lastUpdate}
        onReconnect={reconnect}
      />
      
      {error && (
        <div style={styles.errorBanner}>
          ❌ {error}
        </div>
      )}
      
      {notification && (
        <div style={styles.notification}>
          💡 {notification}
        </div>
      )}
      
      <main style={styles.main}>
        <StatsPanel stats={stats} />
        
        <LeaseForm onCreateLease={handleCreateLease} />
        
        <LeaseTable 
          leases={leases}
          onRelease={handleReleaseLease}
          onHeartbeat={handleHeartbeat}
          onEdit={handleEditLease}
        />
      </main>
      
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <span>"No Conflicts. Just Connections."</span>
          <span style={styles.version}>PortHub Dashboard v1.0.0</span>
        </div>
      </footer>
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText={confirmDialog.type === 'danger' ? 'Release' : confirmDialog.type === 'info' ? 'Extend' : 'Confirm'}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
      
      <EditLeaseModal
        isOpen={editModal.isOpen}
        lease={editModal.lease}
        onSave={handleSaveEditedLease}
        onCancel={() => setEditModal({ isOpen: false, lease: null })}
      />
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    color: '#FFFFFF',
    fontFamily: 'Courier New, monospace',
  },
  main: {
    minHeight: 'calc(100vh - 200px)',
    paddingBottom: '60px',
  },
  errorBanner: {
    background: '#F44336',
    color: '#FFFFFF',
    padding: '10px 20px',
    textAlign: 'center' as const,
    fontSize: '14px',
    fontWeight: 'bold',
  },
  notification: {
    background: '#FF9900',
    color: '#000000',
    padding: '10px 20px',
    textAlign: 'center' as const,
    fontSize: '14px',
    fontWeight: 'bold',
    animation: 'slideDown 0.3s ease',
  },
  footer: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    borderTop: '1px solid #FF9900',
    padding: '15px',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    fontSize: '12px',
    color: '#888888',
  },
  version: {
    color: '#FF9900',
  }
};

export default App;
