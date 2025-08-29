import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// PortHub Dashboard CSS
const globalStyles = `
  @keyframes glow {
    from { text-shadow: 0 0 5px #FF9900; }
    to { text-shadow: 0 0 20px #FF9900, 0 0 30px #FF9900; }
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  
  @keyframes slideDown {
    from { transform: translateY(-100%); }
    to { transform: translateY(0); }
  }
  
  @keyframes slideIn {
    from { 
      transform: scale(0.8) translateY(-20px);
      opacity: 0;
    }
    to { 
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Courier New', monospace;
    background: #000000;
    color: #ffffff;
    overflow-x: hidden;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #333333;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #FF9900;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #FFB84D;
  }
  
  /* Table hover effects */
  tr:hover {
    background: rgba(255, 153, 0, 0.1) !important;
  }
  
  /* Button hover effects */
  button:hover {
    opacity: 0.8;
  }
  
  /* Input focus effects */
  input:focus {
    outline: none;
    border-color: #FFB84D;
    box-shadow: 0 0 5px rgba(255, 153, 0, 0.5);
  }
`;

// Inject global styles
const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
