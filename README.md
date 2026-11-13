# Free AI Video Prompt Kit

把零散的创作想法整理成可以检查、保存和手动修改的简报。面向中文视频与图片创作者的独立离线工具，提供 CLI 和 JavaScript API。

[Free AI Video 网站](https://freeaivideo.art) · [教程目录](docs/index.md) · [Notion 教程中心](https://frequent-option-c81.notion.site/Free-AI-Video-4170d247536b810a80eefc76c33806f5)

## 实际功能

- 创建文生视频、图生视频、文生图、图生图四种创作简报。
- 校验 JSON 字段、模式、长度以及参考图片提醒是否齐全。
- 将主体、动作、环境、镜头、光线、风格和避免内容组合为文本。
- 导出纯文本、JSON 或 Markdown，支持文件和标准输入。

本工具不联网、不读取参考图片、不上传文件、不生成媒体，也不调用网站接口。它不是官方模型、生成 API、模型 SDK 或可在本地运行的模型。简报通过校验不代表模型支持其中的要求，也不保证生成质量。`avoid` 会成为提示词中的一行，不会自动设置模型的负面提示词参数。

## 安装与运行

需要 Node.js 20 或更新版本。零运行时依赖。

npm registry 尚未发布 `0.1.0`。当前请使用源代码或审查后的 tarball。以下为发布后可用的预留安装命令；若 registry 返回 404，不要安装同名替代包。

```sh
npm install --global freeaivideo-prompt-kit@0.1.0
freeaivideo-prompt-kit init --mode text-to-video > brief.json
freeaivideo-prompt-kit validate brief.json
freeaivideo-prompt-kit render brief.json --format prompt
freeaivideo-prompt-kit render brief.json --format markdown > brief.md
```

从本仓库运行（不需要登录或安装依赖）：

```sh
node bin/cli.js init --mode image-to-video > brief.json
node bin/cli.js validate brief.json
node bin/cli.js render brief.json --format markdown > brief.md
node bin/cli.js render examples/text-to-image.json --format json
npm test
```

使用标准输入：

```sh
cat examples/text-to-video.json | node bin/cli.js validate -
```

Windows PowerShell 可使用 `Get-Content -Raw examples/text-to-video.json | node bin/cli.js validate -`。重定向会覆盖目标文件，请自行选择文件名。终端及文件使用 UTF-8。

## 简报示例

```json
{
  "version": 1,
  "mode": "text-to-video",
  "subject": "木桌上的手工陶杯",
  "action": "杯子保持静止，热气缓慢升起",
  "setting": "干净的室内工作台",
  "camera": "单镜头，缓慢推近",
  "lighting": "左侧柔和窗光",
  "style": "暖色，保留陶器质感",
  "avoid": "额外文字和标志"
}
```

`version`、`mode` 和非空 `subject` 必填。图生模式还需要 `reference` 字符串，例如 `my-authorized-cup-photo.png`；它只是提醒，不是读取路径或上传指令。其余字段可选；视频缺少 `action` 时给出建议。未知字段报错，避免把简报误当作网站或模型的请求参数。

每个文本字段最多 500 个 UTF-16 代码单元，组合提示词最多 2000 个；CLI 输入最多 64 KiB。这是工具自身的校验规则，不是模型支持范围或网站永久承诺。没有 `duration`、`seed`、价格估算或模型选择功能。

CLI 返回码：`0` 成功，`1` 输入或简报无效，`2` 命令用法错误。诊断信息写入 stderr；`validate` 的校验结果以 JSON 写入 stdout。

## JavaScript API

```js
import { createExample, validateBrief, compileBrief, toMarkdown } from 'freeaivideo-prompt-kit';

const brief = createExample('image-to-video');
brief.subject = '木桌上的手工陶杯';
brief.reference = 'my-authorized-cup-photo.png';
const check = validateBrief(brief);
if (check.valid) {
  console.log(compileBrief(brief).prompt);
  console.log(toMarkdown(brief));
}
```

API 不访问磁盘或网络；CLI 只读取你明确指定的简报文件或标准输入。无需 API Key，不要把密钥、私人照片链接或个人资料填入简报后公开分享。

## 教程

1. [开始前：免费条件、积分和网站可用性](docs/01-start.md)
2. [文生视频：写清一个镜头](docs/02-text-to-video.md)
3. [图生视频：整理参考图与动作](docs/03-image-to-video.md)
4. [离线简报：校验、导出和排查](docs/04-offline-tool.md)

## 免费条件与网站状态

本工具和这些原创教程按 MIT 授权免费使用，无需网站账号或付费。网站的生成服务另行运行：需要登录、可用积分及可用的模型服务。没有确认到稳定对外开放的新用户赠送额度，因此不承诺注册即免费、无限免费或永久免费。

截至 2026-11-13，本次只核对了项目代码，未完成公网生成与支付验收；域名访问配置仍在处理中。网站页面列有一次性积分包和月度计划，但支付链路尚未验收。本文不将标价视为可购买承诺，不宣传折扣、优先队列、固定生成数量或生成效果。网站恢复后，请以当前页面、账户余额和提交前提示为准。

## 授权范围

MIT 仅覆盖本独立仓库原创工具、示例和教程。网站完整源码、商业模板、后端实现、生产配置和第三方模型不在本仓库或本授权范围内。本仓库不提供模型权重，不代表任何模型厂商的合作或背书；输入素材与生成结果的使用权仍需另行核实。

## 验证与反馈

`npm test` 覆盖四种模式、无效输入、Unicode、长度限制、Markdown 输出边界、文件与 stdin 流程及 CLI 错误码。可以通过仓库 Issues 报告可复现问题；请使用虚构或已脱敏的简报，不附上密码、令牌或私有素材。
