<template>
  <n-message-provider>
    <div class="app-container" @click="handleClickOutside">
      <!-- Header -->
      <header class="header">
        <div class="logo">RC Match AI</div>
        <nav class="nav">
          <a href="#" class="nav-link">About</a>
        </nav>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Hero Section -->
        <section class="hero-section">
          <h1 class="hero-title">Stop buying the wrong parts.</h1>
          <p class="hero-subtitle">Find the perfect match instantly.</p>
        </section>

        <!-- Search Section -->
        <section class="search-section">
          <div class="search-container" @click.stop>
            <n-dropdown
              placement="bottom-start"
              trigger="manual"
              :show="searchSuggestions.length > 0"
              :options="searchSuggestions.map(suggestion => ({
                key: `${suggestion.brand}-${suggestion.model}`,
                label: suggestion.label,
                props: {
                  onClick: () => handleSuggestionSelect(suggestion)
                }
              }))"
              :style="{ width: '100%' }"
            >
              <n-input 
                v-model:value="searchQuery" 
                placeholder="Enter your model, e.g. Traxxas Slash" 
                class="search-input" 
                :bordered="false" 
                :clearable="true"
                :input-props="{ autocomplete: 'off' }" 
                :size="'large'"
                @input="handleInputChange" 
                @keyup.enter="handleSearch"
                @blur="handleInputBlur"
              >
                <!-- 前缀图标 -->
                <template #prefix>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16" y2="16" />
                  </svg>
                </template>
              </n-input>
            </n-dropdown>
            <n-button type="primary" class="search-button pulse-hover" @click="handleSearch" :disabled="loading">
              {{ loading ? 'Searching...' : 'Search' }}
            </n-button>
          </div>
        </section>

        <!-- Create Form Modal -->
        <CreateForm 
          v-model:show="showCreateForm"
        />
      </main>

      <!-- Footer -->
      <footer class="footer">
        <p>Powered by RC Match AI</p>
      </footer>
    </div>
  </n-message-provider>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { NInput, NButton, NCard, NAutoComplete, NSpin, NDropdown, NMessageProvider, useMessage } from 'naive-ui'
import CreateForm from '../components/CreateForm.vue'

