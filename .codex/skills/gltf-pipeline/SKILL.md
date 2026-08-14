---
name: gltf-pipeline
description: Prepare, optimize, and validate Blender-to-GLB assets for the portfolio hero. Use when importing a character model, running glTF Transform, reducing textures or geometry, consolidating materials, or checking a runtime GLB against production budgets.
---

# glTF Pipeline

## Intake and export

- Require an approved source, license/permission, target framing, fallback, and explicit triangle/texture/file-size budgets.
- In Blender, apply transforms, remove unused objects, name nodes predictably, set origin/scale, and export binary GLB with only required animations.
- Keep environment, lights, camera, and unused animation out of the character asset unless explicitly required.

## Optimization workflow

1. Preserve the source and record its revision and license.
2. Inspect the raw GLB: nodes, meshes, primitives, triangles, animations, materials, textures, dimensions, file size, and extensions.
3. Use glTF Transform deterministically: inspect, dedup, prune, join, quantize, meshopt, and texture resizing/compression as appropriate.
4. Consolidate materials only when the approved look survives; preserve independent shader uniforms and reveal boundaries.
5. Re-run validation after every step and load the final GLB in the actual runtime.

## Release checks

- Record GLB bytes, transfer bytes, triangles, draw calls/materials, texture count/dimensions, animations, and initial load time in docs/SPEC.md.
- Keep a low-quality/mobile asset or static fallback if the full asset misses the mobile budget.
- Reject missing textures, broken skinning, unsupported extensions, excessive draw calls, unbounded animation, or unacceptable memory.
- Verify disposal and texture memory after unmount and reload.

## References

- Blender glTF exporter: https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html
- Khronos glTF: https://registry.khronos.org/glTF/
- glTF Transform: https://gltf-transform.dev/
- glTF Validator: https://github.com/CesiumGS/gltf-validator
