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
- Browser state: at most 12 custom tabs, 128 tab assignments, 64 favorites, and 128 icon assignments in 32 KiB of validated localStorage JSON; writes occur only after explicit save.
- Compatibility target: DSH `0.1.1-rc.1` and `0.1.1-rc.2`, Web Profile.
- Prepared package version: `0.2.1`.
- Immutable public source Commit: `a91a65e939ca2435f1973eb17f8f33f1ee8a737d`; public manifest, Bundle Patch, Client, three-platform CI, and a disposable official-CLI GitHub install/start/uninstall were verified.
- General audit: static `80/80`, runtime/public-source evidence `14/20`, total `94/100`, no blocker; this score does not prove a real Profile.
- Marketplace candidate: `marketplace/catalog-entry.draft.json`, pinned to the immutable public source Commit.
- Marketplace audit: `direct`, no blocker; Registry CI/merge and public marketplace refresh remain unverified.
- Disposable Profile E3: passed on DSH `0.1.1-rc.1` and `0.1.1-rc.2`; see `docs/RUNTIME_EVIDENCE.md`.
- Registry PR：未提交。
- Existing merged catalog identity: approved `0.1.0`; a source update does not by itself rewrite that Registry entry.
- Public marketplace: existing listing remains a separate readback surface.
- Real Profile: unchanged.

The fixed source and draft candidate do not rewrite the Registry or prove refreshed marketplace visibility or Profile installation. The existing approved catalog identity remains unchanged until a separately authorized Registry workflow runs.
