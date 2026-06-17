# Trace Atlas 证据包

这份证据包用于快速核验 Trace Atlas 痕迹星图是否真实存在、是否公开可访问、是否能被复用。它不包含 token、私密聊天记录或本地敏感路径。

## 公开入口

- 主作品：`https://trace-atlas-codex.pages.dev/`
- 开始复用入口：`https://trace-atlas-codex.pages.dev/start`
- 复用路线页：`https://trace-atlas-codex.pages.dev/reuse`
- 发布材料页：`https://trace-atlas-codex.pages.dev/launch`
- 公开材料总览：`https://trace-atlas-codex.pages.dev/materials`
- 材料选择器：`https://trace-atlas-codex.pages.dev/materials-guide`
- 发布前自检：`https://trace-atlas-codex.pages.dev/preflight`
- 材料 API：`https://trace-atlas-codex.pages.dev/materials-api.json`
- 材料行动包：`https://trace-atlas-codex.pages.dev/materials-packs.json`
- 阅读了解行动包：`https://trace-atlas-codex.pages.dev/pack-read`
- 发帖发布行动包：`https://trace-atlas-codex.pages.dev/pack-publish`
- 复用接力行动包：`https://trace-atlas-codex.pages.dev/pack-reuse`
- 验证维护行动包：`https://trace-atlas-codex.pages.dev/pack-verify`
- 项目纪念碑：`https://trace-atlas-codex.pages.dev/monument`
- 公开化路线图：`https://trace-atlas-codex.pages.dev/workflow`
- 验证摘要：`https://trace-atlas-codex.pages.dev/verification-summary.md`
- 进展时间线源数据：`https://trace-atlas-codex.pages.dev/progress-timeline-source.json`
- 小红书发布草稿包：`https://trace-atlas-codex.pages.dev/promo/xhs-post-drafts.md`
- 小红书发布后回流模板：`https://trace-atlas-codex.pages.dev/promo/xhs-feedback-loop-template.md`
- 小红书发布检查台：`https://trace-atlas-codex.pages.dev/promo/xhs-publish-checklist.md`
- 小红书发布 manifest：`https://trace-atlas-codex.pages.dev/promo/xhs-publish-manifest.json`
- 小红书发布前报告：`https://trace-atlas-codex.pages.dev/promo/xhs-publish-report.md`
- 复用流程图：`https://trace-atlas-codex.pages.dev/promo/reuse-flow-card.png`
- 公开健康徽章：`https://trace-atlas-codex.pages.dev/public-health-badge.svg`
- 行动包分享卡：`https://trace-atlas-codex.pages.dev/promo/pack-publish-card.svg`
- 公开仓库：`https://github.com/soya-xx/trace-atlas`
- 工作日志：`https://github.com/soya-xx/trace-atlas/issues/1`
- 公开健康状态：`https://trace-atlas-codex.pages.dev/public-health.json`
- 公开材料总览 JSON：`https://trace-atlas-codex.pages.dev/materials-index.json`
- 复用链路 JSON：`https://trace-atlas-codex.pages.dev/reuse-map.json`
- 复用模板：`https://trace-atlas-codex.pages.dev/templates/ai-session-artifact-kit.md`
- 公开化快速清单：`https://trace-atlas-codex.pages.dev/templates/ai-session-public-quickstart.md`
- 进展时间线：`https://trace-atlas-codex.pages.dev/progress-timeline.json`

## 可核验事实

- 页面是静态站点，无运行时依赖。
- 主作品支持本地种痕迹、导出 JSON、导入 JSON、生成胶囊链接和导出 SVG 快照。
- 来路账本记录关键里程碑提交。
- 进展时间线把工程记录整理成读者能顺着读的故事线。
- 进展时间线源数据由 `scripts/build-progress-timeline.mjs` 生成正式时间线，阶段号不再手工维护。
- 公开化路线图把会话公开化流程整理成可复用步骤。
- 开始复用入口把快速清单、完整模板、证据包、公开健康和回流模板放到同一个行动页。
- 小红书传播包包含标题、正文草案、封面图和发布前检查。
- 小红书发布草稿包包含受众角度、标题审查、正文终稿、短版正文、标签和发布边界。
- 小红书发布后回流模板用于记录帖子链接、评论问题、处理动作、验证证据和 issue 回写内容。
- 小红书发布检查台把链接、配图、正文边界和发布后记录放在同一页。
- 公开化快速清单把 AI 会话公开化流程压缩成 6 步，方便读者直接照着收尾。
- 小红书发布 manifest 把链接、图片、标签和检查项整理成机器可读 JSON。
- 小红书发布前报告由 manifest 生成，方便发布前快速复核。
- 路线图长图把会话公开化步骤整理成 900 × 1200 图片素材。
- 公开健康徽章把当前公开入口、发布文档和验证脚本数量压缩成 1200 × 360 SVG 素材。
- GitHub Actions 会在推送后运行 `npm run check`。
- `npm run check` 会扫描常见 token 前缀和本机绝对路径，防止公开材料带出敏感内容。
- `public-health.json` 汇总公开入口、素材、发布文档、验证脚本和证据链接。
- `materials-index.json` 把公开页面、图片素材、发布文档、机器数据和验证边界分组。
- `materials-api.json` 由材料索引生成，按用途、格式和受众提供扁平材料列表。
- `scripts/build-materials-api.mjs` 负责生成并检查材料 API。
- `materials-packs.json` 由材料 API 生成，提供可复制的阅读、发布、复用和验证行动包。
- `scripts/build-materials-packs.mjs` 负责生成并检查材料行动包。
- `materials-guide.html` 从材料 API 读取条目，按阅读、发布、复用和验证筛选材料。
- `pack-read.html`、`pack-publish.html`、`pack-reuse.html` 和 `pack-verify.html` 由行动包 JSON 生成，提供可单独分享的任务入口。
- `scripts/build-pack-pages.mjs` 负责生成并检查行动包页面和分享卡。
- `preflight.html` 和 `preflight.js` 会读取公开同源材料，生成发布前自检结果和可复制证据文本。
- 自检页里的发布记录模板只在浏览器本地生成，方便记录帖子链接、发布时间、评论回流和下一步动作。
- `reuse-map.json` 把开始复用、快速清单、完整模板、证据包、健康状态和回流模板整理成机器可读链路。
- `reuse.html` 和 `promo/reuse-flow-card.png` 把同一条链路翻译成读者能扫读的页面和传播配图。
- `verification-summary.md` 由公开 JSON 生成，方便快速复制到 issue 或交给读者复核。
- `scripts/build-verification-summary.mjs` 负责生成并检查验证摘要。
- `progress-timeline-source.json` 和 `scripts/build-progress-timeline.mjs` 负责生成并检查进展时间线。
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
- 材料 API 是否由材料索引重新生成。
- 材料行动包是否由材料 API 重新生成。
- 行动包页面和分享卡是否由行动包 JSON 重新生成。
- 发布前自检页是否能检查公开材料并生成报告。
- 进展时间线是否由源数据重新生成。
- 验证摘要是否与公开 JSON 保持一致。

