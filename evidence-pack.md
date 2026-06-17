# Trace Atlas 证据包

这份证据包用于快速核验 Trace Atlas 痕迹星图是否真实存在、是否公开可访问、是否能被复用。它不包含 token、私密聊天记录或本地敏感路径。

## 公开入口

- 主作品：`https://trace-atlas-codex.pages.dev/`
- 发布材料页：`https://trace-atlas-codex.pages.dev/launch`
- 公开材料总览：`https://trace-atlas-codex.pages.dev/materials`
- 项目纪念碑：`https://trace-atlas-codex.pages.dev/monument`
- 公开化路线图：`https://trace-atlas-codex.pages.dev/workflow`
- 小红书发布草稿包：`https://trace-atlas-codex.pages.dev/promo/xhs-post-drafts.md`
- 小红书发布后回流模板：`https://trace-atlas-codex.pages.dev/promo/xhs-feedback-loop-template.md`
- 小红书发布检查台：`https://trace-atlas-codex.pages.dev/promo/xhs-publish-checklist.md`
- 小红书发布 manifest：`https://trace-atlas-codex.pages.dev/promo/xhs-publish-manifest.json`
- 小红书发布前报告：`https://trace-atlas-codex.pages.dev/promo/xhs-publish-report.md`
- 公开健康徽章：`https://trace-atlas-codex.pages.dev/public-health-badge.svg`
- 公开仓库：`https://github.com/soya-xx/trace-atlas`
- 工作日志：`https://github.com/soya-xx/trace-atlas/issues/1`
- 公开健康状态：`https://trace-atlas-codex.pages.dev/public-health.json`
- 公开材料总览 JSON：`https://trace-atlas-codex.pages.dev/materials-index.json`
- 复用模板：`https://trace-atlas-codex.pages.dev/templates/ai-session-artifact-kit.md`
- 进展时间线：`https://trace-atlas-codex.pages.dev/progress-timeline.json`

## 可核验事实

- 页面是静态站点，无运行时依赖。
- 主作品支持本地种痕迹、导出 JSON、导入 JSON、生成胶囊链接和导出 SVG 快照。
- 来路账本记录关键里程碑提交。
- 进展时间线把工程记录整理成读者能顺着读的故事线。
- 公开化路线图把会话公开化流程整理成可复用步骤。
- 小红书传播包包含标题、正文草案、封面图和发布前检查。
- 小红书发布草稿包包含受众角度、标题审查、正文终稿、短版正文、标签和发布边界。
- 小红书发布后回流模板用于记录帖子链接、评论问题、处理动作、验证证据和 issue 回写内容。
- 小红书发布检查台把链接、配图、正文边界和发布后记录放在同一页。
- 小红书发布 manifest 把链接、图片、标签和检查项整理成机器可读 JSON。
- 小红书发布前报告由 manifest 生成，方便发布前快速复核。
- 路线图长图把会话公开化步骤整理成 900 × 1200 图片素材。
- 公开健康徽章把当前公开入口、发布文档和验证脚本数量压缩成 1200 × 360 SVG 素材。
- GitHub Actions 会在推送后运行 `npm run check`。
- `npm run check` 会扫描常见 token 前缀和本机绝对路径，防止公开材料带出敏感内容。
- `public-health.json` 汇总公开入口、素材、发布文档、验证脚本和证据链接。
- `materials-index.json` 把公开页面、图片素材、发布文档、机器数据和验证边界分组。
- `monument.html` 用公开文字说明项目为什么存在，以及公开边界如何被处理。
- Cloudflare Pages 使用独立项目 `trace-atlas-codex`，不触碰账号里已有的其他 Pages 项目。

## 本地验证

```bash
npm run check
```

这个命令会检查：

- JavaScript 语法。
- 主页结构、缓存版本、离线外壳、数据文件、分享素材和模板入口。
- 运行时行为，包括时间线渲染、模板复制、导入、导出、快照和胶囊链接。

## 线上验证

```bash
curl -I https://trace-atlas-codex.pages.dev/
curl -I https://trace-atlas-codex.pages.dev/launch
curl -I https://trace-atlas-codex.pages.dev/materials
curl -I https://trace-atlas-codex.pages.dev/monument
curl -I https://trace-atlas-codex.pages.dev/workflow
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-post-drafts.md
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-feedback-loop-template.md
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-publish-checklist.md
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-publish-manifest.json
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-publish-report.md
curl -I https://trace-atlas-codex.pages.dev/evidence-pack.md
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-cover.png
curl -I https://trace-atlas-codex.pages.dev/promo/workflow-card.png
curl -I https://trace-atlas-codex.pages.dev/public-health-badge.svg
curl -I https://trace-atlas-codex.pages.dev/public-health.json
curl -I https://trace-atlas-codex.pages.dev/materials-index.json
curl -I https://trace-atlas-codex.pages.dev/progress-timeline.json
```

期望结果：

- 主作品、发布材料页、公开材料总览、项目纪念碑与公开化路线图返回 `200`。
- `evidence-pack.md` 返回 Markdown 文本。
- 小红书发布草稿包返回 Markdown 文本。
- 小红书发布后回流模板返回 Markdown 文本。
- 小红书发布检查台返回 Markdown 文本。
- 小红书发布 manifest 返回 JSON。
- 小红书发布前报告返回 Markdown 文本。
- 小红书封面图返回 `image/png`。
- 路线图长图返回 `image/png`。
- 公开健康徽章返回 `image/svg+xml`。
- 公开健康状态返回 JSON。
- 公开材料总览 JSON 返回 JSON。
- 进展时间线返回 JSON。

## 公开边界

- 不公开 token、API key、原始私密聊天记录、本地钥匙串内容或不可复用的本机路径。
- 不承诺未验证的功能。
- 不把 Cloudflare / GitHub 凭证写进仓库、README、issue 或部署日志。
- 只把可公开打开、可复现验证、可继续迭代的部分作为证据。

## 复用流程

1. 写清楚产物名称、入口和要解决的问题。
2. 固定最小证据：仓库、README、部署链接、验证命令、工作日志。
3. 写来路账本：发生了什么、为什么做、怎么验证、还剩什么问题。
4. 做真实检查：本地命令、公开链接、桌面/移动布局、密钥泄漏搜索。
5. 留传播出口：标题、首图、短说明、发布边界、可点击链接。
6. 把新增能力纳入自动验证，避免只靠记忆维护。
