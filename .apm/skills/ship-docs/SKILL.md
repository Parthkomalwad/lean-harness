---
name: ship-docs
description: Use for the docs phase of a flow. Makes the README, the pitch deck and the demo video.
---

# Ship docs

## README

Write these sections in this order: one-line pitch, screenshot or GIF, live URL, quick start, stack, how it works, license. Keep the quick start to 3 commands or fewer.

## Pitch deck

Use the `pptx` skill. Make 6 slides: problem, demo, how it works, stack, results, ask. Put one idea on each slide.

## Demo video

<!-- TODO(parth): pick Remotion or screen recording as the default. -->

1. Write `docs/demo-script.md`: 90 seconds, a timed line for each scene.
2. Record each scene with `playwright-cli` video recording against the live URL.
3. Join the clips with `ffmpeg`. Add the voice-over or captions from the script.
