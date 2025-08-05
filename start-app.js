const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting 50cube Application...\n');

// Start server
console.log('📡 Starting server on port 5000...');
const server = spawn('node', ['server/server.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

// Wait a moment for server to start
setTimeout(() => {
  console.log('\n🌐 Starting client on port 3001...');
  const client = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    env: { ...process.env, PORT: '3001' }
  });
}, 2000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  server.kill();
  process.exit(0);
});

console.log('\n✅ Application starting...');
console.log('📱 Client will be available at: http://localhost:3001');
console.log('🔧 Server will be available at: http://localhost:5000');
console.log('\n💡 Press Ctrl+C to stop the application'); 