export default {
  name: 'Home',
  components: {
    NInput,
    NButton,
    NCard,
    NAutoComplete,
    NDropdown,
    NMessageProvider,
    CreateForm
  },
  setup() {
    const router = useRouter()
    const message = useMessage()
    const searchQuery = ref('')
    const searchResults = ref([])
    const loading = ref(false)
    const hasSearched = ref(false)
    const searchSuggestions = ref([]) // 初始为空，用户输入时才生成
    const showCreateForm = ref(false) // 控制新建表单显示
    
    // 调试：检查表单初始状态
    console.log('CreateForm initial state:', showCreateForm.value)
    console.log('App component mounted, showCreateForm should be false')
    
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search)
    console.log('URL parameters:', Object.fromEntries(urlParams.entries()))
    
    // 如果有特定参数，设置表单显示
    if (urlParams.has('create')) {
      showCreateForm.value = true
      console.log('Form opened via URL parameter')
    }

    // 从config.json加载所有模型数据
    const allModels = ref([])
    
    // 在组件挂载时加载所有模型数据
    const loadAllModels = async () => {
      try {
        // 导入新的config.json格式
        const configData = {
          models: [
            { id: 1, brand: "Traxxas", model: "Slash 2WD", fullName: "Traxxas Slash 2WD", scale: "1:10", drive: "2WD" },
            { id: 2, brand: "Traxxas", model: "Slash 4x4", fullName: "Traxxas Slash 4x4", scale: "1:10", drive: "4WD" },
            { id: 3, brand: "Traxxas", model: "Slash MVP", fullName: "Traxxas Slash MVP", scale: "1:10", drive: "2WD" },
            { id: 4, brand: "Traxxas", model: "Rustler 2WD", fullName: "Traxxas Rustler 2WD", scale: "1:10", drive: "2WD" },
            { id: 5, brand: "Traxxas", model: "Rustler", fullName: "Traxxas Rustler", scale: "1:10", drive: "2WD" },
            { id: 6, brand: "Traxxas", model: "Maxx", fullName: "Traxxas Maxx", scale: "1:10", drive: "4WD" },
            { id: 7, brand: "Traxxas", model: "X-Maxx", fullName: "Traxxas X-Maxx", scale: "1:8", drive: "4WD" },
            { id: 8, brand: "Traxxas", model: "Revo 3.3", fullName: "Traxxas Revo 3.3", scale: "1:8", drive: "4WD" },
            { id: 9, brand: "Traxxas", model: "Jato 4x4", fullName: "Traxxas Jato 4x4", scale: "1:8", drive: "4WD" },
            { id: 10, brand: "Traxxas", model: "Rally ST", fullName: "Traxxas Rally ST", scale: "1:10", drive: "4WD" },
            { id: 11, brand: "Traxxas", model: "Summit", fullName: "Traxxas Summit", scale: "1:10", drive: "4WD" },
            { id: 12, brand: "Traxxas", model: "Slash Ultimate", fullName: "Traxxas Slash Ultimate", scale: "1:10", drive: "4WD" },
            { id: 13, brand: "Traxxas", model: "TRX-4 / TRX4", fullName: "Traxxas TRX-4 / TRX4", scale: "1:10", drive: "4WD" },
            { id: 14, brand: "Team Associated", model: "RC10 T2", fullName: "Team Associated RC10 T2", scale: "1:10", drive: "2WD" },
            { id: 15, brand: "Team Associated", model: "TT02", fullName: "Team Associated TT02", scale: "1:10", drive: "4WD" },
            { id: 16, brand: "Team Associated", model: "SC10 2", fullName: "Team Associated SC10 2", scale: "1:10", drive: "2WD" },
            { id: 17, brand: "Losi", model: "Mini 8IGHT", fullName: "Losi Mini 8IGHT", scale: "1:14", drive: "4WD" },
            { id: 18, brand: "Arrma", model: "Granite 223S", fullName: "Arrma Granite 223S", scale: "1:10", drive: "4WD" },
            { id: 19, brand: "Arrma", model: "Typhon 6S", fullName: "Arrma Typhon 6S", scale: "1:8", drive: "4WD" },
            { id: 20, brand: "Nitro", model: "4-Tec", fullName: "Nitro 4-Tec", scale: "1:10", drive: "4WD" }
          ]
        }
        
        console.log('Config data loaded:', configData)
        console.log('Models:', configData.models)
        
        allModels.value = configData.models
        console.log('Loaded models from config.json:', allModels.value)
      } catch (error) {
        console.error('Error loading models:', error)
      }
    }
    
    // 组件挂载时加载模型数据
    loadAllModels()

    // 处理输入变化，生成搜索建议
    const handleInputChange = () => {
      console.log('Input changed:', searchQuery.value)
      
      if (!searchQuery.value.trim()) {
        searchSuggestions.value = []
        return
      }
      
      // 生成搜索建议（最多5个）
      const searchLower = searchQuery.value.toLowerCase().trim()
      const suggestions = allModels.value
        .filter(m => 
          m.model.toLowerCase().includes(searchLower) || 
          m.brand.toLowerCase().includes(searchLower) ||
          m.fullName.toLowerCase().includes(searchLower)
        )
        .slice(0, 5)
        .map(m => ({
          id: m.id,
          brand: m.brand,
          model: m.model,
          fullName: m.fullName,
          label: m.fullName
        }))
      
      searchSuggestions.value = suggestions
      console.log('Generated suggestions:', suggestions)
    }

    // 处理搜索建议选择
    const handleSuggestionSelect = (suggestion) => {
      console.log('Selected suggestion:', suggestion)
      searchQuery.value = suggestion.fullName
      searchSuggestions.value = []
      
      // 直接导航到搜索结果页面，使用车型ID
      router.push({
        path: '/search',
        query: { id: suggestion.id, q: suggestion.fullName }
      })
    }

    // 查找详细模型数据
    const findDetailedModelData = (brand, model) => {
      // 这里应该从数据库或API获取详细数据
      // 暂时返回模拟数据
      const fullData = {
        brand: brand,
        model: model,
        scale: '1:10',
        drive: '2WD/4WD',
        parts: {
          esc_type: 'Standard ESC',
          motor_size: 'Standard Motor',
          battery_type: 'Requires NiMH or LiPo Battery'
        },
        notes: 'This is a high-quality RC model.'
      }
      
      if (fullData) {
        return {
          type: 'local_data',
          brand: fullData.brand,
          model: fullData.model,
          scale: fullData.scale,
          drive: fullData.drive,
          battery: fullData.parts?.battery_type || 'Requires NiMH or LiPo Battery',
          speed: 'Depends on battery configuration',
          description: fullData.notes || 'This is a high-quality RC model.'
        };
      }
      
      return null;
    }
    
    const handleSearch = async () => {
      console.log('Searching for model:', searchQuery.value)

      if (!searchQuery.value.trim()) {
        console.log('Please enter a model name')
        return
      }

      // 查找匹配的车型
      const searchLower = searchQuery.value.toLowerCase().trim()
      const matchedModel = allModels.value.find(m => 
        m.model.toLowerCase().includes(searchLower) || 
        m.brand.toLowerCase().includes(searchLower) ||
        m.fullName.toLowerCase().includes(searchLower)
      )

      // 导航到搜索结果页面 - 只允许配置中的车型
      if (matchedModel) {
        router.push({
          path: '/search',
          query: { id: matchedModel.id, q: matchedModel.fullName }
        })
      } else {
        // 如果没有找到匹配的车型，显示错误提示
        message.error('Please select a valid model from the suggestions list')
        searchQuery.value = ''
        searchSuggestions.value = []
      }
    }

    const setSearchQuery = (model) => {
      searchQuery.value = model
    }

    // Handle click outside to hide dropdown
    const handleClickOutside = () => {
      if (searchSuggestions.value.length > 0) {
        searchSuggestions.value = []
      }
    }

    // Handle input blur - navigate to search results when user leaves the input field
    const handleInputBlur = () => {
      // 只有当用户输入了内容且没有选择下拉建议时才导航到搜索结果页面
      if (searchQuery.value.trim() && searchSuggestions.value.length === 0) {
        // 查找匹配的车型
        const searchLower = searchQuery.value.toLowerCase().trim()
        const matchedModel = allModels.value.find(m => 
          m.model.toLowerCase().includes(searchLower) || 
          m.brand.toLowerCase().includes(searchLower) ||
          m.fullName.toLowerCase().includes(searchLower)
        )

        // 导航到搜索结果页面 - 只允许配置中的车型
        if (matchedModel) {
          router.push({
            path: '/search',
            query: { id: matchedModel.id, q: matchedModel.fullName }
          })
        } else {
          // 如果没有找到匹配的车型，显示错误提示
          message.error('Please select a valid model from the suggestions list')
          searchQuery.value = ''
          searchSuggestions.value = []
        }
      }
    }

    // 测试路由跳转函数
    const testRoute = () => {
      console.log('测试路由跳转函数被调用')
      router.push({
        path: '/search',
        query: { q: '测试搜索' }
      })
    }

    return {
      searchQuery,
      searchResults,
      loading,
      hasSearched,
      searchSuggestions,
      showCreateForm,
      handleSearch,
      handleInputChange,
      handleSuggestionSelect,
      handleClickOutside,
      handleInputBlur,
      testRoute
    }
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
}

.search-button {
  height: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: var(--radius-lg);
  padding: 0 2rem;
  white-space: nowrap;
}

.create-button {
  height: 50px;
  font-size: 1rem;
  border-radius: var(--radius-lg);
  padding: 0 1.5rem;
  white-space: nowrap;
}

/* Pulse hover effect */
.pulse-hover {
  transition: all 0.3s ease;
}

.pulse-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(25, 118, 210, 0.4);
}

/* Footer */
.footer {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
  border-top: 1px solid var(--bg-tertiary);
}

/* 确保下拉建议框的样式正确 */
:deep(.n-dropdown-menu) {
  max-height: 300px;
  overflow-y: auto;
}

:deep(.n-dropdown-option) {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

:deep(.n-dropdown-option:hover) {
  background-color: var(--bg-tertiary);
}
</style>