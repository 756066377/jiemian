# 界面 - 国产钢材型号查询系统

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)
![Tauri](https://img.shields.io/badge/Tauri-2.0-FFC131?logo=tauri)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)

一个基于 Tauri + React + TypeScript 开发的国产钢材型号查询系统，提供全面的型钢数据查询、过滤和详细规格展示功能。

## 📋 项目简介

界面是一款专业的钢材型号查询工具，集成了国产热轧钢材的标准数据，支持多种型钢类型的快速查询和对比。系统采用现代化的桌面应用框架 Tauri 构建，具有轻量、高效、跨平台的特点。

### 主要功能

- **多种型钢类型支持**：涵盖 H 型钢、工字钢、槽钢、等边角钢、不等边角钢、扁钢等 6 大类
- **智能筛选**：支持按型号搜索、分类筛选、规格筛选
- **详细参数展示**：提供完整的尺寸、重量、截面特性等参数
- **H 型钢计算器**：内置截面特性计算工具
- **现代化界面**：采用玻璃态设计风格，美观易用

## ✨ 功能特性

### 1. 型钢类型覆盖

| 型钢类型 | 数据量 | 主要特点 |
|---------|--------|---------|
| 热轧 H 型钢 | 完整 | HW/HM/HN/HT 四种系列 |
| 热轧工字钢 | 完整 | 标准型号全覆盖 |
| 热轧槽钢 | 完整 | 标准规格数据 |
| 热轧等边角钢 | 完整 | 多种厚度规格 |
| 热轧不等边角钢 | 完整 | 不等边规格齐全 |
| 热轧扁钢 | 完整 | 多种宽度规格 |

### 2. 查询功能

- 🔍 **快速搜索**：支持按型号关键词实时搜索
- 📊 **多维度筛选**：H 型钢按系列（HW/HM/HN/HT）、角钢按类型（等边/不等边）、扁钢按宽度筛选
- 🎯 **规格识别**：角钢规格支持 B×d 和 B×b×d 格式搜索

### 3. 数据展示

- 📐 **详细尺寸参数**：高度、宽度、厚度、腹板、翼缘等
- ⚖️ **截面特性**：截面面积、理论重量、惯性矩、截面模量等
- 🎨 **可视化标注**：重要参数高亮显示
- 💾 **数据来源**：基于国标 GB/T 标准数据

### 4. H 型钢计算器

- 🔬 截面特性实时计算
- 📉 参数调整预览
- 📋 结果导出功能

## 🚀 技术栈

### 前端技术

- **React 19** - 用户界面框架
- **TypeScript 5.8** - 类型安全
- **Vite 7** - 构建工具
- **Tailwind CSS 3.4** - 样式框架
- **Lucide React** - 图标库

### 桌面框架

- **Tauri 2.0** - 跨平台桌面应用框架
- **Rust** - 后端性能核心

### 开发工具

- **PostCSS + Autoprefixer** - CSS 处理
- **Tailwind CSS Animate** - 动画效果

## 📦 安装说明

### 环境要求

- Node.js 18+ 
- Rust 1.70+ （仅开发环境）
- 系统依赖：WebView2（Windows）、webkit2gtk（Linux）、Cocoa（macOS）

### 开发环境安装

```bash
# 克隆项目
git clone https://github.com/yourusername/jiemian.git
cd jiemian

# 安装依赖
npm install

# 启动开发服务器
npm run tauri dev
```

### 生产环境构建

```bash
# 构建应用
npm run tauri build

# 构建产物位置
# Windows: src-tauri/target/release/bundle/msi/
# macOS: src-tauri/target/release/bundle/dmg/
# Linux: src-tauri/target/release/bundle/deb/
```

## 📖 使用示例

### 1. 查询 H 型钢

1. 在左侧导航选择「H 型钢」
2. 点击筛选按钮选择系列（HW/HM/HN/HT）
3. 在搜索框输入型号关键词
4. 点击型号查看详细参数

### 2. 查询角钢

1. 选择「等边角钢」或「不等边角钢」
2. 使用类型筛选切换等边/不等边
3. 输入规格搜索（如「20×3」或「25×16×3」）
4. 查看尺寸和重量信息

### 3. 使用计算器

1. 选择任意 H 型钢型号
2. 点击「打开计算器」按钮
3. 调整参数查看实时计算结果

## 🏗️ 项目结构

```
jiemian/
├── src/                    # 源代码
│   ├── components/         # React 组件
│   │   ├── Header.tsx      # 顶部标题栏
│   │   ├── Sidebar.tsx     # 左侧导航
│   │   ├── FilterBar.tsx   # 筛选栏
│   │   ├── ModelList.tsx   # 型号列表
│   │   ├── DetailView.tsx  # 详情视图
│   │   └── ...
│   ├── data/               # 钢材数据
│   │   ├── hbeamData.ts
│   │   ├── iBeamData.ts
│   │   ├── channelData.ts
│   │   ├── equalAngleData.ts
│   │   ├── unequalAngleData.ts
│   │   └── flatSteelData.ts
│   ├── types/              # TypeScript 类型定义
│   └── utils/              # 工具函数
├── src-tauri/              # Tauri 后端
├── 国标数据/               # 原始 JSON 数据
├── public/                 # 静态资源
└── package.json
```

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 贡献流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 配置规范
- 组件使用函数式组件 + Hooks
- 使用 Tailwind CSS 类名进行样式编写

### Issue 提交

提交 Issue 时请提供：
- 详细的复现步骤
- 预期行为 vs 实际行为
- 截图（如果是 UI 问题）
- 系统环境信息

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

## 🙏 致谢

- [Tauri](https://tauri.app/) - 跨平台桌面应用框架
- [React](https://react.dev/) - 用户界面库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- 国标 GB/T 系列标准数据提供者

## 📧 联系方式

- GitHub Issues: [项目 Issues 页面](https://github.com/yourusername/jiemian/issues)

## 🔄 更新日志

### v0.1.0 (2024-12-26)

- ✨ 初始版本发布
- 🎨 实现基础 UI 界面
- 📊 集成 6 大类型钢数据
- 🔍 实现搜索和筛选功能
- 🧮 添加 H 型钢计算器
- 💫 优化响应式布局

---

**注意**：本项目数据来源于国家标准，仅供参考。实际应用请以官方发布的最新标准为准。
