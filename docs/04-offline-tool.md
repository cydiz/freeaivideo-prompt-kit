# Offline Prompt Kit: Validate, Export & Troubleshoot

Turn a prompt into reusable fields, catch format errors, and export a Markdown plan for a handoff. The tool does not generate media or call website interfaces. No account or API key is required.

## Before you start

Install Node.js 20 or later and obtain the source from the [independent GitHub repository](https://github.com/cydiz/freeaivideo-prompt-kit), or an inspected npm tarball. Run the `node bin/cli.js` commands below inside the repository directory; they do not depend on registry publication. The repository provides runnable examples and documentation for this offline format.

Install the registry release with `npm install --global freeaivideo-prompt-kit@0.1.1`. For a global install, replace `node bin/cli.js` below with `freeaivideo-prompt-kit`. If a registry error occurs, use source instructions instead of substituting a similarly named package.

## Steps

1. Create an example using a new filename. Shell redirection overwrites an existing file with the same name:

```bash
node bin/cli.js init --mode text-to-video > my-brief.json
```

2. Use a text editor to change the subject, action, setting, camera, lighting, and style while keeping valid JSON. The examples are original creative intentions, not generated results.
3. Validate the brief:

```bash
node bin/cli.js validate my-brief.json
```

A successful check returns `valid: true` in JSON and exits with code 0. Missing video action text can produce a warning rather than an error. Passing validation does not establish that a model can implement the description.

4. Export a prompt and Markdown, choosing new output filenames:

```bash
node bin/cli.js render my-brief.json --format prompt > my-prompt.txt
node bin/cli.js render my-brief.json --format markdown > my-plan.md
```

5. Review the output yourself. Once the website is accessible, manually paste the text from `my-prompt.txt` into the appropriate [Free AI Video](https://freeaivideo.art) studio. Website sign-in, credits, and service availability are separate requirements.

## Validation scope

Supported planning modes: `text-to-video`, `image-to-video`, `text-to-image`, and `image-to-image`. A brief requires `version: 1`, a supported `mode`, and a nonempty `subject`. Image-to modes also require a `reference` reminder. Each text field is limited to 500 UTF-16 code units, and the assembled prompt to 2,000. CLI input is limited to 64 KiB.

These are the tool’s own format rules. It does not validate model parameters, read images, set duration or resolution, estimate prices, submit tasks, or generate batches. `avoid` becomes a line of prompt text, not a model-specific negative-prompt parameter. Reference text is never read as a file or uploaded.

## Troubleshooting

- `Input error` or JSON parse error: check double quotes, commas, and brackets. JSON does not accept comments.
- `Unknown field`: remove unsupported fields. `duration` and API keys are not part of this brief format.
- `subject is required`: add a nonempty subject; whitespace alone is not valid.
- `reference is required`: add a reminder for an image-to mode. Uploading to the website remains a separate manual action.
- Length error: remove repetition or split different creative goals into separate briefs.
- File not found: check the working directory and path, and quote paths containing spaces.
- Exit code unclear: 0 means success, 1 means invalid input or brief, and 2 means command usage error. Run `node bin/cli.js --help` for help.

## Free access and license

The original tool, tutorials, and examples are free under MIT, without registration. They do not include the website’s commercial template, backend services, or model weights. Review private content before sharing JSON or Markdown, and keep credentials and unauthorized material out of public repositories. Using the offline tool does not waive website generation credit or service charges.

As of November 14, 2026, HTTPS access is available. Image and video generation and PayPal sandbox payments have passed isolated local acceptance tests, but those fixes have not been deployed to the public website. Public generation and checkout remain unverified; Google sign-in and real subscription renewals are also unverified. Check the live interface before submitting or purchasing. The offline exercises remain usable without an account. Return to the [Free AI Video Tutorials — Creative Planning & Offline Tools](index.md) to continue a single-shot planning exercise without repeatedly submitting online tasks.
