# DSH STORE readiness

- Intended route: `direct`.
- Intended catalog ID/package/entry ID: `dsh-settings-hub`.
- Intended display name: `DSH 设置导航中心`.
- Intended categories: `ui`, `management`.
- Intended status: `approved` after fixed-source and E3 verification.
- Intended update policy: `source-verified` while permissions remain files/network/commands/credentials `none` and lifecycle scripts remain empty.
- Manifest path: `package.json`.
- Install path: repository root.
- License: MIT.
- Lifecycle scripts: none.
- External dependencies: none beyond declared DSH Client peer packages and React.
- Icon assets: 14 embedded line SVG definitions; no remote fonts, images, stylesheets, or scripts.
- Browser state: at most 12 custom pages, 128 page assignments, 128 location assignments, 256 order IDs, 64 favorites, and 128 icon assignments in 32 KiB of validated localStorage JSON; writes occur only after explicit save.
- Additive public seats: unique plugin-owned `settings.section`, `settings.plugins.tab`, and `shell.overlay` entries; no replacement of shipped or third-party cells.
- Compatibility target: DSH `0.1.1-rc.1` and `0.1.1-rc.2`, Web Profile.
- Prepared package version: `0.3.1`.
- Immutable public source Commit: `8f46230e26eafc8c8cd2c19528056e2fed8ee2b6`; tag `v0.3.1`, public manifest/Bundle Patch/Client hashes, three-platform CI, fixed-source rc.2 fresh install/HTTP 200/uninstall and local exact-rc.1 E3 were verified.
- General audit: static `80/80`; local rc.1/rc.2 browser E3 and fixed-GitHub `0.3.1` rc.2 install/start/uninstall passed; no real Profile claim is made.
- Marketplace candidate: `marketplace/catalog-entry.draft.json`, pinned to the immutable `0.3.1` public source Commit.
- Marketplace audit: `direct`, no blocker; Registry CI/merge and public marketplace refresh remain unverified.
- Disposable Profile E3: the functional Client passed on DSH `0.1.1-rc.2` for install/composition/start, icon preview/save, shared order, internal page, Plugins Tab, right-bottom overlay, reload persistence, zero browser errors and uninstall; local `0.3.1` additionally passed exact rc.1 install/start, Settings Hub, Plugins Tab, overlay launcher, zero browser errors and uninstall; see `docs/RUNTIME_EVIDENCE.md`.
- Registry PR：未提交。
- Existing merged catalog identity remains a separate authority; a source update does not by itself rewrite that Registry entry.
- Public marketplace: existing listing remains a separate readback surface.
- Real Profile: unchanged.

The fixed source and draft candidate do not rewrite the Registry or prove refreshed marketplace visibility or Profile installation. The existing approved catalog identity remains unchanged until a separately authorized Registry workflow runs.
