# DSH Settings Hub

DSH Settings Hub 是一个独立的 DeepSeek Harness Web 插件，为当前已经注册的设置页面和插件页面提供搜索、自动分组、自定义内页、统一排序、收藏、线性图标配置、插件页快捷 Tab 和右下角快捷面板。

它参考“设置整理”的用户需求重新设计，但不复制第三方实现，也不修改、隐藏、移动或克隆其他插件已有的官方设置入口。

## 功能

- 从 DSH 官方 `settings.section` 与 `settings.plugins.tab` 插槽登记表读取当前页面；
- 按基础设置、模型与账号、插件、Agent 与自动化、扩展设置自动分组；
- 按名称、ID 或注册者搜索；
- 通过明确的“编辑布局 → 保存/取消”流程管理配置；图标和排序修改在草稿中即时预览；
- 新增、重命名、排序或删除最多 12 个 Settings Hub 自定义内页；
- 每个条目可同时出现在设置中心首页、一个或多个自定义内页、DSH 插件页的“设置快捷方式”Tab 和右下角快捷面板；
- 使用上移/下移按钮调整条目统一顺序，该顺序同步用于首页、内页、快捷 Tab 和右下角；
- 收藏常用页面，最多 64 项；
- 内置 14 个无网络依赖的线性 SVG 图标，为每个设置页面或插件页面自动推荐图标，也可以在编辑态逐项改选；保存后同一图标同步显示在所有插件自有入口；
- 用户点击“打开”后，只激活当前设置对话框里已经存在的官方按钮；
- 右下角快捷面板使用 DSH `shell.overlay` 官方增量插槽，未配置任何右下角条目时不显示；
- 目标入口不可用时保持官方导航不变并显示降级提示。

## 安全边界

- 不修改 DSH 核心或 `@deepseek-ai/*`；
- 不调用 Loader/Fiber mutation API；
- 不隐藏、重排、包裹或克隆其他插件已有的官方设置节点；
- 不注册 HTTP 接口；
- 不读取或写入 Profile 文件；
- 不访问网络、命令、账号、凭据或设备；
- 自定义内页、项目归属、显示位置、统一排序、收藏与图标配置只在用户点击“保存”后写入浏览器 `localStorage`，键仍为 `dsh-settings-hub:preferences:v1`，并自动兼容 `0.2.x` 单内页归属数据；最大 12 个内页、128 个内页归属、128 个位置归属、256 个排序项、64 个收藏、128 个图标配置、32 KiB；
- 图标由本插件用 React 创建为装饰性 SVG，不加载外部字体、图片或脚本；
- DSH rc.2 尚未为 `settings.section` 提供官方图标或导航编辑字段，因此自定义图标只显示在本插件自己的首页、内页、插件页快捷 Tab 与右下角面板，不注入官方侧边栏 DOM；
- 本插件只通过公开 `settings.section`、`settings.plugins.tab` 和 `shell.overlay` 插槽添加自己的三个入口；卸载时由 DSH 插槽生命周期清理；
- 原始官方设置导航始终是可恢复的回退路径。

完整权限说明见 [SECURITY.md](SECURITY.md)，架构取舍见 [docs/DECISIONS.md](docs/DECISIONS.md)。

## 兼容目标

- DSH `0.1.1-rc.1` 与 `0.1.1-rc.2`；
- Web Profile；
- Node.js `>=22.13.0`。

`0.2.1` 已在 rc.1 与 rc.2 通过一次性 Profile 验证；`0.3.0` 的 rc.2 验证将在发布前更新到 [docs/RUNTIME_EVIDENCE.md](docs/RUNTIME_EVIDENCE.md)。

## 开发检查

```bash
npm run check
npm pack --dry-run --json
```

测试只使用内存夹具，不访问 `~/.dsh`。

## 安装与发布状态

准备发布版本为 `0.3.0`。发布完成后应通过 DSH STORE 或固定 `v0.3.0` 对应的完整 40 位 Commit 安装；在固定 Commit 尚未写入本节前，不应把工作树测试当成公开发布：

```text
github:AI-Scarlett/dsh-settings-hub#<v0.3.0-full-commit>
```

- `0.3.0` 本地源码：功能和契约测试进行中；
- GitHub 固定源码与标签：尚未发布；
- DSH STORE：当前公开目录仍可能显示旧版本；目录合并和公开页面回读属于独立发布门；
- 真实 Profile：未安装。

## License

MIT
