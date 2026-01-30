# Motion Guidelines

- Default: gentle translations/opacity; avoid large parallax on mobile.
- `prefers-reduced-motion`: disable or minimize continuous animations; fall back to static opacity.
- Loading indicators: use low-frequency pulses or static icons when reduced motion is set.
- Background blobs: cap size/blur on mobile; avoid heavy GPU load.
- Hover-only effects: ensure touch devices degrade gracefully without layout shift.
