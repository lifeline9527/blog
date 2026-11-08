---
title: '把 Node 从 22 升到 26：一次完整的踩坑记录'
description: '明明装了 Node，构建却报版本不够。问题不在 Node 本身，在 PATH 的先后顺序。'
pubDate: 2026-11-06
tags: ['Node.js', '环境配置', 'Windows']
---

起因很简单：新建一个 Astro 项目，`npm run dev` 直接退出，报错说 Node 版本不满足要求。

```
You are using Node.js 22.22.2. Astro requires Node.js v22.23.4 or higher.
```

看着只差一个补丁号，但 `package.json` 里的 `engines` 是硬校验，差一点就是不让跑。

## 第一步：先搞清楚 Node 是哪来的

第一反应是 `node -v` 看版本，确认是 22.22.2。然后查它装在哪：

```bash
where node
```

输出让人一愣：

```
C:\Users\Lenovo\.workbuddy\binaries\node\versions\22.22.2-6\node.exe
```

这不是我装的。再查系统里的安装目录：

```powershell
Test-Path "C:\Program Files\nodejs"
```

`False`。也就是说，**这台机器上从来没有装过独立的 Node**，一直用的是某个工具自带的运行时。

这也解释了一个之前没在意的现象：在 Windows 终端里敲 `node` 会提示"不是内部或外部命令"。

## 第二步：安装真正的 Node

用 winget 最省事，包名带 `LTS` 就会一直跟到当前长期支持版本：

```powershell
winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
```

装完验证：

```powershell
& "C:\Program Files\nodejs\node.exe" -v
# v26.13.0
```

## 第三步：PATH 才是真正的坑

安装程序把 `C:\Program Files\nodejs\` 写进了系统 PATH，但**这个改动对已经打开的进程无效**。PATH 是进程启动时读进内存的，改注册表不会热更新。

所以必须做两件事：

1. 关掉所有终端窗口重开
2. 如果开发工具（VS Code、IDE）一直开着，也要重启，否则它的集成终端还是旧环境

想立刻验证，可以在 PowerShell 里手动拼一次环境变量，模拟"全新终端"：

```powershell
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + `
            [Environment]::GetEnvironmentVariable("Path","User")
node -v
```

如果这样能输出 `v26.13.0`，说明系统配置没问题，只是当前窗口没刷新。

## 还有一层：谁排在前面

即使装了新 Node，某些工具（比如各种 AI 助手、打包器、IDE 插件）会在启动时把自己的 Node 运行时插到 PATH 最前面。结果是：

- 你在自己的终端里看到的是 26.13.0
- 工具内部执行的却是它自带的 22.22.2

排查方法就是看完整路径，而不是只看版本号：

```powershell
(Get-Command node -All).Source
```

有多个结果时，第一个就是实际生效的那个。

## 小结

| 症状 | 真正的原因 |
| --- | --- |
| 报版本不够，但 `node -v` 明明够 | 实际执行的是另一个 Node |
| 装完版本没变 | 终端没重开，PATH 未刷新 |
| 终端和工具里版本不一致 | PATH 顺序不同，工具自带运行时优先 |

一条经验：**遇到版本相关的报错，第一件事永远是打印可执行文件的绝对路径**，而不是版本号。版本号会骗人，路径不会。
