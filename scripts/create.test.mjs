import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, access, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('new projects are independent, locked, unregistered, and never overwrite existing files', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'w3booster-starter-test-'));
  const target = join(temp, 'my-app');
  const create = () => spawnSync(process.execPath, ['bin/create.mjs', target], { encoding: 'utf8' });
  try {
    assert.equal(create().status, 0);
    const pkg = JSON.parse(await readFile(join(target, 'package.json'), 'utf8'));
    assert.equal(pkg.name, 'my-app'); assert.equal(pkg.w3booster, undefined);
    assert.equal(pkg.bin, undefined);
    assert.match(await readFile(join(target, 'src/w3booster.generated.ts'), 'utf8'), /unregistered_demo/);
    const main = await readFile(join(target, 'src/main.ts'), 'utf8');
    assert.doesNotMatch(main, /getApplication|src\/registered|app_[a-f0-9]{24}/);
    assert.equal(JSON.parse(await readFile(join(target, 'package-lock.json'), 'utf8')).name, 'my-app');
    await access(join(target, 'example.json'));
    assert.notEqual(create().status, 0);
    assert.equal(JSON.parse(await readFile(join(target, 'package.json'), 'utf8')).name, 'my-app');
  } finally { await rm(temp, { recursive: true, force: true }); }
});
