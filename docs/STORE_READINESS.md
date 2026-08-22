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
- Prepared package version: `0.3.0`.
- Immutable public source Commit: pending; local source, static tests and working-tree evidence are not a public release.
- General audit: pending fixed-source and disposable runtime verification; no real Profile claim.
- Marketplace candidate: `marketplace/catalog-entry.draft.json` remains the previous fixed candidate until a public `0.3.0` Commit is available.
- Marketplace audit: `direct`, no blocker; Registry CI/merge and public marketplace refresh remain unverified.
- Disposable Profile E3: `0.2.1` passed on DSH `0.1.1-rc.1` and `0.1.1-rc.2`; `0.3.0` rc.2 verification pending; see `docs/RUNTIME_EVIDENCE.md`.
- Registry PR：未提交。
- Existing merged catalog identity remains a separate authority; a source update does not by itself rewrite that Registry entry.
- Public marketplace: existing listing remains a separate readback surface.
- Real Profile: unchanged.

The fixed source and draft candidate do not rewrite the Registry or prove refreshed marketplace visibility or Profile installation. The existing approved catalog identity remains unchanged until a separately authorized Registry workflow runs.
