import { copyFileSync, mkdirSync } from 'node:fs';

for (const [source, destination] of [
  ['worker/index.js', 'dist/server/index.js'],
  ['.openai/hosting.json', 'dist/.openai/hosting.json'],
]) {
  mkdirSync(new URL('../' + destination.slice(0, destination.lastIndexOf('/')), import.meta.url), { recursive: true });
  copyFileSync(new URL('../' + source, import.meta.url), new URL('../' + destination, import.meta.url));
}
