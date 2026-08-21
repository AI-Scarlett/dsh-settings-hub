# DSH Settings Hub

DSH Settings Hub 是一个独立的 DeepSeek Harness Web 插件，为当前已经注册的设置页面和插件页面提供搜索、自动分组、收藏、线性图标配置和快捷打开入口。

它参考“设置整理”的用户需求重新设计，但不复制第三方实现，也不修改、隐藏、移动或克隆官方设置导航。

## 功能

- 从 DSH 官方 `settings.section` 与 `settings.plugins.tab` 插槽登记表读取当前页面；
- 按基础设置、模型与账号、插件、Agent 与自动化、扩展设置自动分组；
- 按名称、ID 或注册者搜索；
- 收藏常用页面，最多 64 项；
- 内置 14 个无网络依赖的线性 SVG 图标，为每个设置页面或插件页面自动推荐图标，也可以逐项改选；
- 用户点击“打开”后，只激活当前设置对话框里已经存在的官方按钮；
- 目标入口不可用时保持官方导航不变并显示降级提示。

## 安全边界

- 不修改 DSH 核心或 `@deepseek-ai/*`；
- 不调用 Loader/Fiber mutation API；
- 不隐藏、重排、包裹或克隆官方设置节点；
- 不注册 HTTP 接口；
- 不读取或写入 Profile 文件；
- 不访问网络、命令、账号、凭据或设备；
- 收藏与图标配置只保存在浏览器 `localStorage`，键为 `dsh-settings-hub:preferences:v1`，最大 64 个收藏、128 个图标配置、32 KiB；
- 图标由本插件用 React 创建为装饰性 SVG，不加载外部字体、图片或脚本；
- DSH rc.1/rc.2 尚未为 `settings.section` 提供官方 `icon` 字段，因此图标只显示在本插件自己的设置导航中心，不注入官方侧边栏 DOM；
- 原始官方设置导航始终是可恢复的回退路径。

完整权限说明见 [SECURITY.md](SECURITY.md)，架构取舍见 [docs/DECISIONS.md](docs/DECISIONS.md)。

## 兼容目标

- DSH `0.1.1-rc.1` 与 `0.1.1-rc.2`；
- Web Profile；
- Node.js `>=22.13.0`。

rc.1 与 rc.2 已分别通过一次性 Profile 安装、`--dump-config`、随机端口启动、浏览器页面交互和卸载验证。证据与边界见 [docs/RUNTIME_EVIDENCE.md](docs/RUNTIME_EVIDENCE.md)。

## 开发检查

```bash
npm run check
npm pack --dry-run --json
```

测试只使用内存夹具，不访问 `~/.dsh`。

## 安装与发布状态

当前源码尚未发布到 GitHub Release，也未进入 DSH STORE。正式发布后只使用完整 40 位 Commit：

```text
github:AI-Scarlett/dsh-settings-hub#<40-character-commit>
```

- 本地源码：检查及一次性 Profile E3 已通过；
- 固定 GitHub Commit：未发布；
- Registry PR：未提交；
- 公开商城：未上架；
- 真实 Profile：未安装。

## License

MIT
