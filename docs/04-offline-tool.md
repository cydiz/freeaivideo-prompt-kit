# 离线简报：校验、导出和排查

目标：把提示词拆成可复用字段，发现格式问题，导出可以交接的 Markdown。工具不生成图片或视频，不调用网站接口，不需要账号或 API Key。

## 准备

安装 Node.js 20 或更新版本，并取得本独立工具仓库或已审查的 npm tarball。下面的 `node bin/cli.js` 命令在仓库目录内运行，不依赖 npm 发布状态。registry 版本发布后，可用 `npm install --global freeaivideo-prompt-kit@0.1.0` 安装；若返回 404，说明该版本尚不可从 registry 安装。

## 步骤

1. 生成一份示例到新文件。注意终端重定向会覆盖同名文件：

```sh
node bin/cli.js init --mode text-to-video > my-brief.json
```

2. 用编辑器修改主体、动作、环境、镜头、光线和风格，保持 JSON 语法有效。所有示例都是原创创作意图，没有附带生成效果。
3. 运行校验：

```sh
node bin/cli.js validate my-brief.json
```

成功时 JSON 中 `valid` 为 `true`，命令退出码为 0。视频缺少动作可能只给出 warning；通过校验不证明模型会实现描述。

4. 导出提示词和 Markdown，分别选择不会覆盖原文件的新文件名：

```sh
node bin/cli.js render my-brief.json --format prompt > my-prompt.txt
node bin/cli.js render my-brief.json --format markdown > my-plan.md
```

5. 人工检查内容。网站恢复后，可以把 `my-prompt.txt` 的文本手动粘贴到 [Free AI Video](https://freeaivideo.art) 对应工作区；网站的登录、积分和服务可用条件另行适用。

## 校验范围

支持 `text-to-video`、`image-to-video`、`text-to-image` 和 `image-to-image`。`version: 1`、合法 `mode`、非空 `subject` 必填；图生模式还需要 `reference` 提醒。每个文本字段最多 500 个 UTF-16 代码单元，组合提示词最多 2000 个；CLI 输入最多 64 KiB。

这些是工具自身的格式规则。工具不支持模型参数校验、图片读取、时长或分辨率设置、价格估算、自动提交与批量生成。`avoid` 被组合进提示词，不是模型专用负面提示词参数。参考图字段永远不会被读取或上传。

## 故障排查

- `Input error` / JSON 解析失败：检查双引号、逗号和括号；不要在 JSON 内写注释。
- `Unknown field`：删除不支持的字段；例如 `duration` 或 API Key 都不是这个格式的字段。
- `subject is required`：补充非空主体，只有空格不算有效内容。
- `reference is required`：图生模式需要一条素材提醒，仍需你在网站中另行上传。
- 长度超限：删掉重复修饰语，并拆分多个创作目标。
- 文件找不到：检查当前目录和文件路径，含空格的路径加引号。
- 不明退出码：0 成功、1 输入或校验失败、2 命令用法错误；用 `node bin/cli.js --help` 查看帮助。

## 免费与授权

原创工具、教程和示例按 MIT 免费使用，不需要注册。它们不包含网站商业模板、后台服务或模型权重。分享 Markdown 或 JSON 前自行检查私人内容；不要把密钥和未授权素材放入公开仓库。网站生成不会因为使用离线工具而免除积分或服务费用。

截至 2026-11-13，网站公网生成和支付流程尚未完成验收。返回[教程目录](index.md)，选择一个单镜头练习继续准备即可，无需重复提交在线任务。
