# Disposable runtime evidence

## 2026-08-22 rc.1 compatibility revision

- Source identity: local `dsh-settings-hub@0.3.1`; this patch changes only the package version and three DSH Client peer lower bounds from rc.2 back to rc.1.
- Toolchain isolation: a disposable DSH `0.1.1-rc.1` toolchain pinned `dsh`, `dsh-web-app`, `dsh-client-modules`, `dsh-client-runtime`, `dsh-client-ui-slots`, `dsh-client-ui-settings`, and `dsh-cordis-client-runner` to rc.1.
- Contract recheck: the rc.1 public slot inventory contains `settings.section`, `settings.plugins.tab`, and `shell.overlay`, the exact three additive seats used by `0.3.x`.
- Profile acceptance: the rc.1 official CLI installed local `0.3.1` into a new disposable Web Profile, resolved version `0.3.1`, composed exactly one row, and cold-started on loopback.
- Browser acceptance: `设置中心` loaded; saving `模型` to the right-bottom location created one `展开设置快捷面板` launcher; the DSH Plugins section exposed one `设置快捷方式` Tab; browser error log contained zero errors.
- Cleanup: official rc.1 CLI removal succeeded, a fresh dump contained zero rows, and the disposable toolchain/Profile were moved to Trash for recoverability.
- Scope: this is local rc.1 E3 evidence. The `0.3.1` GitHub Commit/tag/CI, fixed-GitHub install and marketplace publication remain separate gates.

## 2026-08-22 multi-location layout source iteration

- Runtime identity: global official CLI reported `0.1.1-rc.2`.
- Source identity: clean local Commit `ee9bfd5c1fa9d8f18e4658a4501b8975cb9bf95f`, package `dsh-settings-hub@0.3.0`; public GitHub readback was not yet performed at this gate.
- Isolation: a new `/tmp/dsh-settings-hub-v030-e3.*` DSH home was created; the real DSH home and Profile were not read or changed.
- Install and composition: official `dsh plugin --profile web add <clean-worktree>` completed; `dsh --profile web --dump-config` contained exactly one `dsh-settings-hub` row.
- Startup: `dsh web --no-open --port 0` served the disposable Web Profile on loopback and the browser loaded the app successfully.
- Editor acceptance: `模型` changed to the built-in `shield` icon with immediate preview, moved to the first position, and was assigned simultaneously to the Settings Hub home, a new `常用插件` internal page, the plugin-owned DSH Plugins Tab, and the right-bottom dock.
- Saved-view acceptance: after explicit save, the home reflected the new order/icon; the `常用插件` page contained only `模型`; the DSH Plugins section exposed `设置快捷方式` with `模型`; the frame exposed `展开设置快捷面板` and its panel contained `模型` plus the recovery link back to Settings Hub.
- Persistence acceptance: after a full page reload, the right-bottom launcher reappeared from validated browser storage.
- Browser error log: zero errors.
- Cleanup: the server stopped; official `dsh plugin --profile web remove dsh-settings-hub` completed; a fresh dump contained zero plugin rows; the disposable home was moved to the user's Trash for recoverability.
- Scope: local E3 is current for `0.3.0`. Fixed GitHub source, tag/CI, Registry update, public marketplace refresh, and real Profile installation remain separate gates.

### Fixed public source follow-up

- GitHub PR `#1` merged as `5ca01345b3570fa23381eec032d439b0eef73679`; tag `v0.3.0` peels to that Commit.
- The public `package.json`, `cordis.patch.yml`, and `lib/client.js` SHA-256 values matched the merged local Commit exactly.
- Main-branch CI run `32580676738` passed on Ubuntu, macOS, and Windows.
- A new disposable rc.2 Web Profile installed the exact GitHub source and resolved `dsh-settings-hub@0.3.0` with one composed row.
- A second disposable rc.2 Web Profile installed fixed `0.2.1`, upgraded through the official CLI to fixed `0.3.0`, retained one composed row, cold-started with HTTP 200, and served a Client SHA-256 matching the public source.
- Both fixed-source Profiles were removed with the official CLI, fresh dumps contained zero rows, and the temporary homes were moved to Trash for recoverability.
- Registry/catalog merge, public marketplace version visibility, and real Profile installation remained unverified at this source gate.

## 2026-08-22 theme and layout-editor source iteration

- Runtime identity: global official CLI reported `0.1.1-rc.2`.
- Isolation: a new `/tmp/dsh-settings-hub-theme-e3.*` home was created; the real DSH home and Profile were not read or changed.
- Release identity recheck: after setting the manifest to `dsh-settings-hub@0.2.1`, a fresh disposable home accepted the package through the official CLI, composed exactly one row, returned HTTP 200 after cold start, removed the package through the official CLI, and composed zero rows afterward.
- Install and composition: official `dsh plugin --profile web add <working-tree>` completed; `dsh --profile web --dump-config` contained exactly one `dsh-settings-hub` row.
- Startup: `dsh web --no-open --port 0` served the disposable Profile on loopback.
- Theme acceptance: the real DSH appearance control was switched between light and dark. Settings Hub computed primary/secondary text as `rgb(15, 17, 21)` / `rgb(97, 102, 107)` in light mode and `rgb(249, 250, 251)` / `rgb(207, 211, 214)` in dark mode; heading/body sizes were `22px` / `14px`.
- Editor acceptance: `编辑布局` created `常用插件`; `插件配置` was assigned to that Tab, changed to the built-in `shield` icon, favorited, and explicitly saved. Closing and reopening Settings preserved the Tab, assignment, icon, and favorite.
- Removal acceptance: assigning `插件配置` back to `Tab：默认分组` removed it from the custom Tab and showed the empty-Tab guidance.
- Browser error log: zero errors.
- Cleanup: the server stopped; official `dsh plugin --profile web remove dsh-settings-hub` completed; a fresh dump contained zero plugin rows; the disposable home was deleted.
- Public source readback: GitHub Commit `a91a65e939ca2435f1973eb17f8f33f1ee8a737d` exposed `dsh-settings-hub@0.2.1`; its public Bundle Patch and Client SHA-256 values matched the local Commit exactly, and GitHub CI passed on Ubuntu, macOS, and Windows.
- Fixed-GitHub install recheck: a second fresh disposable home installed the exact source `github:AI-Scarlett/dsh-settings-hub#a91a65e939ca2435f1973eb17f8f33f1ee8a737d` through the official CLI, composed one row, cold-started with HTTP 200, removed cleanly, and composed zero rows afterward.
- Fixed-GitHub upgrade recheck: another disposable Profile first installed the catalog-era `0.1.0` Commit and then ran official CLI `add` with the `0.2.1` fixed source; the resolved package version became `0.2.1`, one row composed, cold start returned HTTP 200, and uninstall left zero rows.
- Scope: E3 and fixed GitHub source are current for `0.2.1`. Registry update, refreshed marketplace page, and real Profile installation remain separate gates.

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
