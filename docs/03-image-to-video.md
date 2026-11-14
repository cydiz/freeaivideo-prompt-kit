# Image to Video: Prepare a Reference & Motion Brief

Plan a restrained animation for an existing product photo. This exercise is intended for creators who have the right to use their reference material.

## Before you start

Choose a clear photo you took yourself or are otherwise authorized to use. Avoid including unnecessary faces, personal information, or private material in examples. A reference filename in the tool is only a reminder: no picture is bundled, read, or uploaded.

Online continuation: [Free AI Video Video studio](https://freeaivideo.art/studio/video-tools).

## Steps

1. Review the subject and composition. A photo of one cup makes the intended movement easier to describe than several independently moving subjects.
2. Write down what you hope to preserve, such as the cup’s shape, color, and placement on the table. This expresses an intention; it cannot guarantee exact preservation.
3. Choose one subtle movement: rising steam, a lightly moving curtain, or a slow camera push-in. Avoid combining major transformations and multiple scene changes in the first plan.
4. Create an image-to-video brief and add a recognizable reference reminder, such as `my-authorized-cup-photo.png`.
5. Save the brief and manually confirm your rights to the image. The validator cannot assess copyright, likeness rights, or authenticity.

## Original brief example

```json
{
  "version": 1,
  "mode": "image-to-video",
  "subject": "The handmade ceramic cup in the reference image; preserve its shape and color",
  "action": "Steam rises gently while the cup stays still",
  "camera": "Locked camera, single shot",
  "lighting": "Keep the soft window light from the reference",
  "reference": "my-authorized-cup-photo.png"
}
```

## Continue when the website is available

Open the video studio, expand Create, and choose the currently available Image to Video mode. Upload an authorized reference according to the interface, select an available model, and manually paste your assembled prompt. Check that the image has uploaded, review your balance and the displayed credit cost, then decide whether to submit.

Uploading is an online action that the offline tool does not perform. Follow the current interface for supported file types, sizes, durations, and model capabilities. This guide has not verified public generation results and does not promise exact identity, text, trademark, or product-detail preservation.

## Check and troubleshoot

- `reference is required`: add a reference reminder to the brief. A filename is not a website upload.
- Website still requests an image: check the actual upload state in the studio. The brief cannot confirm that an upload completed.
- Subject changes too much: reduce motion and style requirements and clarify what you want preserved. Model limitations still apply.
- Upload fails: review current file requirements and connectivity. Do not send private material to an unfamiliar “repair” site.
- Service or credit error: stop repeated submissions and review account and task records.

For a still-image plan, you can instead choose `image-to-image`. Changing a brief’s mode does not enable advanced website editing capabilities. Next: [Offline Prompt Kit: Validate, Export & Troubleshoot](04-offline-tool.md). Product: [Free AI Video](https://freeaivideo.art).
