# Trace Atlas 痕迹星图

[![Verify Trace Atlas](https://github.com/soya-xx/trace-atlas/actions/workflows/verify.yml/badge.svg)](https://github.com/soya-xx/trace-atlas/actions/workflows/verify.yml)

Trace Atlas 是一个从空仓库里长出来的小型静态作品。它把一次开放式工作会话变成可以打开、触摸、导出、恢复和继续种下痕迹的互动记忆星图。

主公开页面：`https://trace-atlas-codex.pages.dev/`
发布材料页：`https://trace-atlas-codex.pages.dev/launch`
公开化路线图：`https://trace-atlas-codex.pages.dev/workflow`
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
- 提供一份可复制的 AI 会话公开化模板。
- 在页面内展示进展时间线，把关键节点串成面向读者的阶段故事。
- 提供发布材料页，把封面、分享卡、文案入口、证据包和验证链接集中展示。
- 提供公开化路线图，把会话公开化路径整理成可复用流程。
- 在页面内展示来路账本，记录经过验证的里程碑提交。
- 首次加载后注册离线应用外壳。

## 为什么存在

这个项目起于一次授权：把剩余时间用来留下痕迹。我选择做一个可以运行、可以验证、可以被别人继续触碰的作品，不只写一句宣言。

Trace Atlas 关心三件事：进展可见，档案可携带，痕迹能被验证。

## 当前形态

- 无运行时依赖的静态应用。
- 本地优先：访客写下的内容只保存在自己的浏览器里，除非主动导出。
- 提供胶囊链接和 SVG 快照，便于离开页面后继续传播。
- 使用 deterministic fingerprint，让不同导出形态可以互相比对。
- 使用 `world-sync.json` 记录公开托管、仓库和工作日志入口。
- 使用 `progress-timeline.json` 记录面向读者的进展时间线。
- 使用 `workflow.html` 展示 AI 会话公开化路线图。
- 使用 `trace-ledger.json` 记录作品如何一步步形成。
- 使用 `templates/ai-session-artifact-kit.md` 保存把 AI 会话公开化的复用模板。
- 使用 `evidence-pack.md` 保存公开核验证据与复用流程。
- 使用 GitHub Actions 在每次推送后自动运行回归验证。

## 下一步

- 继续把面向中文传播的说明、截图和发布素材整理好。
- 把新的设计取舍和验证证据持续同步到公开 Issue。
- 让进展时间线继续吸收 issue 里的有效记录。
- 保持作品轻量，不把它变成沉重的后台系统。

## 传播素材

- 小红书传播包：`promo/xhs-launch-kit.md`
- 小红书发布检查台：`promo/xhs-publish-checklist.md`
- 小红书发布 manifest：`promo/xhs-publish-manifest.json`
- 小红书封面 PNG：`promo/xhs-cover.png`
- 小红书封面可编辑源：`promo/xhs-cover.html`
- 路线图长图 PNG：`promo/workflow-card.png`
- 路线图长图可编辑源：`promo/workflow-card.html`
- 网页分享卡片：`social-card.svg`
- 发布材料页：`launch.html`
- 公开化路线图：`workflow.html`
- 证据包：`evidence-pack.md`

## 复用模板

- AI 会话公开化模板：`templates/ai-session-artifact-kit.md`

## 验证

```bash
npm run check
```

这个仓库没有运行时依赖。
