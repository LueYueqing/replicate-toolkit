# 发布指南 / Publishing Guide

本指南将帮助你将 `@replicate-toolkit/client` 发布到 npmjs.com，并为你的项目 onlineimageupscaler.com 建立高价值外链。

This guide will help you publish `@replicate-toolkit/client` to npmjs.com and create a high-quality backlink to your onlineimageupscaler.com project.

---

## 📋 前置准备 / Prerequisites

### 1. npm 账号设置 / npm Account Setup

```bash
# 登录 npm
npm login

# 或检查是否已登录
npm whoami
```

### 2. GitHub 仓库设置 / GitHub Repository Setup

创建一个新的 GitHub 仓库：

- 仓库名: `replicate-toolkit`
- 描述: A simplified and powerful TypeScript toolkit for interacting with Replicate AI models
- 可见性: **公开 (Public)**
- 不需要包含 main 项目代码

---

## 🚀 发布步骤 / Publishing Steps

### 步骤 1: 更新 package.json 信息

编辑 `@replicate-toolkit/client/package.json`，更新以下信息：

```json
{
  "name": "@replicate-toolkit/client",
  "version": "1.0.0",
  "description": "A simplified and powerful TypeScript toolkit for interacting with Replicate AI models. Includes built-in rate limiting, automatic retries, and easy-to-use APIs.",
  "author": "Your Name <your-email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/replicate-toolkit.git"
  },
  "homepage": "https://github.com/YOUR_USERNAME/replicate-toolkit#readme",
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/replicate-toolkit/issues"
  }
}
```

**重要提示 / Important Note:**
- 将 `YOUR_USERNAME` 替换为你的 GitHub 用户名
- 更新 `author` 为你的真实姓名和邮箱

### 步骤 2: 初始化 Git 仓库

```bash
cd @replicate-toolkit/client

# 初始化 git
git init

# 添加文件
git add .

# 提交
git commit -m "Initial commit: @replicate-toolkit/client v1.0.0"
```

### 步骤 3: 推送到 GitHub

```bash
# 添加远程仓库（替换为你的仓库 URL）
git remote add origin https://github.com/YOUR_USERNAME/replicate-toolkit.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步骤 4: 创建 GitHub Release

1. 访问 GitHub 仓库页面
2. 点击 "Releases" → "Create a new release"
3. 标签: `v1.0.0`
4. 发布标题: `v1.0.0 - Initial Release`
5. 描述:
```markdown
## Features
- ✨ Initial release of @replicate-toolkit/client
- 🔒 Built-in rate limiting and request queue management
- 🚀 Easy-to-use APIs for image upscaling, colorization, restoration, and sharpening
- 📦 Full TypeScript support
- ⚡ Async & Sync operation modes

## Installation
```bash
npm install @replicate-toolkit/client
```

## Documentation
See https://github.com/YOUR_USERNAME/replicate-toolkit for full documentation.
```
6. 点击 "Publish release"

### 步骤 5: 发布到 npm

```bash
# 确保你在正确的目录
cd @replicate-toolkit/client

# 确保已登录 npm
npm whoami

# 发布包
npm publish

# 如果是 scoped 包（@replicate-toolkit），需要设置为公开
npm publish --access public
```

### 步骤 6: 验证发布

访问以下链接验证：
- npm 包页面: https://www.npmjs.com/package/@replicate-toolkit/client
- 搜索: https://www.npmjs.com/search?q=replicate-toolkit

---

## 🎯 SEO 和外链优化 / SEO and Backlink Optimization

### 1. README 中添加项目链接

确保 `README.md` 包含指向 onlineimageupscaler.com 的链接：

```markdown
## Production Example

