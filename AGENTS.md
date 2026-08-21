# Repository instructions

This repository contains a standard DeepSeek Harness plugin. Preserve these
rules in every change:

1. Do not modify DSH core or any `@deepseek-ai/*` package.
2. Do not hide, reorder, replace, shadow, or inject icons into the official
   settings navigation until DSH provides a documented public icon seam.
3. Browser code may inspect public slot metadata and activate an existing
   official control only after an explicit user click.
4. Do not use Loader/Fiber mutation APIs, Node APIs in the browser bundle,
   network access, commands, credentials, or real Profile writes.
5. Keep plugin-owned browser state bounded and fail closed on malformed data;
   icons must come only from the embedded line-SVG palette.
6. Tests must be disposable and must never write to `~/.dsh`.
7. Run `npm run check` before committing.
8. Repository release, catalog listing, public visibility, and real Profile
   installation are separate acceptance gates.
