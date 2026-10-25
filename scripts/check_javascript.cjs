// Parse every shipped inline and external script without executing application code.
const { readdirSync, readFileSync } = require('node:fs');
const { join, relative, resolve } = require('node:path');
const vm = require('node:vm');
const root = resolve(__dirname, '..');
const skip = new Set(['.git', 'node_modules', 'playwright-report', 'test-results']);
let checked = 0;
function visit(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (entry.name.endsWith('.html')) {
      const text = readFileSync(path, 'utf8');
      for (const match of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
        if (/\bsrc\s*=|\btype\s*=\s*["'](?:application\/ld\+json|application\/json)["']/i.test(match[1])) continue;
        new vm.Script(match[2], { filename: relative(root, path) }); checked++;
      }
    } else if (entry.name.endsWith('.js')) {
      new vm.Script(readFileSync(path, 'utf8'), { filename: relative(root, path) }); checked++;
    }
  }
}
visit(root);
console.log(`Parsed ${checked} shipped JavaScript scripts successfully.`);
