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
- Prepared package version: `0.2.0`.
- Immutable public Commit: unavailable until the source release commit is published and read back from GitHub.
- General audit: rerun before the source release and again against its immutable public Commit.
- Marketplace candidate: intentionally deferred until the source release Commit exists; never pin an uncommitted future SHA.
- Disposable Profile E3: passed on DSH `0.1.1-rc.1` and `0.1.1-rc.2`; see `docs/RUNTIME_EVIDENCE.md`.
- Registry PR：未提交。
- Existing merged catalog identity: approved `0.1.0`; a source update does not by itself rewrite that Registry entry.
- Public marketplace: existing listing remains a separate readback surface.
- Real Profile: unchanged.

The prepared source and E3 evidence do not prove a GitHub release, Registry update, marketplace visibility, or Profile installation. A fixed-source candidate may be generated only after the public source Commit exists.
