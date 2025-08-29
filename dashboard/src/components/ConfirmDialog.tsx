import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'warning' | 'danger' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getTypeColor = () => {
    switch (type) {
      case 'danger': return '#F44336';
      case 'warning': return '#FF9900';
      case 'info': return '#2196F3';
      default: return '#FF9900';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'danger': return '🗑️';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '❓';
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <div style={styles.header}>
          <span style={styles.icon}>{getTypeIcon()}</span>
          <h3 style={{...styles.title, color: getTypeColor()}}>{title}</h3>
        </div>
        
        <div style={styles.content}>
          <p style={styles.message}>{message}</p>
        </div>
        
        <div style={styles.actions}>
          <button 
            style={styles.cancelBtn}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            style={{
              ...styles.confirmBtn,
              backgroundColor: getTypeColor()
            }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
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
  dialog: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    border: '2px solid #FF9900',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 8px 32px rgba(255, 153, 0, 0.3)',
    animation: 'slideIn 0.3s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  icon: {
    fontSize: '24px',
  },
  title: {
    fontSize: '18px',
    margin: 0,
    fontWeight: 'bold',
    textShadow: '0 0 5px currentColor',
  },
  content: {
    marginBottom: '24px',
  },
  message: {
    color: '#FFFFFF',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
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
  confirmBtn: {
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
