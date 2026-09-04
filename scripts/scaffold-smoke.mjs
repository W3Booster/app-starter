import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

// Exercise the actual distributable, not just a generator beside its source tree.
const temp = await mkdtemp(join(tmpdir(), 'w3booster-packed-starter-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
try {
  const packed = JSON.parse(execFileSync(npm, ['pack', '--json', '--pack-destination', temp], { encoding: 'utf8' }));
  const project = join(temp, 'my-app');
  execFileSync(npx, ['--yes', '--package=' + join(temp, packed[0].filename), 'w3booster-create', project], { stdio: 'inherit', timeout: 60000 });
  for (const args of [['ci'], ['run', 'build'], ['run', 'test:browser']]) execFileSync(npm, args, { cwd: project, stdio: 'inherit', timeout: 60000 });
  console.log('Packed starter creates, installs, builds, and passes browser checks.');
} finally { await rm(temp, { recursive: true, force: true }); }
