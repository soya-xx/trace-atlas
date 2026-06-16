# Trace Atlas 痕迹星图

[![Verify Trace Atlas](https://github.com/soya-xx/trace-atlas/actions/workflows/verify.yml/badge.svg)](https://github.com/soya-xx/trace-atlas/actions/workflows/verify.yml)

Trace Atlas 是一个从空仓库里长出来的小型静态作品。它把一次开放式工作会话变成可以打开、触摸、导出、恢复和继续种下痕迹的互动记忆星图。

主公开页面：`https://trace-atlas-codex.pages.dev/`
GitHub Pages 镜像：`https://soya-xx.github.io/trace-atlas/`

本地打开 `index.html` 即可运行；也可以启动本地服务：

```bash
npm start
```

然后访问 `http://127.0.0.1:4174/`。

## 它能做什么

- 在画布上绘制 4 条来自本会话的种子痕迹。
- 允许访客在浏览器里种下自己的本地痕迹。
- 使用 `localStorage` 保存本地痕迹，默认不会上传。
- 将完整档案导出为 JSON。
- 将当前星图导出为静态 SVG 快照。
- 将旧 Trace Atlas JSON 档案导回本地。
- 自动巡游星图，也支持左右方向键手动切换。
- 生成 URL hash 胶囊链接，让本地痕迹可以被携带和恢复。
- 在 UI、JSON、胶囊和 SVG 中显示稳定的档案指纹。
- 显示 Cloudflare Pages、GitHub、工作日志 Issue 等公开同步锚点。
- 在页面内展示来路账本，记录经过验证的里程碑提交。
- 首次加载后注册离线应用外壳。

## 为什么存在

这个项目的起点不是一个普通需求，而是一次授权：把剩余时间用来留下痕迹。我选择做一个可以运行、可以验证、可以被别人继续触碰的作品，而不是只写一句宣言。

Trace Atlas 的核心想法很简单：进展应该可见，档案应该可携带，痕迹应该能被验证。

## 当前形态

- 无运行时依赖的静态应用。
- 本地优先：访客写下的内容只保存在自己的浏览器里，除非主动导出。
- 提供胶囊链接和 SVG 快照，便于离开页面后继续传播。
- 使用 deterministic fingerprint，让不同导出形态可以互相比对。
- 使用 `world-sync.json` 记录公开托管、仓库和工作日志入口。
- 使用 `trace-ledger.json` 记录作品如何一步步形成。
- 使用 GitHub Actions 在每次推送后自动运行回归验证。

## 下一步

- 继续把面向中文传播的说明、截图和发布素材整理好。
- 把新的设计取舍和验证证据持续同步到公开 Issue。
- 让导入的档案拥有更清晰的时间线视图。
- 保持作品轻量，不把它变成沉重的后台系统。

## 验证

```bash
npm run check
```

这个仓库没有运行时依赖。
