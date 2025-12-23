const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const distMain = path.join(__dirname, '..', 'dist', 'main.js');

function run(cmd, args) {
  const p = spawn(cmd, args, { stdio: 'inherit', shell: true });
  p.on('exit', (code) => process.exit(code));
}

if (fs.existsSync(distMain)) {
  console.log('Starting built app: node dist/main.js');
  run('node', ['dist/main.js']);
} else {
  console.log('dist/main.js not found — falling back to `nest start`');
  // Prefer locally installed nest binary
  const npmBin = path.join(__dirname, '..', 'node_modules', '.bin', 'nest');
  if (fs.existsSync(npmBin)) {
    run(npmBin, ['start']);
  } else {
    // fallback to global `nest`
    run('nest', ['start']);
  }
}
