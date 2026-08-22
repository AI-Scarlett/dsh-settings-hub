# Architecture decisions

## Host contract

- Requested outcome: make a large DSH settings surface searchable and easier to navigate.
- Target host: DeepSeek Harness Web `0.1.1-rc.1` and `0.1.1-rc.2`.
- Compatibility declaration: Client peer ranges start at `0.1.1-rc.1`; rc.1 and rc.2 expose the three additive slots used by this plugin.
- Public seams: `window.__ModuleLoader__.load`, `settings.section`, `settings.plugins.tab`, `shell.overlay`, `ctx.slots.entriesOfSlot`, `ctx.slots.subscribe`.
- Bundle route: direct, repository root.
- Risk: R1 because custom tabs, assignments, favorites, and icons are plugin-owned persistent browser state.
- Evidence target: E3 disposable; real Profile remains a separate E4 gate.

## Decision: additive hub instead of navigation replacement

| Field | Decision |
| --- | --- |
| Objective | Improve discovery without risking official navigation ownership. |
| Rationale | Reordering or hiding official DOM is brittle across DSH releases and makes recovery depend on plugin cleanup. |
| Chosen option | Register additive plugin-owned section, shortcut Tab and overlay entries that read public slot metadata. |
| Benefit | Original navigation always remains available; uninstall removes only plugin-owned entries. |
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
| Cost | Configured icons appear only in plugin-owned surfaces, not in shipped or third-party DSH sidebar rows. |
| Failure | Unknown or malformed icon IDs are discarded; the entry falls back to an automatic built-in icon. |
| Evidence | Unit tests validate palette rendering, bounded persistence, and rejection of unknown IDs. |
| Reconsider when | DSH publishes an official settings icon field or customization service. |

## Decision: saved multi-location layout inside Settings Hub

| Field | Decision |
| --- | --- |
| Objective | Let users explicitly organize plugin and settings pages by icon, order and one or more visible locations, with understandable save/cancel behavior. |
| Rationale | DSH rc.2 exposes additive list slots but no public API for rewriting shipped or third-party navigation entries. |
| Chosen option | Provide an edit mode for plugin-owned home, multiple internal pages, one plugin-owned DSH Plugins Tab, a plugin-owned `shell.overlay` dock, favorites, icons and one shared order; persist only after an explicit save. |
| Benefit | The same entry can appear in several plugin-owned locations without risking original navigation or Profile state. |
| Cost | Settings Hub cannot hide, reorder or recolor another registrant's original entry. |
| Failure | Invalid or oversized stored state is discarded; deleting an internal page removes only that page assignment and preserves other locations. |
| Evidence | Unit tests cover explicit save, legacy migration, multi-location assignment, shared ordering, page removal, plugin Tab, overlay and bounded normalization. |
| Reconsider when | DSH publishes a supported settings-navigation customization service. |

## Decision: one plugin-owned Plugins Tab and overlay dock

| Field | Decision |
| --- | --- |
| Objective | Make configured shortcuts visible outside the Settings Hub section. |
| Rationale | rc.2 documents `settings.plugins.tab` as an additive page seat and `shell.overlay` as an additive, frame-wide click-through layer. |
| Chosen option | Register unique IDs `dsh-settings-hub-shortcuts` and `dsh-settings-hub-dock`; render only user-selected items, with the dock returning `null` when empty. |
| Benefit | DSH owns mounting and cleanup, and other slot occupants keep their identities. |
| Cost | The shortcut Tab remains present even when empty so users have an explicit recovery message; the floating dock appears only after configuration. |
| Failure | Missing target entries remain untouched and show a bounded open failure. |
| Evidence | Contract and UI tests assert unique registrations, empty dock behavior, icon propagation and user-triggered activation. |

## Permission matrix

| Action/data | Owner | Limit | Failure behavior | Test |
| --- | --- | --- | --- | --- |
| Read slot entry IDs, labels, order and registrant | Client | Current `settings.section` and `settings.plugins.tab` only | Empty list | Client fixture |
| Store custom pages, multi-location assignments, order, favorite IDs and icon choices | Client localStorage | 12 pages, 128 page assignments, 128 location assignments, 256 order IDs, 64 favorites, 128 icons, 32 KiB | Empty in-memory preferences and automatic grouping/icons | Save, migration, assignment, order, removal, malformed/oversized tests |
| Render line icons | Client React tree | 14 embedded SVG definitions, decorative only | Generic grid icon | Palette rendering test |
| Activate an existing settings control | Client/user click | Current modal, exact visible label | No click; status message | Exact-control activation test |
| Add shortcut surfaces | Client public slots | One unique section, one unique Plugins Tab, one unique overlay cell | DSH disposes plugin-owned entries | Registration and empty-dock tests |

## Non-goals

- No DSH core or official package changes.
- No shipped/third-party navigation hiding, movement, wrapping, cloning, replacement, or icon injection.
- No Profile settings persistence.
- No Host route, network, process, credentials, device, model Tool, restart, or background automation.
