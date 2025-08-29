import React, { useState } from 'react';

interface ForeverEasterEggProps {
  children: React.ReactNode;
}

export const ForeverEasterEgg: React.FC<ForeverEasterEggProps> = ({ children }) => {
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);

  const handleClick = () => {
    if (!showFirstMessage) {
      setShowFirstMessage(true);
    }
  };

  const handleCloseFirstMessage = () => {
    setShowFirstMessage(false);
    setShowSecondMessage(true);
    
    // Auto-hide second message after 3 seconds
    setTimeout(() => {
      setShowSecondMessage(false);
    }, 3000);
  };

  return (
    <>
      <span 
        style={styles.foreverText}
        onClick={handleClick}
        title="🎭 Something special..."
      >
        {children}
      </span>
      
      {showFirstMessage && (
        <div style={styles.overlay}>
          <div style={styles.messageBox}>
            <div style={styles.messageHeader}>
              <span style={styles.icon}>🎭</span>
              <h3 style={styles.title}>PortHub Wisdom</h3>
            </div>
            <p style={styles.message}>
              <strong>Forever</strong> is a really, really, <strong>REALLY</strong> long time....!
            </p>
            <button 
              style={styles.closeBtn}
              onClick={handleCloseFirstMessage}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {showSecondMessage && (
        <div style={styles.overlay}>
          <div style={styles.messageBox}>
            <div style={styles.messageHeader}>
              <span style={styles.icon}>🎭</span>
              <h3 style={styles.title}>PortHub Wisdom</h3>
            </div>
            <p style={styles.message}>
              "especially when you get to the end...!"
            </p>
            <div style={styles.autoCloseNote}>
              <small style={styles.autoCloseText}>This message will close automatically...</small>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  foreverText: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      textShadow: '0 0 5px #FF9900',
      transform: 'scale(1.05)',
    }
  },
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
    zIndex: 2000,
    animation: 'fadeIn 0.3s ease',
  },
  messageBox: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    border: '2px solid #FF9900',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 8px 32px rgba(255, 153, 0, 0.5)',
    animation: 'slideIn 0.3s ease',
  },
  messageHeader: {
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
    color: '#FF9900',
    textShadow: '0 0 5px #FF9900',
  },
  message: {
    color: '#FFFFFF',
    fontSize: '16px',
    lineHeight: '1.5',
    margin: '0 0 20px 0',
    textAlign: 'center' as const,
  },
  closeBtn: {
    background: '#FF9900',
    color: '#000000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
  },
  autoCloseNote: {
    textAlign: 'center' as const,
    marginTop: '16px',
  },
  autoCloseText: {
    color: '#888888',
    fontSize: '12px',
    fontStyle: 'italic',
  }
};
