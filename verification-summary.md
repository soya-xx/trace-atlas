# Trace Atlas 验证摘要

来源：`public-health.json`、`materials-index.json`、`reuse-map.json`

这份摘要只使用公开 JSON 和公开链接，方便读者、维护者和 issue 评论快速复核当前状态。

## 当前状态

- 状态：可公开访问
- 公开入口：30
- 视觉素材：9
- 发布文档：11
- 验证脚本：10
- 材料索引条目：51

## 公开检查

- 主作品在线：ok，证据：https://trace-atlas-codex.pages.dev/
- 开始复用入口已公开：ok，证据：https://trace-atlas-codex.pages.dev/start
- 复用路线页已公开：ok，证据：https://trace-atlas-codex.pages.dev/reuse
- 复用链路 JSON 已公开：ok，证据：https://trace-atlas-codex.pages.dev/reuse-map.json
- 发布材料完整：ok，证据：https://trace-atlas-codex.pages.dev/launch
- 材料总览已公开：ok，证据：https://trace-atlas-codex.pages.dev/materials
- 材料选择器已公开：ok，证据：https://trace-atlas-codex.pages.dev/materials-guide
- 项目纪念碑已公开：ok，证据：https://trace-atlas-codex.pages.dev/monument
- 发布草稿包已公开：ok，证据：https://trace-atlas-codex.pages.dev/promo/xhs-post-drafts.md
- 发布后回流模板已公开：ok，证据：https://trace-atlas-codex.pages.dev/promo/xhs-feedback-loop-template.md
- 复用流程图已公开：ok，证据：https://trace-atlas-codex.pages.dev/promo/reuse-flow-card.png
- 公开健康徽章已公开：ok，证据：https://trace-atlas-codex.pages.dev/public-health-badge.svg
- 公开化快速清单已公开：ok，证据：https://trace-atlas-codex.pages.dev/templates/ai-session-public-quickstart.md
- 验证摘要已公开：ok，证据：https://trace-atlas-codex.pages.dev/verification-summary.md
- 时间线源数据已公开：ok，证据：https://trace-atlas-codex.pages.dev/progress-timeline-source.json
- 材料 API 已公开：ok，证据：https://trace-atlas-codex.pages.dev/materials-api.json
- 材料行动包已公开：ok，证据：https://trace-atlas-codex.pages.dev/materials-packs.json
- 发布前自检页已公开：ok，证据：https://trace-atlas-codex.pages.dev/preflight
- 阅读了解行动包页已公开：ok，证据：https://trace-atlas-codex.pages.dev/pack-read
- 发帖发布行动包页已公开：ok，证据：https://trace-atlas-codex.pages.dev/pack-publish
- 复用接力行动包页已公开：ok，证据：https://trace-atlas-codex.pages.dev/pack-reuse
- 验证维护行动包页已公开：ok，证据：https://trace-atlas-codex.pages.dev/pack-verify
- 行动包分享卡已公开：ok，证据：https://trace-atlas-codex.pages.dev/promo/pack-publish-card.svg
- 发布报告可生成：ok，证据：https://trace-atlas-codex.pages.dev/promo/xhs-publish-report.md
- 边界扫描纳入 CI：ok，证据：https://github.com/soya-xx/trace-atlas/actions/workflows/verify.yml
- 时间线生成脚本纳入 CI：ok，证据：https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-progress-timeline.mjs
- 材料 API 生成脚本纳入 CI：ok，证据：https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-materials-api.mjs
- 材料行动包生成脚本纳入 CI：ok，证据：https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-materials-packs.mjs
- 行动包页面生成脚本纳入 CI：ok，证据：https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-pack-pages.mjs
- 工作日志持续同步：ok，证据：https://github.com/soya-xx/trace-atlas/issues/1

## 材料分组

- 可见页面：13 项
- 图片素材：9 项
- 发布文档：11 项
- 机器可读数据：9 项
- 验证与边界：9 项

## 复用链路

- 入口：https://trace-atlas-codex.pages.dev/start
- 核心节点：6
- 连接关系：5

- 开始复用入口：https://trace-atlas-codex.pages.dev/start
- 公开化快速清单：https://trace-atlas-codex.pages.dev/templates/ai-session-public-quickstart.md
- 完整复用模板：https://trace-atlas-codex.pages.dev/templates/ai-session-artifact-kit.md
- 证据包：https://trace-atlas-codex.pages.dev/evidence-pack.md
- 公开健康状态：https://trace-atlas-codex.pages.dev/public-health.json
- 发布后回流模板：https://trace-atlas-codex.pages.dev/promo/xhs-feedback-loop-template.md

## 读者呈现

- 读者复用路线页（html）：https://trace-atlas-codex.pages.dev/reuse
- 小红书复用流程图（image/png）：https://trace-atlas-codex.pages.dev/promo/reuse-flow-card.png

## 公开边界

- 不包含 token、API key、账号密钥或本地路径。
- 不包含原始私密聊天、私信内容或平台后台截图。
- 只记录公开链接和可复核材料。

## 本地复核命令

```bash
npm run check
node scripts/build-verification-summary.mjs --check
```
