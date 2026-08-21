# Disposable runtime evidence

Observed on 2026-08-21 in two new `/tmp` homes. No command used the real DSH
home, no API key was entered, telemetry was disabled, and both temporary Web
profiles were removed from service after verification.

## DSH 0.1.1-rc.2

- Runtime identity: global official CLI reported `0.1.1-rc.2`.
- Install: official `dsh plugin --profile web add <plugin-root>` completed.
- Composition: `dsh --profile web --dump-config` contained exactly one
  `dsh-settings-hub` row.
- Startup: `dsh web --no-open --port 0` served the disposable Profile.
- Browser acceptance: Settings exposed `设置中心`; the hub rendered the
  registered settings and plugin-tab ledgers, 14 icon choices per entry, and
  11 current line-SVG instances.
- Interaction: the Models entry accepted `shield`, retained the selection when
  the hub was reopened, and quick-open activated the existing Models page.
- Browser error log: zero errors.
- Uninstall: official `dsh plugin --profile web remove dsh-settings-hub`
  completed and a fresh dump no longer contained the row.

## DSH 0.1.1-rc.1

- Runtime identity: official CLI package reported `0.1.1-rc.1`.
- Exact compatibility surface: `dsh-client-modules`, `dsh-client-runtime`,
  `dsh-client-ui-slots`, `dsh-client-ui-settings`, `dsh-cordis-client-runner`,
  and `dsh-web-app` were each pinned to `0.1.1-rc.1`.
- Upstream note: other transitive packages followed the official rc.1
  package's compatible caret ranges and may resolve to later prereleases.
- Install, composition, random-port startup, browser loading, and official-CLI
  uninstall all completed in the disposable Profile.
- Browser acceptance: the hub rendered the same five groups, 14 icon choices,
  and 11 current line-SVG instances; General accepted `palette`; quick-open
  activated the existing General settings content; browser error log was zero.
- A fresh dump after uninstall no longer contained `dsh-settings-hub`.

## Evidence boundary

This is E3 disposable evidence for the tested package tree. It does not prove a
GitHub release, Registry CI, public catalog listing, public marketplace
visibility, or installation in a real Profile. Those gates remain unchanged.
