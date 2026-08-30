import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';

const preInterest = readFileSync('src/components/PreInterestForm.astro', 'utf8');
const application = readFileSync('src/components/ApplicationForm.astro', 'utf8');
const layout = readFileSync('src/layouts/IntakeLayout.astro', 'utf8');
const client = readFileSync('public/intake.js', 'utf8');
const preRegister = readFileSync('src/pages/pre-register.astro', 'utf8');

test('requested public intake routes and pre-register alias exist', () => {
  for (const path of [
    'src/pages/pre-register.astro',
    'src/pages/submit-pre-interest.astro',
    'src/pages/submit-application.astro',
  ]) {
    assert.equal(existsSync(path), true, `missing ${path}`);
  }
  assert.match(preRegister, /authenticatedPath="\/submit-pre-interest"/);
});

test('pre-interest captures the public contract and signed-in handoff', () => {
  for (const name of [
    'email',
    'linkedin_url',
    'entrepreneurship_idea',
    'stay_preference',
    'privacy_accepted',
    'submission_nonce',
  ]) {
    assert.match(preInterest, new RegExp(`name="${name}"`));
  }
  assert.match(layout, /https:\/\/user\.hhaus\.org/);
  assert.match(layout, /Use the prefilled signed-in form/);
});

test('application captures private documents, age consent, and contract fields', () => {
  for (const name of [
    'email',
    'linkedin_url',
    'legal_name',
    'date_of_birth',
    'entrepreneurship_idea',
    'project_stage',
    'stay_preference',
    'preferred_start_month',
    'community_contribution',
    'resume',
    'photo_id',
    'age_and_identity_attestation',
    'privacy_accepted',
  ]) {
    assert.match(application, new RegExp(`name="${name}"`));
  }
  assert.match(application, /Used only for age and identity verification/);
});

test('public client uses fresh Turnstile proofs and exact private upload verification', () => {
  assert.match(layout, /api\.js\?render=explicit/);
  assert.match(client, /execution: 'execute'/);
  assert.match(client, /appearance: 'interaction-only'/);
  assert.match(client, /turnstile\.reset\(widgetId\)/);
  assert.match(client, /turnstile\.execute\(widgetId\)/);
  assert.match(client, /\/v1\/intake\/uploads/);
  assert.match(client, /contentType: file\.type/);
  assert.match(client, /sha256/);
  assert.match(client, /completed\.status !== 'verified'/);
  assert.match(client, /credentials: 'omit'/);
});

test('browser artifact contains no server credential or test Turnstile fallback', () => {
  const privateKeyMarker = ['BEGIN', 'PRIVATE', 'KEY'].join(' ');
  for (const source of [layout, client, preInterest, application]) {
    for (const marker of ['SERVICE_ROLE', 'SECRET_KEY', 'AUTH_SERVICE_CREDENTIAL', privateKeyMarker]) {
      assert.equal(source.includes(marker), false, `browser artifact contains forbidden marker ${marker}`);
    }
    assert.doesNotMatch(source, /1x00000000000000000000AA|1x0000000000000000000000000000000AA/);
  }
  assert.doesNotMatch(client, /localStorage|sessionStorage|document\.cookie/);
});
