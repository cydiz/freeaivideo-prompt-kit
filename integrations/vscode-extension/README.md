# Free AI Video Offline Prompt Kit

Validate a creative brief in the active JSON document, then export a Markdown plan into a new unsaved editor tab. No automatic workspace scanning, network calls, API keys, telemetry, generation, or reference-image reads.

## Use

1. Open a brief JSON with `version: 1`, a mode (`text-to-video`, `image-to-video`, `text-to-image`, `image-to-image`) and a nonempty `subject`.
2. Image-to modes also need a `reference` reminder. It is never read or uploaded.
3. Open the Command Palette and run **Free AI Video: Validate Creative Brief**.
4. Fix the reported errors. Then run **Free AI Video: Export Brief as Markdown**.
5. Review the new document and save it yourself. The original brief is not modified.

Example: `{"version":1,"mode":"text-to-video","subject":"A ceramic cup","action":"Steam rises gently"}`.

Input is limited to 64 KiB, each text field to 500 UTF-16 code units and the assembled prompt to 2,000. Unknown fields are rejected. Validation checks the planning format, not model compatibility or generation quality.

[Free AI Video website](https://freeaivideo.art) · [CLI, library and tutorials](https://github.com/cydiz/freeaivideo-prompt-kit)

The offline extension is free under MIT. Website generation is separate and requires sign-in, credits and service availability. No website source, production configuration, private workflow or model weights are included.
