---
name: visual-qa
description: Validate the portfolio visually and interactively with Playwright, responsive screenshots, reduced-motion checks, and WebGL/static-fallback scenarios. Use when reviewing a route, breakpoint, animation, hero effect, model failure path, or visual regression.
---

# Visual QA

## Test workflow

- Use deterministic viewports, device scale, color scheme, and motion settings. Capture desktop, tablet, and mobile baselines for every approved route/state.
- Test keyboard navigation, skip link, focus visibility, nav activation, contact links, project controls, scroll/gesture behavior, and loading/error/fallback states.
- Exercise prefers-reduced-motion, WebGL/context failure, failed model load, slow network, and low-quality device profiles.

## Playwright practices

- Use role/name locators and user-visible assertions; avoid implementation selectors.
- Set page.emulateMedia with reducedMotion=reduce and assert strobe/looping effects do not run.
- Mock model/network failure in a dedicated test and assert the HTML fallback owns the content.
- Store traces/screenshots on failure. Keep diff thresholds explicit and review intentional changes.
- Test one touch/mobile context and one keyboard-only flow.

## Evidence

Record browser, OS, viewport, commit, command, screenshot diff summary, and limitations. Playwright does not prove every GPU, Cloudflare Worker, credentialed, or production-host behavior.

## References

- Screenshots: https://playwright.dev/docs/screenshots
- Emulation: https://playwright.dev/docs/emulation
- Visual comparisons: https://playwright.dev/docs/test-snapshots
- Accessibility testing: https://playwright.dev/docs/accessibility-testing
