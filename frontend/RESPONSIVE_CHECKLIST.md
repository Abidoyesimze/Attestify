# Responsive QA Checklist

Breakpoints to verify:
- 320px (small phones)
- 375px (iPhone X)
- 414px (large phones)
- 768px (tablets)
- 1024px (small desktop)
- 1440px (large desktop)

Sections to check:
- Navbar: toggle/hamburger, scroll behavior, focus states, overflow.
- Hero: heading wrap, CTA buttons stacking, trust chips line wrap, background blobs.
- Stats: grid stacking, number sizing and line-height.
- Features: card heights, icon sizes, hover/tap behavior on touch.
- How It Works: step cards spacing, connector lines off on mobile, badge overlap.
- CTA: blob animations reduced, button tap target, trust bullets wrapping.
- Footer: accordion on mobile, focus states, external link icons visibility.

Motion/accessibility:
- Test with `prefers-reduced-motion`: animations should be minimal/disabled.
- Keyboard: skip link, nav toggle, focus rings visible on buttons/links.
- Screen reader: nav toggle announces expanded state.

General checks:
- No horizontal scrollbars at any breakpoint.
- Images/SVGs scale within container; text does not overflow cards/buttons.
- Buttons/inputs maintain at least 40px touch targets.