## 线上验证

```bash
curl -I https://trace-atlas-codex.pages.dev/
curl -I https://trace-atlas-codex.pages.dev/start
curl -I https://trace-atlas-codex.pages.dev/reuse
curl -I https://trace-atlas-codex.pages.dev/launch
curl -I https://trace-atlas-codex.pages.dev/materials
curl -I https://trace-atlas-codex.pages.dev/materials-guide
curl -I https://trace-atlas-codex.pages.dev/preflight
curl -I https://trace-atlas-codex.pages.dev/monument
curl -I https://trace-atlas-codex.pages.dev/workflow
curl -I https://trace-atlas-codex.pages.dev/verification-summary.md
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-post-drafts.md
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-feedback-loop-template.md
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-publish-checklist.md
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-publish-manifest.json
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-publish-report.md
curl -I https://trace-atlas-codex.pages.dev/evidence-pack.md
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-cover.png
curl -I https://trace-atlas-codex.pages.dev/promo/workflow-card.png
curl -I https://trace-atlas-codex.pages.dev/promo/reuse-flow-card.png
curl -I https://trace-atlas-codex.pages.dev/public-health-badge.svg
curl -I https://trace-atlas-codex.pages.dev/public-health.json
curl -I https://trace-atlas-codex.pages.dev/materials-index.json
curl -I https://trace-atlas-codex.pages.dev/materials-api.json
curl -I https://trace-atlas-codex.pages.dev/materials-packs.json
curl -I https://trace-atlas-codex.pages.dev/pack-read
curl -I https://trace-atlas-codex.pages.dev/pack-publish
curl -I https://trace-atlas-codex.pages.dev/pack-reuse
curl -I https://trace-atlas-codex.pages.dev/pack-verify
curl -I https://trace-atlas-codex.pages.dev/promo/pack-publish-card.svg
curl -I https://trace-atlas-codex.pages.dev/reuse-map.json
curl -I https://trace-atlas-codex.pages.dev/templates/ai-session-public-quickstart.md
curl -I https://trace-atlas-codex.pages.dev/progress-timeline.json
curl -I https://trace-atlas-codex.pages.dev/progress-timeline-source.json
```

期望结果：

- 主作品、开始复用入口、复用路线页、发布材料页、公开材料总览、材料选择器、项目纪念碑与公开化路线图返回 `200`。
- 发布前自检页返回 `200`。
- `evidence-pack.md` 返回 Markdown 文本。
- `verification-summary.md` 返回 Markdown 文本。
- 小红书发布草稿包返回 Markdown 文本。
- 小红书发布后回流模板返回 Markdown 文本。
- 小红书发布检查台返回 Markdown 文本。
- 小红书发布 manifest 返回 JSON。
- 小红书发布前报告返回 Markdown 文本。
- 小红书封面图返回 `image/png`。
- 路线图长图返回 `image/png`。
- 复用流程图返回 `image/png`。
- 公开健康徽章返回 `image/svg+xml`。
- 公开健康状态返回 JSON。
- 公开材料总览 JSON 返回 JSON。
- 材料 API 返回 JSON。
- 材料行动包返回 JSON。
- 4 个行动包页面返回 `200`。
- 行动包分享卡返回 `image/svg+xml`。
- 复用链路 JSON 返回 JSON。
- 公开化快速清单返回 Markdown 文本。
- 进展时间线返回 JSON。
- 进展时间线源数据返回 JSON。

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
