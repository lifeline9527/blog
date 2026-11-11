# 我的技术笔记

个人技术博客，基于 [Astro](https://astro.build) 构建，纯静态站点。

## 本地开发

**最省事的用法：双击项目根目录下的两个 bat 文件**

| 文件 | 作用 |
| --- | --- |
| `start-blog.bat` | 启动本地服务并自动打开浏览器（`http://localhost:4321`），关掉黑窗口即停止 |
| `edit-posts.bat` | 用 VS Code 打开文章目录 `src/content/blog/` |

`start-blog.bat` 带了 `--force`，重复双击不会报「另一个 dev server 已在运行」，会自动接管。

命令行方式：

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物在 dist/
npm run preview  # 预览构建结果
```

需要 Node.js >= 22.23.4（本机已装 26.13.0）。

改文章保存后浏览器自动刷新，不用重启服务。服务运行时电脑关机、断网都不影响，因为所有内容都在本地。

## 写一篇新文章

最快的办法是用脚本，会问你要标题、文件名、摘要、标签，然后自动生成 frontmatter：

```bash
npm run new
```

也可以手动在 `src/content/blog/` 新建 `.md` 文件，文件名会成为 URL（`my-post.md` → `/blog/my-post/`）：

```markdown
---
title: '文章标题'
description: '一句话摘要，显示在列表页'
pubDate: 2026-11-09
tags: ['标签1', '标签2']
draft: false
---

正文……
```

- `draft: true` 时只在本地可见，不会被构建上线
- 图片放 `src/assets/`，用相对路径引用，构建时自动压缩成 WebP
- 支持 `.mdx`，需要写组件时用

## 改站点信息

| 要改什么 | 文件 |
| --- | --- |
| 站名、简介、作者、导航 | `src/consts.ts` |
| 域名（影响 RSS 和 sitemap） | `astro.config.mjs` 的 `site` |
| 配色、字号、代码块样式 | `src/styles/global.css` |
| 页面结构 | `src/pages/` |
| 文章页版式 | `src/layouts/BlogPost.astro` |

## 目录结构

```
src/
├─ content/blog/     文章（Markdown）
├─ pages/            路由
├─ layouts/          页面版式
├─ components/       头部、页脚、日期等
├─ styles/global.css 全站样式
└─ consts.ts         站点配置
```

## 部署（暂时搁置）

> 状态：**已暂停**。`workers.dev` 域名在国内 DNS 被污染，大陆网络打不开（实测三个解析器返回
> 三个不同 IP，且附带 `face:b00c` 的 Facebook IPv6 前缀）。要真正对外发布，需要绑自有域名
> 或改用国内托管（腾讯云 EdgeOne Pages 等）。下文命令保留，环境是好的。

已部署过的地址：<https://blog.lifeline20051231.workers.dev>

一条命令构建并发布到 Cloudflare Workers：

```bash
npm run deploy     # = astro build && wrangler deploy
```

首次在一台新机器上部署需要先登录一次：`npx wrangler login`。

站点地址配置在 `wrangler.jsonc`（Worker 名称 `blog`），静态产物目录是 `dist/`。
换自定义域名后记得同步改 `astro.config.mjs` 的 `site`，否则 RSS 和 sitemap 里的链接还是旧的。

## 写作 → 本地查看 完整流程

```bash
npm run new                  # 1. 生成带 frontmatter 的文章模板
# 2. 编辑 src/content/blog/xxx.md（双击 edit-posts.bat 直接打开该目录）
npm run dev                  # 3. 本地预览 http://localhost:4321（或双击 start-blog.bat）
```

想让代码有备份时再执行：

```bash
git add -A && git commit -m "新增文章：xxx" && git push
```


