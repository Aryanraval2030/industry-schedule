import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('[Runner] Starting E-Commerce backend server...');

const server = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true,
});

server.on('exit', (code) => {
  process.exit(code || 0);
});

server.on('error', (err) => {
  console.error('[Runner Error] Failed to launch backend:', err);
});
