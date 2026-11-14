export const MODES = Object.freeze([
  'text-to-video', 'image-to-video', 'text-to-image', 'image-to-image',
]);
export const MAX_PROMPT_LENGTH = 2000;
const FIELDS = Object.freeze(['subject', 'action', 'setting', 'camera', 'lighting', 'style', 'avoid', 'reference']);
const ALLOWED = new Set(['version', 'mode', ...FIELDS]);
const LABELS = Object.freeze({ subject: 'Subject', action: 'Action', setting: 'Setting', camera: 'Camera', lighting: 'Lighting', style: 'Style', avoid: 'Avoid' });

function assemble(brief) {
  return Object.entries(LABELS)
    .filter(([key]) => brief[key])
    .map(([key, label]) => `${label}: ${brief[key]}`)
    .join('\n');
}

/** Validate this tool's planning format. This is not a model/API compatibility check. */
export function validateBrief(input) {
  const errors = [];
  const warnings = [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, errors: ['Brief must be a JSON object.'], warnings };
  }
  for (const key of Object.keys(input)) {
    if (!ALLOWED.has(key)) errors.push(`Unknown field: ${key}`);
  }
  const mode = typeof input.mode === 'string' ? input.mode : '';
  if (input.version !== 1) errors.push('version must be 1.');
  if (!MODES.includes(input.mode)) errors.push(`mode must be one of: ${MODES.join(', ')}.`);
  const brief = { version: 1, mode: input.mode };
  for (const key of FIELDS) {
    if (input[key] !== undefined && typeof input[key] !== 'string') {
      errors.push(`${key} must be a string.`);
      continue;
    }
    const value = (input[key] ?? '').trim();
    if (value.length > 500) errors.push(`${key} exceeds 500 UTF-16 code units.`);
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)) {
      errors.push(`${key} contains an unsupported control character.`);
    }
    if (value) brief[key] = value;
  }
  if (!brief.subject) errors.push('subject is required.');
  if (mode.startsWith('image-to-') && !brief.reference) {
    errors.push('reference is required for image-to modes (a local reminder, not an upload).');
  }
  if (mode.endsWith('-video') && !brief.action) {
    warnings.push('Add one simple action to make the intended motion clearer.');
  }
  if (brief.reference && !mode.startsWith('image-to-')) {
    warnings.push('reference is only a reminder; it is never read or uploaded.');
  }
  if (assemble(brief).length > MAX_PROMPT_LENGTH) {
    errors.push(`Assembled prompt exceeds ${MAX_PROMPT_LENGTH} UTF-16 code units.`);
  }
  return { valid: errors.length === 0, errors, warnings, ...(errors.length ? {} : { brief }) };
}

export function compileBrief(input) {
  const result = validateBrief(input);
  if (!result.valid) throw new TypeError(result.errors.join('\n'));
  return {
    version: 1,
    mode: result.brief.mode,
    prompt: assemble(result.brief),
    reference: result.brief.reference ?? null,
    warnings: result.warnings,
  };
}

function mdText(value) {
  return value.replace(/[\\`*_{}\[\]()#+.!<>|~-]/gu, '\\$&').replace(/\r?\n/gu, ' ');
}

export function toMarkdown(input) {
  const output = compileBrief(input);
  const fence = '`'.repeat(Math.max(3, ...[...output.prompt.matchAll(/`+/gu)].map(m => m[0].length + 1)));
  return [
    '# Creative brief', '', `Mode: ${output.mode}`, '',
    '## Prompt', '', `${fence}text`, output.prompt, fence, '',
    '## Reference reminder', '', output.reference ? mdText(output.reference) : 'None.', '',
    ...output.warnings.flatMap(warning => [`Note: ${warning}`, '']),
    'Prepared offline. No generation, upload, credit estimate or model validation was performed.', '',
    'Website: https://freeaivideo.art', '',
  ].join('\n');
}

export function createExample(mode = 'text-to-video') {
  if (!MODES.includes(mode)) throw new TypeError('Unsupported mode.');
  return {
    version: 1, mode,
    subject: 'A handmade ceramic cup on a wooden table',
    action: mode.endsWith('-video') ? 'Steam rises gently; the cup stays still' : 'A quiet product still life',
    setting: 'A small studio with a plain background',
    camera: mode.endsWith('-video') ? 'One slow push-in, single shot' : 'Eye-level close-up',
    lighting: 'Soft window light from the left',
    style: 'Natural textures, warm neutral colors',
    avoid: 'Added logos or lettering',
    ...(mode.startsWith('image-to-') ? { reference: 'my-authorized-cup-photo.png' } : {}),
  };
}
