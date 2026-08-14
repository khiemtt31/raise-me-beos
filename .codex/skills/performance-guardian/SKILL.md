---
name: performance-guardian
description: Gate expensive portfolio implementation against Core Web Vitals, bundle size, WebGL runtime cost, and regression evidence. Use before approving hero effects, new dependencies, animation loops, asset changes, or changes affecting LCP, INP, CLS, memory, or frame rate.
---

# Performance Guardian

## Veto rules

- Veto an effect or dependency when its budget, fallback, or measurement plan is missing.
- Do not trade usable content for cinematic polish. WebGL, model loading, and animation must be deferrable.
- “It feels smooth” is not evidence; record device/browser, network, CPU/GPU tier, and measurements.

## Measurement workflow

1. Define LCP, INP, CLS, initial JS, hero transfer, GLB/texture bytes, frame time, memory, and fallback targets in docs/SPEC.md.
2. Establish a baseline with npm run build:cloudflare, bundle inspection, and browser measurement.
3. Keep initial HTML useful without JavaScript; reserve media dimensions and lazy-load below-fold evidence.
4. Code-split WebGL/motion and avoid loading the 3D stack for reduced motion or unsupported devices.
5. Measure intro and settled states separately. Cap DPR, particles, lights, shadows, postprocessing, and loop work; lower quality on slow frames.
6. Re-measure after every expensive change and record approved tradeoffs with fallbacks.

## Failure modes

- Clientifying the root and inflating the initial bundle.
- LCP blocked by a model, video, font, or oversized PNG.
- INP harmed by pointer/scroll handlers, layout thrashing, or frame-by-frame React state.
- CLS from late media, fonts, canvas sizing, or dynamic content.
- GPU memory growth from undisposed models, textures, render targets, or route transitions.
- Battery/thermal cost from perpetual loops, filters, high DPR, and off-screen animation.

## References

- Core Web Vitals: https://web.dev/articles/vitals
- LCP: https://web.dev/articles/lcp
- INP: https://web.dev/articles/inp
- CLS: https://web.dev/articles/cls
- R3F performance: https://r3f.docs.pmnd.rs/advanced/pitfalls
