// PortHub WebSocket Test Client
// "Testing Real-Time Port Updates"

const WebSocket = require('ws');

console.log('🔌 Connecting to PortHub WebSocket server...');
console.log('🎯 Target: ws://localhost:8080');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  console.log('✅ Connected to PortHub WebSocket server!');
  console.log('📡 Subscribing to registry updates...');
  
  // Subscribe to registry updates
  ws.send(JSON.stringify({
    action: 'subscribe_registry',
    clientId: 'websocket-test-client'
  }));
  
  // Send a ping to test bidirectional communication
  setTimeout(() => {
    console.log('💓 Sending ping...');
    ws.send(JSON.stringify({
      action: 'ping',
      timestamp: new Date().toISOString()
    }));
  }, 1000);
});

ws.on('message', function message(data) {
  try {
    const message = JSON.parse(data.toString());
    console.log('📨 Received message:', message);
    
    if (message.type === 'registry_update') {
      console.log('🔄 Registry Update:');
      console.log(`   Event: ${message.event}`);
      console.log(`   Port: ${message.port}`);
      console.log(`   Service: ${message.service || 'unknown'}`);
      console.log(`   Project: ${message.project || 'unknown'}`);
    } else if (message.type === 'pong') {
      console.log('🏓 Pong received! WebSocket is working bidirectionally');
    } else {
      console.log('📦 Other message type:', message.type);
    }
  } catch (error) {
    console.log('📄 Raw message:', data.toString());
  }
});

ws.on('error', function error(err) {
  console.error('💥 WebSocket error:', err.message);
});

ws.on('close', function close() {
  console.log('🔗 WebSocket connection closed');
});

// Keep the process alive and provide instructions
console.log('\n🎭 WebSocket Test Client Ready!');
console.log('💡 Instructions:');
console.log('   1. Keep this running');
console.log('   2. In another terminal, run PortHub commands:');
console.log('      porthub lease 9999 --service "websocket-test" --ttl 5m');
console.log('      porthub status');
console.log('      porthub release 9999');
console.log('   3. Watch for real-time updates here!');
console.log('\n⏹️  Press Ctrl+C to stop');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down WebSocket test client...');
  ws.close();
  process.exit(0);
});
