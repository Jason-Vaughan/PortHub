import React, { useState, useEffect } from 'react';
import { getRandomTagline } from '../utils/taglines';

interface HeaderProps {
  connected: boolean;
  lastUpdate: Date;
  onReconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ connected, lastUpdate, onReconnect }) => {
  const [tagline, setTagline] = useState(getRandomTagline());
  
  // Rotate taglines every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTagline(getRandomTagline());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.banner}>
        <img 
          src="/porthub-logo.png" 
          alt="PortHub - The Protocol Registry That Parties Responsibly"
          style={styles.logo}
        />
      </div>
      
      <div style={styles.subtitle}>
        <h2 style={styles.tagline}>"{tagline.text}"</h2>
      </div>
      
      <div style={styles.statusBar}>
        <div style={styles.connectionStatus}>
          <span style={{
            ...styles.statusDot,
            backgroundColor: connected ? '#4CAF50' : '#F44336'
          }} />
          <span style={styles.statusText}>
            {connected ? 'Connected to PortHub Daemon' : 'Disconnected'}
          </span>
          {!connected && (
            <button style={styles.reconnectBtn} onClick={onReconnect}>
              Reconnect
            </button>
          )}
        </div>
        
        <div style={styles.lastUpdate}>
          Last Update: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    borderBottom: '2px solid #FF9900',
    padding: '20px',
    textAlign: 'center' as const,
  },
  banner: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    maxHeight: '120px',
    height: 'auto',
    width: 'auto',
    maxWidth: '400px',
    filter: 'drop-shadow(0 0 10px rgba(255, 153, 0, 0.3))',
    transition: 'filter 0.3s ease',
  },
  subtitle: {
    marginBottom: '15px',
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontStyle: 'italic',
    margin: 0,
    textShadow: '0 0 5px #FF9900',
    animation: 'glow 2s ease-in-out infinite alternate',
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
    padding: '10px 0',
    borderTop: '1px solid #333',
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  statusDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: '14px',
  },
  reconnectBtn: {
    background: '#FF9900',
    color: '#000000',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  lastUpdate: {
    color: '#888888',
    fontSize: '12px',
  }
};
