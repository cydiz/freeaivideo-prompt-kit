#!/usr/bin/env node
import { createExample, validateBrief, compileBrief, toMarkdown } from '../src/index.js';

const HELP = `freeaivideo-prompt-kit — offline creative brief helper

  freeaivideo-prompt-kit init [--mode text-to-video|image-to-video|text-to-image|image-to-image]
  freeaivideo-prompt-kit validate <file.json|->
  freeaivideo-prompt-kit render <file.json|-> [--format prompt|json|markdown]

Writes to stdout; use shell redirection to save. '-' reads stdin (64 KiB maximum).
Exit codes: 0 success, 1 invalid brief/input, 2 command usage error.
No network calls, uploads, generation, accounts or API keys. Node.js >=20.
`;
const MAX_BYTES = 65536;

async function readInput(path) {
  let data;
  if (path === '-') {
    const chunks = [];
    let size = 0;
    for await (const chunk of process.stdin) {
      size += chunk.length;
      if (size > MAX_BYTES) throw new Error('Input exceeds 64 KiB.');
      chunks.push(chunk);
    }
    data = Buffer.concat(chunks);
  } else {
    const { open } = await import('node:fs/promises');
    const handle = await open(path, 'r');
    try {
      const buffer = Buffer.alloc(MAX_BYTES + 1);
      let size = 0;
      while (size < buffer.length) {
        const { bytesRead } = await handle.read(buffer, size, buffer.length - size, null);
        if (!bytesRead) break;
        size += bytesRead;
      }
      data = buffer.subarray(0, size);
    } finally { await handle.close(); }
  }
  if (data.length > MAX_BYTES) throw new Error('Input exceeds 64 KiB.');
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(data));
}

const args = process.argv.slice(2);
const [command, path, option, value] = args;
if (!command || command === '--help') {
  process.stdout.write(HELP);
} else if (command === 'init' && (args.length === 1 || (args.length === 3 && path === '--mode'))) {
  try { process.stdout.write(JSON.stringify(createExample(option), null, 2) + '\n'); }
  catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 2; }
} else if (['validate', 'render'].includes(command) && path && !path.startsWith('--') &&
  (args.length === 2 || (command === 'render' && args.length === 4 && option === '--format' && ['prompt', 'json', 'markdown'].includes(value)))) {
  try {
    const input = await readInput(path);
    if (command === 'validate') {
      const result = validateBrief(input);
      process.stdout.write(JSON.stringify(result, null, 2) + '\n');
      if (!result.valid) process.exitCode = 1;
    } else {
      const format = value ?? 'prompt';
      process.stdout.write(format === 'markdown' ? toMarkdown(input) :
        format === 'json' ? JSON.stringify(compileBrief(input), null, 2) + '\n' : compileBrief(input).prompt + '\n');
    }
  } catch (error) { process.stderr.write(`Input error: ${error.message}\n`); process.exitCode = 1; }
} else {
  process.stderr.write(HELP);
  process.exitCode = 2;
}
