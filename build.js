/* eslint-env node */
const { execSync } = require('child_process');
const fs = require('fs');

try {
  const out = execSync('npm run build', { encoding: 'utf-8' });
  fs.writeFileSync('build-out.txt', "SUCCESS:\n" + out);
} catch (e) {
  fs.writeFileSync('build-out.txt', "ERROR:\n" + e.stdout + '\n' + e.stderr + '\n' + e.message);
}