This toolkit is used in production at [onlineimageupscaler.com](https://onlineimageupscaler.com), 
a free AI-powered image upscaler and enhancement platform.

## See Also

- [Replicate Documentation](https://replicate.com/docs)
- [onlineimageupscaler.com](https://onlineimageupscaler.com) - Live demo using this toolkit
```

### 2. 添加 GitHub Topics

在 GitHub 仓库设置中添加相关 topics：
- `replicate`
- `ai`
- `image-processing`
- `typescript`
- `rate-limiting`
- `api-client`
- `image-upscaling`

### 3. 创建 GitHub Pages 网站

创建 GitHub Pages 展示页面：

```bash
# 在仓库根目录创建 docs 文件夹
mkdir docs

# 创建简单的展示页面
```

### 4. 在其他平台推广

- **Twitter/X**: 发布推文介绍工具包，包含 npm 链接和项目链接
- **Reddit**: 在 r/TypeScript, r/javascript, r/MachineLearning 发布
- **Dev.to**: 撰写教程文章
- **Hacker News**: 在适当的话题下分享

### 5. package.json keywords 优化

确保包含 SEO 友好的关键词：

```json
{
  "keywords": [
    "replicate",
    "ai",
    "machine-learning",
    "image-processing",
    "upscale",
    "colorize",
    "photo-restoration",
    "image-enhancement",
    "api-client",
    "rate-limiting",
    "typescript",
    "image-upscaler",
    "photo-enhancer"
  ]
}
```

---

## 📝 后续维护 / Maintenance

### 更新版本

```bash
# 更新版本号（自动更新 package.json 并创建 git tag）
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# 推送标签到 GitHub
git push --tags

# 发布新版本
npm publish
```

### 回滚版本

```bash
# 废弃一个版本
npm deprecate @replicate-toolkit/client@1.0.1 "This version has a bug, please use 1.0.2"

# 取消发布整个包（谨慎使用）
npm unpublish @replicate-toolkit/client --force
```

---

## 🔐 安全最佳实践 / Security Best Practices

1. **不要在代码中硬编码 API Token**
   - 使用环境变量
   - 在 README 中说明如何配置

2. **使用 .npmignore**
   - 已创建 `.gitignore`
   - npm 默认会忽略 `.gitignore` 中的文件

3. **定期更新依赖**
   ```bash
   npm audit
   npm audit fix
   ```

4. **添加 Snyk 或 Dependabot**
   - 在 GitHub 仓库中启用 Dependabot
   - 设置自动安全更新

---

## 📊 监控使用情况 / Monitoring

### 查看下载量

```bash
# 查看过去 30 天的下载量
npm view @replicate-toolkit/client --json

# 使用第三方工具
npm info @replicate-toolkit/client
```

### 使用 npmcharts.com

访问 https://npmcharts.com/compare/@replicate-toolkit/client 查看下载趋势

### 设置 GitHub Insights

在 GitHub 仓库设置中查看：
- Traffic（流量）
- Clones（克隆）
- Forks（分叉）
- Stars（星标）

---

## 🎨 创建配套网站（可选）/ Optional: Create Landing Page

创建一个简单的 GitHub Pages 网站来展示这个工具包：

1. 在仓库设置中启用 GitHub Pages
2. 选择 `main` 分支作为源
3. 创建一个 `docs/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@replicate-toolkit/client - Replicate AI Toolkit</title>
    <meta name="description" content="A simplified and powerful TypeScript toolkit for interacting with Replicate AI models.">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            line-height: 1.6;
        }
        .install {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            margin: 20px 0;
        }
        .features {
            margin: 30px 0;
        }
        .features li {
            margin: 10px 0;
        }
        .links a {
            color: #0366d6;
            text-decoration: none;
        }
        .links a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>@replicate-toolkit/client</h1>
    <p>A simplified and powerful TypeScript toolkit for interacting with Replicate AI models.</p>
    
    <h2>Quick Start</h2>
    <div class="install">npm install @replicate-toolkit/client</div>
    
    <h2>Features</h2>
    <ul class="features">
        <li>🔒 Built-in Rate Limiting</li>
        <li>🚀 Easy-to-Use API</li>
        <li>⚡ Async & Sync Support</li>
        <li>📦 TypeScript Support</li>
        <li>🎨 Multiple AI Models</li>
    </ul>
    
    <h2>Documentation</h2>
    <p class="links">
        <a href="https://www.npmjs.com/package/@replicate-toolkit/client">npm Package</a> | 
        <a href="https://github.com/YOUR_USERNAME/replicate-toolkit">GitHub Repository</a> | 
        <a href="https://onlineimageupscaler.com">Live Demo</a>
    </p>
    
    <footer>
        <p>Created with ❤️ for the AI community</p>
    </footer>
</body>
</html>
```

---

## ✅ 检查清单 / Checklist

发布前请确认：

- [ ] 已更新 package.json 中的作者信息和仓库 URL
- [ ] 已创建 GitHub 仓库并设置为 Public
- [ ] README.md 包含清晰的使用示例
- [ ] README.md 包含 onlineimageupscaler.com 的链接
- [ ] 代码已构建（dist 文件夹存在）
- [ ] 已登录 npm（运行 npm whoami 确认）
- [ ] 已测试基本功能
- [ ] 已更新 LICENSE 文件
- [ ] 已创建 GitHub Release

---

## 📞 支持 / Support

如有问题或需要帮助：

- GitHub Issues: https://github.com/YOUR_USERNAME/replicate-toolkit/issues
- npm: https://www.npmjs.com/package/@replicate-toolkit/client

---

## 🎉 完成！/ Done!

恭喜你！你的 npm 包已经发布成功。现在 onlineimageupscaler.com 拥有一个来自 npmjs.com 的高质量外链！

Congratulations! Your npm package is now published. Your onlineimageupscaler.com now has a high-quality backlink from npmjs.com!
