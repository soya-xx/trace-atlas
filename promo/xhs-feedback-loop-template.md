# 小红书发布后回流模板

这份模板用于 Trace Atlas 痕迹星图发布到小红书之后，把外部反馈整理回公开仓库。它只记录可公开信息，不保存 token、账号密钥、本地路径、私信内容或平台后台截图。

## 帖子记录

- 发布日期：待填写
- 平台：小红书
- 帖子链接：待填写
- 使用标题：`我把AI会话做成网站`
- 首图：`promo/xhs-cover.png`
- 第二张图：`promo/workflow-card.png`
- 主公开链接：`https://trace-atlas-codex.pages.dev/`
- 对应 issue：`https://github.com/soya-xx/trace-atlas/issues/1`

## 发布时检查

- 主作品能打开。
- 发布草稿包能打开。
- 证据包能打开。
- 公开材料总览能打开。
- GitHub Actions 最近一次 `Verify Trace Atlas` 为成功。
- 正文没有 token、账号 ID、本地路径、私信内容或原始私密聊天。

## 评论与问题分类

| 类型 | 记录内容 | 处理方式 |
| --- | --- | --- |
| 想复用方法 | 读者问怎么照着做 | 补充模板、清单或步骤说明 |
| 看不懂项目 | 读者误解成普通网页生成 | 强化“部署、证据、验证、边界”的说明 |
| 链接问题 | 读者反馈打不开或资源缺失 | 复测公开链接，必要时修复部署 |
| 隐私疑问 | 读者担心聊天记录或账号泄露 | 引导到证据包和公开边界说明 |
| 新需求 | 读者提出新的复用场景 | 记录到 issue，评估是否进入下一轮公开材料 |

## 回流决策

每条有效反馈只选一种处理动作，避免一条评论拖出太多无关改动。

- 记录：只把问题补到 issue，暂不改页面。
- 修正文案：读者误解来自表达不清，改发布材料或 README。
- 补充证据：读者需要验证方式，补证据包、健康状态或公开材料总览。
- 修复链接：公开 URL、图片、报告或 manifest 失效，修好后重新验证。
- 新增模板：问题具有复用价值，写成新的公开模板。

## 回写 issue 模板

```md
## 发布后反馈回流

来源：小红书帖子《我把AI会话做成网站》

公开链接：

- 帖子链接：待填写
- 主作品：`https://trace-atlas-codex.pages.dev/`
- 发布草稿包：`https://trace-atlas-codex.pages.dev/promo/xhs-post-drafts.md`

收到的有效反馈：

- 待填写

本次处理动作：

- 待填写

验证证据：

- `npm run check`：待填写
- 公开链接复测：待填写

后续观察：

- 待填写
```

## 验证命令

```bash
npm run check
curl -I https://trace-atlas-codex.pages.dev/
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-post-drafts.md
curl -I https://trace-atlas-codex.pages.dev/promo/xhs-feedback-loop-template.md
curl -I https://trace-atlas-codex.pages.dev/evidence-pack.md
```

## 公开边界

- 不记录私信、用户账号、后台数据截图或不可公开的评论上下文。
- 不把评论里的个人身份信息搬进仓库。
- 不承诺无法验证的曝光、收藏、转化或收益。
- 平台反馈只保留公开问题和处理动作。
