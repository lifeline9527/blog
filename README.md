# 我的技术笔记

个人技术博客，基于 [Astro](https://astro.build) 构建，纯静态站点。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物在 dist/
npm run preview  # 预览构建结果
```

需要 Node.js >= 22.23.4。

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

## 部署

推送到 `main` 分支后由 Cloudflare Pages 自动构建部署。

构建配置：命令 `npm run build`，输出目录 `dist`。
