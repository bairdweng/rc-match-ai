# SEO 监控和效果跟踪指南

## 📊 如何查看SEO效果

### 1. Google Search Console 设置

#### 验证网站所有权
1. 访问 [Google Search Console](https://search.google.com/search-console/)
2. 选择"网址前缀"验证方式
3. 输入你的网站地址：`https://bairdweng.github.io/aircmate/`
4. 选择"HTML标签"验证方法
5. 将验证代码添加到你的网站

#### 验证代码示例
在 `index.html` 的 `<head>` 部分添加：
```html
<meta name="google-site-verification" content="your_verification_code_here" />
```

### 2. 查看收录状态

#### 手动检查
在Google搜索框中输入：
```
site:bairdweng.github.io/aircmate
```

#### 使用Search Console查看
- 进入 Search Console → 索引 → 页面
- 查看哪些页面被索引
- 检查索引错误和警告

### 3. 搜索表现分析

#### 关键指标
- **展示次数**：网站在搜索结果中出现的次数
- **点击次数**：用户点击搜索结果的次数
- **点击率 (CTR)**：点击次数 ÷ 展示次数
- **平均排名**：关键词的平均排名位置

#### 查看方法
1. Search Console → 效果报告
2. 选择时间范围（建议至少1个月）
3. 分析关键词表现

## 🔍 实时监控工具

### 1. Google Analytics 4 (GA4)

#### 关键SEO指标
- **有机搜索流量**：来源/媒介 → google / organic
- **着陆页表现**：行为 → 着陆页
- **用户行为**：跳出率、停留时间、页面/会话

#### 设置自定义报告
1. 探索 → 创建新探索
2. 添加维度：页面标题、页面路径、来源/媒介
3. 添加指标：会话数、用户数、跳出率

### 2. 第三方SEO工具

#### 免费工具
- **Google PageSpeed Insights** - 页面性能分析
- **Google Mobile-Friendly Test** - 移动端友好度
- **SEMrush** (免费版) - 关键词排名跟踪
- **Ahrefs Webmaster Tools** - 免费网站分析

#### 付费工具推荐
- **SEMrush Pro** - 全面SEO分析
- **Ahrefs** - 反向链接和关键词研究
- **Moz Pro** - 域名权威和排名跟踪

## 📈 关键性能指标 (KPIs)

### 技术SEO指标
- **页面加载速度**：目标 < 3秒
- **移动端友好度**：100%通过移动测试
- **索引覆盖率**：>95%页面被索引
- **错误页面**：< 1%

### 内容SEO指标
- **关键词排名**：核心关键词进入前10名
- **有机流量增长**：月增长率 > 10%
- **跳出率**：< 50%
- **平均停留时间**：> 2分钟

### 用户体验指标
- **页面/会话**：> 2.5
- **转化率**：根据业务目标设定
- **滚动深度**：> 70%

## 🛠️ 自动化监控

### 1. 创建监控脚本
```javascript
// scripts/seo-monitor.js
const axios = require('axios');

// 检查页面索引状态
async function checkIndexing(url) {
    try {
        const searchUrl = `https://www.google.com/search?q=site:${encodeURIComponent(url)}`;
        const response = await axios.get(searchUrl);
        return response.data.includes('约'); // 中文搜索结果标识
    } catch (error) {
        console.error('检查索引失败:', error.message);
        return false;
    }
}

// 检查页面性能
async function checkPageSpeed(url) {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}`
        );
        return response.data.lighthouseResult.categories.performance.score * 100;
    } catch (error) {
        console.error('检查页面速度失败:', error.message);
        return 0;
    }
}
```

### 2. 定期报告
设置每周/每月自动生成SEO报告，包含：
- 关键词排名变化
- 有机流量趋势
- 技术问题汇总
- 改进建议

## 🚨 常见问题排查

### 网站未被收录
1. **检查robots.txt**：确保没有阻止搜索引擎
2. **提交sitemap**：在Search Console提交sitemap.xml
3. **检查noindex标签**：确保页面没有被标记为noindex
4. **等待索引**：新网站可能需要几周时间

### 排名下降
1. **算法更新**：检查Google算法更新
2. **技术问题**：检查页面加载速度、移动端适配
3. **内容质量**：评估内容相关性和深度
4. **竞争对手**：分析竞争对手的优化策略

### 流量下降
1. **季节性因素**：考虑行业季节性
2. **关键词趋势**：检查核心关键词搜索量
3. **网站更改**：回顾最近的网站改动
4. **外部链接**：检查反向链接变化

## 📋 月度SEO检查清单

### 技术SEO
- [ ] 检查页面加载速度
- [ ] 验证移动端友好度
- [ ] 检查索引状态
- [ ] 审核sitemap和robots.txt
- [ ] 检查结构化数据

### 内容SEO
- [ ] 更新过时内容
- [ ] 优化页面标题和描述
- [ ] 检查内部链接结构
- [ ] 添加新内容
- [ ] 优化图片ALT标签

### 分析报告
- [ ] 生成SEO性能报告
- [ ] 分析关键词表现
- [ ] 跟踪竞争对手
- [ ] 制定下月优化计划

## 🔗 有用的资源

- [Google Search Console帮助](https://support.google.com/webmasters/)
- [Google Analytics学习中心](https://analytics.google.com/analytics/academy/)
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

通过系统化的监控和分析，你可以持续优化网站的SEO表现，提高在搜索引擎中的可见度和排名。