# Adapter verification

- Browser tool: 8 Playwright checks passed, including real Markdown downloads for four modes, unknown/malformed input, stale-export protection and 390px layout.
- VS Code: tested in a real 1.145.2 extension host. Four modes validated and exported to new unsaved Markdown documents without changing inputs; malformed JSON, unknown fields and oversized input produced this extension’s diagnostics. Seven checks passed.
- Standalone HTML: four modes and Markdown download passed over local HTTP. File-protocol navigation is unsupported by the automated browser and was not verified.
- Chrome: uses the same tested browser module, requests no host/API permissions. Store registration and actual extension installation remain unverified.
- Docker: build context only. No image has been built, pushed or pulled in this run.
- Marketplace publication, account registration and review status are separate from these source/download checks.

The original library is the MIT-licensed freeaivideo-prompt-kit 0.1.1. No model or private site implementation is included.
