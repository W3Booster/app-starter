#!/usr/bin/env node
import { cp, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
if (args.includes('--help') || !args.length) {
  console.log('Usage: w3booster-create <new-directory>\nCreates one TypeScript app with offline demo data.');
  process.exit(args.length ? 0 : 1);
}
if (args.length !== 1 || args[0].startsWith('-')) throw new Error('Provide exactly one new project directory.');
const target = resolve(args[0]);
try { await access(target); throw new Error('Directory already exists. Choose a new directory; existing files are never overwritten.'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const source = resolve(dirname(fileURLToPath(import.meta.url)), '..');
await mkdir(target, { recursive: true });
for (const file of ['src', 'scripts', 'index.html', 'tsconfig.json', 'vite.config.ts', 'app-definition.json', 'example.json', 'LICENSE', '.nvmrc']) {
  await cp(resolve(source, file), resolve(target, file), { recursive: true, filter: path => path !== resolve(source, 'scripts/create.test.mjs') });
}
const manifest = JSON.parse(await readFile(resolve(source, 'package.json'), 'utf8'));
manifest.name = basename(target).toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'my-w3booster-app';
delete manifest.bin; delete manifest.files; delete manifest.repository;
manifest.scripts.check = 'tsc --noEmit';
const lock = JSON.parse(await readFile(resolve(source, 'bin/template-lock.json'), 'utf8'));
lock.name = manifest.name; lock.packages[''].name = manifest.name; delete lock.packages[''].bin;
await writeFile(resolve(target, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
await writeFile(resolve(target, 'package-lock.json'), JSON.stringify(lock, null, 2) + '\n');
await cp(resolve(source, 'bin/PROJECT_README.md'), resolve(target, 'README.md'));
await writeFile(resolve(target, '.gitignore'), 'node_modules/\ndist/\n.env*\n');
console.log(`Created ${target}\n\nNext:\n  cd ${JSON.stringify(args[0])}\n  npm ci\n  npm run dev\n\nOpen http://localhost:5173/\nGuide: https://w3booster.com/developer/first-app/`);
