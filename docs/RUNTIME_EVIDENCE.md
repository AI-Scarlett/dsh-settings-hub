# Disposable runtime evidence

## 2026-08-22 theme and layout-editor source iteration

- Runtime identity: global official CLI reported `0.1.1-rc.2`.
- Isolation: a new `/tmp/dsh-settings-hub-theme-e3.*` home was created; the real DSH home and Profile were not read or changed.
- Release identity recheck: after setting the manifest to `dsh-settings-hub@0.2.0`, a fresh disposable home accepted the package through the official CLI, composed exactly one row, returned HTTP 200 after cold start, removed the package through the official CLI, and composed zero rows afterward.
- Install and composition: official `dsh plugin --profile web add <working-tree>` completed; `dsh --profile web --dump-config` contained exactly one `dsh-settings-hub` row.
- Startup: `dsh web --no-open --port 0` served the disposable Profile on loopback.
- Theme acceptance: the real DSH appearance control was switched between light and dark. Settings Hub computed primary/secondary text as `rgb(15, 17, 21)` / `rgb(97, 102, 107)` in light mode and `rgb(249, 250, 251)` / `rgb(207, 211, 214)` in dark mode; heading/body sizes were `22px` / `14px`.
- Editor acceptance: `编辑布局` created `常用插件`; `插件配置` was assigned to that Tab, changed to the built-in `shield` icon, favorited, and explicitly saved. Closing and reopening Settings preserved the Tab, assignment, icon, and favorite.
- Removal acceptance: assigning `插件配置` back to `Tab：默认分组` removed it from the custom Tab and showed the empty-Tab guidance.
- Browser error log: zero errors.
- Cleanup: the server stopped; official `dsh plugin --profile web remove dsh-settings-hub` completed; a fresh dump contained zero plugin rows; the disposable home was deleted.
- Scope: this is current E3 evidence for the `0.2.0` source prepared for repository release. It does not by itself prove a GitHub Commit, catalog update, public marketplace, or real Profile installation.

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
