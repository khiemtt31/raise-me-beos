---
name: cinematic-webgl
description: Build and review progressive-enhancement Three.js scenes with React Three Fiber, Drei, shaders, lighting, particles, and adaptive quality. Use for a WebGL hero, GLB scene, shader reveal, cinematic lighting, or particle effect in this portfolio.
---

# Cinematic WebGL

## Operating rules

- Keep semantic HTML, navigation, content, and contact actions outside the canvas.
- Render a static fallback until WebGL capability, model availability, and motion preference are known.
- Load Three/R3F/Drei in a client-only island with Suspense; never make the root page client-only for the canvas.
- Own one scene boundary and dispose geometries, materials, textures, render targets, loaders, and controls on unmount.

## Scene workflow

1. Confirm composition, camera behavior, model budget, fallback, reduced-motion behavior, and post-intro quality in docs/SPEC.md.
2. Prototype camera, silhouette, and lighting with the smallest placeholder geometry.
3. Use R3F useFrame for imperative ref mutations. Never call React state setters, allocate objects, or traverse the scene every frame.
4. Add bounded shader uniforms, then lights and particles incrementally. Avoid unnecessary full-screen passes.
5. Cap DPR and adapt quality from viewport, motion preference, device capability, and measured frame time.
6. After the intro, reduce particles, postprocessing, light animation, and render-loop work.
7. Test context loss, failed loads, resize, tab visibility, reduced motion, touch, and low-end fallback.

## Constraints

- Prefer stable refs and reused geometries/materials/textures; never allocate in useFrame.
- Set explicit camera planes, texture color spaces, tone mapping, shadow limits, and low-tier settings.
- Use frameloop=demand or stop expensive effects after settling when interaction does not require continuous frames.
- Expose a textual description and error/loading state outside the canvas.

## References

- Three.js renderer: https://threejs.org/docs/pages/WebGLRenderer.html
- R3F performance: https://r3f.docs.pmnd.rs/advanced/pitfalls
- R3F model loading: https://r3f.docs.pmnd.rs/tutorials/loading-models
- Drei: https://github.com/pmndrs/drei
- WebGL fundamentals: https://webglfundamentals.org/
