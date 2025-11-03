<template>
  <n-message-provider>
    <router-view />
  </n-message-provider>
</template>

<script>
import { NMessageProvider } from 'naive-ui'

export default {
  name: 'App',
  components: {
    NMessageProvider
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  padding: 1rem 2rem;
  background-color: var(--bg-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--bg-tertiary);
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--text-primary);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

/* Search Section */
.search-section {
  margin-bottom: 3rem;
}

.search-container {
  display: flex;
  gap: 1rem;
  background-color: var(--bg-secondary);
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.search-input {
  flex: 1;
  height: 50px;
  font-size: 1.1rem;
  border-radius: var(--radius-lg);
  background-color: var(--bg-tertiary);
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
  z-index: 10;
}

/* 确保整个输入控件高度正确 */
.search-input :deep(.n-base-selection) {
  height: 100%;
  display: flex;
  align-items: center;
}

/* 确保输入框内部内容区域垂直居中 */
.search-input :deep(.n-base-selection-input__content-wrapper) {
  display: flex;
  align-items: center;
  height: 100%;
  vertical-align: middle;
}

/* 确保前缀图标容器样式，使用flex布局实现完美居中 */
.search-input :deep(.n-base-selection-prefix) {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  height: 100%;
  padding: 0;
}

/* 简化输入框内容区域样式 */
.search-input :deep(.n-base-selection-input__content-wrapper) {
  height: 100%;
}

/* 调整输入区域的对齐 */
.search-input :deep(.n-base-selection-input__placeholder) {
  line-height: normal;
  display: flex;
  align-items: center;
  vertical-align: middle;
}

.search-input :deep(.n-base-selection-input__input) {
  line-height: normal;
  display: flex;
  align-items: center;
  vertical-align: middle;
  height: 100%;
}

/* 确保清除按钮也垂直居中 */
.search-input :deep(.n-base-selection-suffix) {
  display: flex;
  align-items: center;
  vertical-align: middle;
}

.search-input:focus {
  border-color: var(--accent-color);
}

/* Naive UI Dropdown 组件会自动处理样式，这里不需要自定义搜索建议样式 */

/* 确保输入框和下拉框布局正确 */
.search-container {
  display: flex;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.search-button {
  min-width: 100px;
  border-radius: 8px;
  background-color: var(--accent-color);
}

.search-button:hover {
  background-color: var(--accent-hover);
}

.create-button {
  min-width: 120px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.create-button:hover {
  background-color: var(--bg-secondary);
  border-color: var(--accent-color);
  transform: translateY(-1px);
}

/* Popular Models */
.popular-models {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.model-card {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-card:hover {
  transform: translateY(-5px);
  background-color: var(--bg-tertiary);
}

.model-name {
  font-size: 1.1rem;
  font-weight: 600;
}

/* Footer */
.footer {
  padding: 2rem;
  text-align: center;
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--bg-tertiary);
  color: var(--text-secondary);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .search-container {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }

  .models-grid {
    grid-template-columns: 1fr;
  }
}
</style>
