# Free AI Video Prompt Kit

Turn a loose image or video idea into a clear, reusable creative brief. This independent **offline** CLI and JavaScript library validates a local JSON format, assembles prompt text, and exports Markdown.

[npm 0.1.0](https://www.npmjs.com/package/freeaivideo-prompt-kit/v/0.1.0) · [Free AI Video](https://freeaivideo.art) · [English tutorials](docs/index.md) · [Notion tutorial center](https://frequent-option-c81.notion.site/4170d247536b810a80eefc76c33806f5)

## What it does

- Create examples for text-to-video, image-to-video, text-to-image and image-to-image planning.
- Validate fields, supported modes, lengths and reference reminders.
- Assemble subject, action, setting, camera, lighting, style and avoidance text.
- Export plain text, JSON or Markdown from an explicit file or stdin.

The tool makes no network requests, reads no reference images, uploads nothing and generates no media. It is not an official model, generation API, provider SDK or locally runnable model. Passing validation does not establish model compatibility or output quality. `avoid` becomes ordinary prompt text, not a model-specific negative-prompt setting.

## Installation and examples

Requires Node.js 20 or later. Zero runtime dependencies. No account or API key is needed for the offline tool.

**Published:** `freeaivideo-prompt-kit@0.1.0` is available from npm. The exact registry version has passed fresh installation, JavaScript API and 12 CLI export checks. Install with:

```sh
npm install --global freeaivideo-prompt-kit@0.1.0
freeaivideo-prompt-kit init --mode text-to-video > my-brief.json
freeaivideo-prompt-kit validate my-brief.json
freeaivideo-prompt-kit render my-brief.json --format markdown > my-plan.md
```

Run from source today:

```sh
git clone https://github.com/cydiz/freeaivideo-prompt-kit.git
cd freeaivideo-prompt-kit
node bin/cli.js init --mode image-to-video > my-brief.json
node bin/cli.js validate my-brief.json
node bin/cli.js render my-brief.json --format prompt
node bin/cli.js render my-brief.json --format markdown > my-plan.md
npm test
```

Use a new output filename: shell redirection overwrites existing files. UTF-8 input and output are expected. For stdin:

```sh
cat examples/text-to-video.json | node bin/cli.js validate -
```

PowerShell: `Get-Content -Raw examples/text-to-video.json | node bin/cli.js validate -`.

## Brief format

```json
{
  "version": 1,
  "mode": "text-to-video",
  "subject": "A handmade ceramic cup on a wooden table",
  "action": "Steam rises gently while the cup stays still",
  "camera": "Single shot, slow push-in",
  "lighting": "Soft window light from the left",
  "avoid": "Added logos or lettering"
}
```

`version: 1`, a supported `mode` and nonempty `subject` are required. Image-to modes also require a `reference` string, such as `my-authorized-cup-photo.png`. It is a reminder, never a file-read or upload instruction. Missing video `action` produces a warning. Optional fields are `action`, `setting`, `camera`, `lighting`, `style`, `avoid` and `reference`. Unknown fields are rejected.

Limits are 500 UTF-16 code units per text field, 2,000 for the assembled prompt and 64 KiB for CLI input. These are this tool's format rules, not website or model guarantees. It does not support duration, resolution, seed, model selection, price estimates or automatic task submission.

Exit codes: `0` success, `1` invalid input/brief, `2` usage error. Validation JSON goes to stdout; input errors and usage diagnostics go to stderr. Use `node bin/cli.js --help` for command usage.

## JavaScript API

```js
import { createExample, validateBrief, compileBrief, toMarkdown } from 'freeaivideo-prompt-kit';
const brief = createExample('image-to-video');
brief.reference = 'my-authorized-cup-photo.png';
if (validateBrief(brief).valid) {
  console.log(compileBrief(brief).prompt);
  console.log(toMarkdown(brief));
}
```

The library does not access disk or network. The CLI reads only the brief file or stdin you explicitly specify. Keep credentials and private links out of briefs you share.

## Tutorials

1. [Getting Started: Free Access, Credits & Availability](docs/01-start.md)
2. [Text to Video: Plan One Clear Shot](docs/02-text-to-video.md)
3. [Image to Video: Prepare a Reference & Motion Brief](docs/03-image-to-video.md)
4. [Offline Prompt Kit: Validate, Export & Troubleshoot](docs/04-offline-tool.md)

## Free access and website limits

This original tool, its tutorials and examples are free under MIT, without registration. Website generation is a separate service requiring sign-in, sufficient credits and an available provider. A standing signup allowance, daily quota or unlimited free tier has not been confirmed.

As of November 14, 2026, HTTPS access is available. Local image/video generation and PayPal sandbox acceptance passed, but the tested fixes have not been deployed publicly. Public generation, checkout, Google sign-in and real subscription renewals remain unverified. The local product catalog starts at $4.99 USD for a one-time pack and $3.99 USD for an automatically renewing monthly plan. Check current live prices, available credits and terms before submitting or purchasing. These tutorials do not promise generated quality, speed, fixed output counts or access to every displayed model.

## License and scope

MIT applies only to the original tool, examples and tutorials in this independent repository. The website's full source, commercial template, backend implementations, production configuration, databases, private workflows and model weights are not included or licensed here. No model vendor partnership or endorsement is claimed. Rights to reference material and generated results must be checked separately.

## Tests and troubleshooting

`npm test` covers all four modes, malformed inputs, Unicode, bounds, Markdown escaping, files/stdin and CLI exit codes. JSON must use double quotes and cannot contain comments. Quote file paths containing spaces. A reference reminder does not prove an image was uploaded. Website errors cannot be fixed by changing account credits through this tool.

Report reproducible issues through [GitHub Issues](https://github.com/cydiz/freeaivideo-prompt-kit/issues), using fictional or sanitized inputs. Do not attach credentials or private images.
