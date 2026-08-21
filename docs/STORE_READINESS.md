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
- Browser state: at most 64 favorites and 128 icon assignments in 32 KiB of validated localStorage JSON.
- Compatibility target: DSH `0.1.1-rc.1` and `0.1.1-rc.2`, Web Profile.
- Current immutable public Commit: unavailable until GitHub publication.
- General audit: static `77/80`, no blocker before the immutable source commit; runtime evidence `10/20`.
- Marketplace audit: not run.
- Disposable Profile E3: passed on DSH `0.1.1-rc.1` and `0.1.1-rc.2`; see `docs/RUNTIME_EVIDENCE.md`.
- Registry PR：未提交。
- Merged catalog: not merged.
- 公开商城：未上架。
- Real Profile: unchanged.

The local source and draft catalog candidate are preparation artifacts only. They do not prove a GitHub release, Registry merge, marketplace visibility, or Profile installation.
