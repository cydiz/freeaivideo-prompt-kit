import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODES, createExample, validateBrief, compileBrief, toMarkdown } from '../src/index.js';

const cli = fileURLToPath(new URL('../bin/cli.js', import.meta.url));
const run = (args, input) => spawnSync(process.execPath, [cli, ...args], { input, encoding: 'utf8' });

test('all four example modes compile without model credentials', () => {
  for (const mode of MODES) {
    const result = compileBrief(createExample(mode));
    assert.equal(result.mode, mode);
    assert.match(result.prompt, /ceramic cup/);
    assert.equal(result.reference !== null, mode.startsWith('image-to-'));
    assert.ok(!result.prompt.includes('my-authorized-cup-photo.png'));
  }
});
test('invalid JSON value types and malformed modes return errors, never crash', () => {
  for (const input of [null, [], 3, 'text', {}, { version: 1, mode: { startsWith: 'bad' } },
    { version: 1, mode: 42, subject: 'Cup' }, { ...createExample(), subject: 3 }]) {
    assert.equal(validateBrief(input).valid, false);
    assert.throws(() => compileBrief(input), TypeError);
  }
});
test('unknown fields prevent mistaking the brief for a provider request', () => {
  const result = validateBrief({ ...createExample(), apiKey: 'example-only', duration: 6 });
  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 2);
});
test('image modes need a reference reminder; reference content is never loaded', () => {
  const brief = createExample('image-to-video');
  delete brief.reference;
  assert.equal(validateBrief(brief).valid, false);
  brief.reference = '/does-not-exist.png';
  assert.equal(compileBrief(brief).reference, '/does-not-exist.png');
});
test('whitespace normalization, Unicode and motion warnings are preserved', () => {
  const result = validateBrief({ version: 1, mode: 'text-to-video', subject: '  手工陶杯 ☕  ' });
  assert.equal(result.brief.subject, '手工陶杯 ☕');
  assert.equal(result.warnings.length, 1);
});
test('field length, combined prompt length and control character limits', () => {
  assert.equal(validateBrief({ ...createExample(), subject: 'a'.repeat(501) }).valid, false);
  assert.equal(validateBrief({ ...createExample(), subject: 'a'.repeat(500), action: 'b'.repeat(500),
    setting: 'c'.repeat(500), style: 'd'.repeat(500) }).valid, false);
  assert.equal(validateBrief({ ...createExample(), subject: 'cup\u0000' }).valid, false);
});
test('Markdown resists code fence escape and HTML/link injection', () => {
  const brief = { ...createExample('image-to-image'), subject: 'cup\n```\n<script>bad</script>', reference: '[click](https://example.com)' };
  const md = toMarkdown(brief);
  assert.match(md, /````text/);
  assert.match(md, /\\\[click\\\]\\\(https:/);
  assert.match(md, /No generation/);
});
test('CLI init → validate → render, including stdin and local files', () => {
  const init = run(['init', '--mode', 'image-to-video']);
  assert.equal(init.status, 0);
  assert.equal(run(['validate', '-'], init.stdout).status, 0);
  const temp = mkdtempSync(join(tmpdir(), 'prompt-kit-test-'));
  const path = join(temp, '中文 brief.json');
  writeFileSync(path, init.stdout);
  const rendered = run(['render', path, '--format', 'json']);
  assert.equal(rendered.status, 0);
  assert.match(JSON.parse(rendered.stdout).prompt, /slow push-in/);
  assert.equal(run(['render', '-', '--format', 'markdown'], init.stdout).status, 0);
});
test('CLI rejects invalid JSON, oversized input, unreadable files, invalid UTF-8 and unknown flags', () => {
  for (const input of ['{bad', ' '.repeat(65537), Buffer.from([0xff])]) {
    assert.equal(run(['validate', '-'], input).status, 1);
  }
  assert.equal(run(['validate', '/does-not-exist.json']).status, 1);
  assert.equal(run(['render', '-', '--format', 'html'], '{}').status, 2);
  assert.equal(run(['init', '--mode', 'model-name']).status, 2);
  assert.equal(run(['validate', '-', 'ignored'], '{}').status, 2);
});
test('CLI validation failure exits nonzero and reports field errors', () => {
  const result = run(['validate', '-'], JSON.stringify({ version: 1, mode: 'image-to-video' }));
  assert.equal(result.status, 1);
  assert.equal(JSON.parse(result.stdout).valid, false);
  assert.match(result.stdout, /reference is required/);
});
