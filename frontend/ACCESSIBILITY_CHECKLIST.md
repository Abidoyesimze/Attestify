# Accessibility QA Checklist

Keyboard
- Tab order follows visual order; no keyboard traps
- Skip link works and lands on main content
- All interactive elements show visible focus

Screen readers
- Navbar toggle has aria-label and expanded state
- Links/buttons have descriptive text
- Sections use landmark roles where applicable

Motion
- Respect `prefers-reduced-motion` for animated backgrounds and loaders
- Avoid parallax/large translations on mobile when reduced motion is set

Touch targets
- Buttons/inputs at least 44px height on mobile
- Spacing prevents accidental taps

Color/contrast
- Text and controls meet contrast guidelines (WCAG AA)
- Hover/focus states maintain sufficient contrast

Layout
- No horizontal scrolling at common breakpoints
- Content reflows without overlap when zoomed to 200%

Forms
- Inputs have associated labels/aria-labels
- Error states are announced or clearly visible
