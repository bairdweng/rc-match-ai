# Google Analytics 集成配置指南

## 1. 获取Google Analytics测量ID

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 创建新的GA4属性（如果还没有）
3. 在管理后台找到您的测量ID，格式为 `G-XXXXXXXXXX`

## 2. 配置环境变量

编辑 `.env` 文件，将测量ID替换为您的实际ID：

```env
# Google Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-您的实际测量ID
```

## 3. 已实现的功能

### 页面浏览跟踪
- 主页 (`/`): "RC Match AI - 主页"
- 搜索结果页 (`/search`): "RC Match AI - 搜索结果"

### 自定义事件跟踪
- **搜索事件**: 跟踪用户搜索行为，包含搜索关键词和结果数量
- **升级记录事件**: 
  - 查看记录详情
  - 添加新升级记录
- **错误事件**: 跟踪应用错误

## 4. 事件说明

### 搜索事件
```javascript
trackSearch(searchTerm, resultsCount)
```
- `search_term`: 搜索关键词
- `results_count`: 搜索结果数量
- `event_category`: "search"

### 升级记录事件
```javascript
trackUpgradeRecord(action, recordType)
```
- `action`: 操作类型 ("view", "create", "update", "delete")
- `record_type`: 记录类型
- `event_category`: "upgrade_records"

### 错误事件
```javascript
trackError(errorType, errorMessage)
```
- `error_type`: 错误类型
- `error_message`: 错误信息
- `event_category`: "errors"

## 5. 测试集成

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 在浏览器中打开应用
3. 进行搜索、查看记录等操作
4. 在Google Analytics实时报告中查看数据

## 6. 生产部署

确保在部署到GitHub Pages之前：
1. 正确配置 `.env` 文件中的测量ID
2. 运行构建命令：
   ```bash
   npm run build
   ```
3. 提交并推送代码到GitHub

## 7. 验证集成

在浏览器控制台中检查：
- Google Analytics是否成功初始化
- 事件是否正常发送
- 没有JavaScript错误

## 8. 故障排除

如果Google Analytics不工作：
1. 检查测量ID是否正确
2. 检查浏览器控制台是否有错误
3. 确认没有广告拦截器阻止GA脚本
4. 验证网络连接

## 9. 隐私考虑

- 确保遵守当地隐私法规
- 考虑添加Cookie同意横幅
- 提供用户选择退出跟踪的选项