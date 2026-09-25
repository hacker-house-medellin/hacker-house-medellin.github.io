import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync('src/pages/forms/intake.astro', 'utf8');

test('Medellin founder intake explains the four product questions', () => {
  assert.match(page, /Your entrepreneurship idea/);
  assert.match(page, /Your audience/);
  assert.match(page, /Your total market/);
  assert.match(page, /Your cross-pollination case/);
  assert.match(page, /who uses the product, and who pays/i);
});

test('Medellin remains an entry point to one canonical H\/HAUS form authority', () => {
  assert.match(page, /href="https:\/\/hhaus\.org\/forms\/intake\/"/);
  assert.match(page, /canonical H\/HAUS residency application/);
  assert.doesNotMatch(page, /<form[\s>]/i);
  assert.doesNotMatch(page, /name="date_of_birth"|name="photo_id"|name="resume"/);
});

test('existing members retain a distinct portal path', () => {
  assert.match(page, /https:\/\/user\.hacker-house-medellin\.github\.io\//);
});
