import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const page = readFileSync('src/pages/index.astro', 'utf8');
const fallback = readFileSync('index.html', 'utf8');

test('site uses a pinned Astro build with artifact verification', () => {
  assert.equal(pkg.dependencies.astro, '7.1.4');
  assert.equal(pkg.scripts.build, 'astro build && node scripts/verify-built-site.mjs');
});

test('site is not configured as Jekyll', () => {
  assert.equal(existsSync('_config.yml'), false);
  assert.equal(existsSync('_layouts'), false);
  assert.equal(existsSync('_includes'), false);
});

test('Astro bridge preserves head and body content', () => {
  assert.match(page, /<Fragment set:html=\{head\}\s*\/>/);
  assert.match(page, /<Fragment set:html=\{body\}\s*\/>/);
  assert.doesNotMatch(page, /<head\s+set:html=/);
  assert.doesNotMatch(page, /<body\s+set:html=/);
});

test('landing page contains the Hacker House Medellín operating story', () => {
  assert.match(fallback, /id="house"/);
  assert.match(fallback, /id="day"/);
  assert.match(fallback, /Hacker House/);
  assert.match(fallback, /Medellín/);
  assert.match(fallback, /<style>/);
});

test('Pages workflow installs without assuming a lockfile', () => {
  const pages = readFileSync('.github/workflows/pages.yml', 'utf8');
  assert.match(pages, /npm install --no-audit --no-fund/);
  assert.doesNotMatch(pages, /npm ci/);
});
