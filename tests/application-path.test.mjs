import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync('src/pages/index.astro', 'utf8');

test('Medellín routes every applicant into the canonical H/HAUS intake flow', () => {
  assert.match(page, /id="apply"/);
  assert.match(page, />Find your city\.<\/h2>/);
  assert.match(
    page,
    /Start with a short Medellín pre-interest form, submit the full residency application when ready, or continue through the member portal if you already have an H\/HAUS session\./,
  );
  assert.match(page, /href="https:\/\/hhaus\.org\/submit-pre-interest\/"/);
  assert.match(page, /href="https:\/\/hhaus\.org\/submit-application\/"/);
  assert.match(page, /href="https:\/\/user\.hacker-house-medellin\.github\.io\/"/);
  assert.match(page, />Pre-register<\/strong>/);
  assert.match(page, />Full application<\/strong>/);
  assert.match(page, />Member portal<\/strong>/);
});

test('the marketing site links to one intake authority instead of cloning sensitive forms', () => {
  assert.doesNotMatch(page, /name="date_of_birth"/);
  assert.doesNotMatch(page, /name="photo_id"/);
  assert.doesNotMatch(page, /name="resume"/);
  assert.doesNotMatch(page, /<form[\s>]/i);
  assert.match(page, /one canonical H\/HAUS intake contract/);
  assert.match(page, /Rust API confirms both database copies/);
});

test('application entry points are reachable from desktop, mobile, and hero navigation', () => {
  assert.equal((page.match(/href="#apply"/g) ?? []).length, 3);
  assert.match(page, /<nav class="fleet-desktop-nav"[^>]*>[\s\S]*?<a href="#apply">Apply<\/a>/);
  assert.match(page, /<nav aria-label="Mobile navigation">[\s\S]*?<a href="#apply">Apply<\/a>/);
  assert.match(page, /<div class="actions"><a href="#apply">Find your city<\/a>/);
});
