# Adapter verification

- Browser tool: 8 Playwright checks passed, including real Markdown downloads for four modes, unknown/malformed input, stale-export protection and 390px layout.
- VS Code: tested in a real 1.145.2 extension host. Four modes validated and exported to new unsaved Markdown documents without changing inputs; malformed JSON, unknown fields and oversized input produced this extension’s diagnostics. Seven checks passed.
- Standalone HTML: four modes and Markdown download passed over local HTTP. File-protocol navigation is unsupported by the automated browser and was not verified.
- Chrome: uses the same tested browser module, requests no host/API permissions. Store registration and actual extension installation remain unverified.
- Hugging Face: the public Static Space is running at https://huggingface.co/spaces/cnblion/freeaivideo-offline-prompt-kit (commit 9a822281961dbc96607475e63c3cfd411ec7ab85). Seven anonymous Playwright checks passed: four modes with actual Markdown downloads, unknown-field rejection, stale-export protection and 390px layout.
- Docker: the engine started, but the dual-architecture build failed while fetching an anonymous token from auth.docker.io (connection timeout). Web login also failed to start and its password fallback was aborted. No image was built, pushed or pulled.
- Gumroad: the zero-minimum-price product description and 16.5 KB reviewed ZIP are saved as a draft. The platform requires a payout method before publication; the owner chose to keep the draft.
- Marketplace publication, account registration and review status are separate from these source/download checks.

The original library is the MIT-licensed freeaivideo-prompt-kit 0.1.1. No model or private site implementation is included.
