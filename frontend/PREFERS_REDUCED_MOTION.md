# prefers-reduced-motion Notes

Components honoring reduced motion:
- Navbar, Hero, Stats, Features, HowItWorks, CTA sections
- Footer background animation
- AI chat typing indicator (sidebar)

Guideline: wrap animations with `useReducedMotion` and provide static fallbacks (opacity/scale=1). Avoid continuous rotations/translations when the user requests reduced motion.
