# AircMate - AI驱动的RC车型升级配件查找器

一个用于查找RC车型升级配件的AI驱动Vue 3单页应用。

## 🚀 功能特性

- 🔍 车型搜索和筛选
- 📝 添加升级记录
- 📊 升级记录展示
- 📱 响应式设计
- 🎨 科技感UI界面

## 📦 部署到GitHub Pages

### 第一步：上传代码到现有仓库

如果您已经有 `aircmate` 仓库，直接推送代码：

```bash
# 初始化Git仓库（如果尚未初始化）
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "feat: 添加RC车型升级记录管理系统"

# 添加远程仓库（使用您现有的仓库）
git remote add origin https://github.com/bairdweng/aircmate.git

# 推送代码到main分支
git branch -M main
git push -u origin main
```

### 第二步：配置GitHub Pages

1. 进入仓库：https://github.com/bairdweng/aircmate
2. 点击"Settings"选项卡
3. 左侧选择"Pages"
4. 在"Source"部分选择"GitHub Actions"
5. 保存设置

### 第三步：等待自动部署

推送代码后，GitHub Actions会自动：
- ✅ 安装依赖
- ✅ 构建应用  
- ✅ 部署到GitHub Pages

部署状态可以在仓库的"Actions"选项卡中查看。

## 🔗 访问地址

部署成功后，您的应用将通过以下地址访问：

```
https://bairdweng.github.io/aircmate/
```

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
src/
├── components/     # 组件
├── views/         # 页面视图
├── router/        # 路由配置
├── data/          # 静态数据
└── assets/        # 静态资源
```

## 🎯 技术栈

- Vue 3
- Vite
- Naive UI
- Vue Router
- GitHub Pages
- GitHub Actions The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
