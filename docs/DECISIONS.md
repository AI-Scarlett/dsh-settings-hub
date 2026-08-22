# Architecture decisions

## Host contract

- Requested outcome: make a large DSH settings surface searchable and easier to navigate.
- Target host: DeepSeek Harness Web `0.1.1-rc.1` and `0.1.1-rc.2`.
- Public seams: `window.__ModuleLoader__.load`, `settings.section`, `settings.plugins.tab`, `ctx.slots.entriesOfSlot`, `ctx.slots.subscribe`.
- Bundle route: direct, repository root.
- Risk: R1 because custom tabs, assignments, favorites, and icons are plugin-owned persistent browser state.
- Evidence target: E3 disposable; real Profile remains a separate E4 gate.

## Decision: additive hub instead of navigation replacement

| Field | Decision |
| --- | --- |
| Objective | Improve discovery without risking official navigation ownership. |
| Rationale | Reordering or hiding official DOM is brittle across DSH releases and makes recovery depend on plugin cleanup. |
| Chosen option | Register one additive settings section that reads public slot metadata. |
| Benefit | Original navigation always remains available; uninstall removes only one owned row. |
| Cost | The hub cannot permanently rearrange DSH navigation. |
| Alternative rejected | DOM `MutationObserver` reordering and hiding. |
| Evidence | Static forbidden-pattern tests and disposable UI smoke. |
| Reconsider when | DSH publishes an official settings-navigation customization service. |

## Decision: existing-control activation

| Field | Decision |
| --- | --- |
| Objective | Let users open an indexed page without a private routing API. |
| Rationale | DSH rc.1/rc.2 exposes slot registration metadata but no general `openSection` service to arbitrary settings pages. |
| Chosen option | After an explicit user click, find the exact visible label inside the current official settings dialog and invoke that existing button. |
| Benefit | No synthetic page rendering and no mutation of official navigation structure. |
| Cost | A changed label or settings DOM can make quick-open degrade. |
| Failure | Show a bounded message and leave the official navigation untouched. |
| Evidence | Unit test proves only existing controls receive `.click()`. |
| Reconsider when | DSH exports a public `openSettingsSection(id)` seam. |

## Decision: plugin-owned line icon palette

| Field | Decision |
| --- | --- |
| Objective | Let users visually distinguish settings and plugin pages. |
| Rationale | DSH rc.1/rc.2 `settings.section` exposes `id`, `order`, and `label`, but no official icon field or sidebar icon customization seam. |
| Chosen option | Ship 14 dependency-free line SVG icons, automatically recommend one by bounded entry metadata, and allow per-entry selection inside Settings Hub. |
| Benefit | Offline, theme-aware, auditable icons without remote fonts, assets, or scripts. |
| Cost | Configured icons appear only in the plugin-owned hub, not the official DSH sidebar. |
| Failure | Unknown or malformed icon IDs are discarded; the entry falls back to an automatic built-in icon. |
| Evidence | Unit tests validate palette rendering, bounded persistence, and rejection of unknown IDs. |
| Reconsider when | DSH publishes an official settings icon field or customization service. |

## Decision: saved custom tabs inside Settings Hub

| Field | Decision |
| --- | --- |
| Objective | Let users explicitly organize plugin and settings pages into named tabs, with understandable save/cancel behavior. |
| Rationale | DSH rc.1/rc.2 exposes read-only slot metadata but no public API for adding, removing, or reordering official settings navigation. |
| Chosen option | Provide an edit mode for plugin-owned custom tabs, item assignments, favorites, and icons; persist only after an explicit save. |
| Benefit | Users can organize the hub without risking official navigation or Profile state. |
| Cost | Custom tabs appear only inside Settings Hub and do not alter the official sidebar. |
| Failure | Invalid or oversized stored state is discarded; deleting a custom tab returns its assignments to default grouping. |
| Evidence | Unit tests cover explicit save, custom-tab assignment, filtering, removal, and bounded normalization. |
| Reconsider when | DSH publishes a supported settings-navigation customization service. |

## Permission matrix

| Action/data | Owner | Limit | Failure behavior | Test |
| --- | --- | --- | --- | --- |
| Read slot entry IDs, labels, order and registrant | Client | Current `settings.section` and `settings.plugins.tab` only | Empty list | Client fixture |
| Store custom tabs, item assignments, favorite IDs and icon choices | Client localStorage | 12 tabs, 128 tab assignments, 64 favorites, 128 icon assignments, 32 KiB | Empty in-memory preferences and automatic grouping/icons | Save, assignment, removal, malformed/oversized tests |
| Render line icons | Client React tree | 14 embedded SVG definitions, decorative only | Generic grid icon | Palette rendering test |
| Activate an existing settings control | Client/user click | Current modal, exact visible label | No click; status message | Exact-control activation test |

## Non-goals

- No DSH core or official package changes.
- No official navigation hiding, movement, wrapping, cloning, replacement, or icon injection.
- No Profile settings persistence.
- No Host route, network, process, credentials, device, model Tool, restart, or background automation.
