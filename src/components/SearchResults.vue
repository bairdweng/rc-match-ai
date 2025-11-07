<template>
  <div class="upgrade-results-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="back-section">
          <n-button type="primary" @click="router.push('/')" class="back-button">
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </n-icon>
            </template>
            Back to Search
          </n-button>
        </div>
        
        <div class="model-info">
          <h1 class="model-name">{{ currentModel?.model || searchQuery }}</h1>
          <div class="model-tags">
            <n-tag v-if="currentModel?.scale" type="info" size="small">{{ currentModel.scale }}</n-tag>
            <n-tag v-if="currentModel?.drive" type="info" size="small">{{ currentModel.drive }}</n-tag>
            <n-tag type="info" size="small">{{ upgradeRecords.length }} upgrade records</n-tag>
          </div>
        </div>
        
        <!-- 品牌官网跳转按钮 -->
        <div class="brand-website-section" v-if="currentModel?.url">
          <n-button 
            type="primary" 
            size="large" 
            @click="openBrandWebsite"
            class="brand-website-btn"
            ghost
          >
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </n-icon>
            </template>
            Visit {{ currentModel?.brand }} Website
          </n-button>
        </div>
        
        <!-- 隐藏提交表单入口 -->
        <!-- <div class="header-actions">
          <n-button 
            type="primary" 
            size="large" 
            @click="showAddFormModal = true"
            class="add-record-btn"
          >
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </n-icon>
            </template>
            Add Upgrade Record
          </n-button>
        </div> -->
      </div>
    </div>

    <!-- Upgrade Records Grid -->
    <div class="upgrade-records-container">
      <div v-if="loading" class="loading-state">
        <n-spin size="large" />
        <p>Loading upgrade records...</p>
      </div>
      
      <div v-else-if="upgradeRecords.length === 0" class="empty-state">
        <n-empty description="No upgrade records found">
          <template #extra>
            <p class="empty-text">No upgrade parts available for this model yet.</p>
          </template>
        </n-empty>
      </div>
      
      <div v-else class="records-grid">
        <UpgradeRecordCard
          v-for="record in upgradeRecords"
          :key="record.id || record.timestamp"
          :record="record"
          @show-detail="showRecordDetail"
        />
      </div>
    </div>



    <!-- Modals -->
    <UpgradeRecordDetail
      v-if="selectedRecord"
      :record="selectedRecord"
      :visible="showDetailModal"
      @update:visible="showDetailModal = false"
    />

    <!-- 隐藏提交表单 -->
    <!-- <AddUpgradeForm
      :model-name="currentModel?.fullName || searchQuery"
      :model-id="currentModel?.id"
      :visible="showAddFormModal"
      @update:visible="showAddFormModal = false"
      @submitted="handleNewRecord"
    /> -->
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NIcon, NSpin, NEmpty, NTag, useMessage } from 'naive-ui'
import { queryHotPartsFromDatabase } from '../utils/databaseApi.js'
import UpgradeRecordCard from './UpgradeRecordCard.vue'
import UpgradeRecordDetail from './UpgradeRecordDetail.vue'

// 导入车型数据
import configData from '../data/config.json'

export default defineComponent({
  name: 'SearchResults',
  components: {
    NButton,
    NIcon,
    NSpin,
    NEmpty,
    NTag,
    UpgradeRecordCard,
    UpgradeRecordDetail
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const message = useMessage()
    const searchQuery = ref('')
    const currentModel = ref(null)
    const upgradeRecords = ref([])
    const loading = ref(false)
    const showDetailModal = ref(false)
    const selectedRecord = ref(null)

    // 车型数据
    const allModels = configData.models



    // 根据ID查找车型信息
    const findModelById = (id) => {
      return allModels.find(m => m.id === parseInt(id))
    }

    // 根据名称查找车型信息（用于兼容性）
    const findModelByName = (query) => {
      const searchLower = query.toLowerCase().trim()
      return allModels.find(m => 
        m.fullName.toLowerCase().includes(searchLower) || 
        m.model.toLowerCase().includes(searchLower) || 
        m.brand.toLowerCase().includes(searchLower)
      )
    }

    // 根据品牌和车型名称查找车型信息
    const findModelByBrandAndModel = (brand, model) => {
      const brandLower = brand.toLowerCase().trim()
      const modelLower = model.toLowerCase().trim()
      
      return allModels.find(m => 
        m.brand.toLowerCase().includes(brandLower) && 
        (m.model.toLowerCase().includes(modelLower) || 
         m.fullName.toLowerCase().includes(modelLower))
      )
    }

    // 加载升级记录 - 使用本地数据库数据
    const loadUpgradeRecords = async (modelId) => {
      loading.value = true
      
      try {
        if (!modelId) {
          console.error('无法获取车型ID')
          upgradeRecords.value = []
          loading.value = false
          return
        }
        
        // 从SQLite数据库查询配件数据
        const hotPartsData = await queryHotPartsFromDatabase(parseInt(modelId))
        
        // 转换为前端格式
        upgradeRecords.value = hotPartsData.map(part => ({
          id: part.id,
          model: currentModel.value?.fullName || '',
          part: part.part,
          upgrade_spec: part.upgrade_spec,
          reason: part.reason,
          difficulty: part.difficulty,
          submitter: part.submitter,
          approved: part.approved === true || part.approved === 1,
          timestamp: part.timestamp,
          source: part.source
        }))
        
        console.log('加载的配件数据:', upgradeRecords.value)
        
      } catch (error) {
        console.error('Error loading配件数据:', error)
        upgradeRecords.value = []
        message.error('加载配件数据失败')
      } finally {
        loading.value = false
      }
    }

    // 显示详情弹窗
    const showRecordDetail = (record) => {
      selectedRecord.value = record
      showDetailModal.value = true
    }

    // 打开品牌官网
    const openBrandWebsite = () => {
      if (currentModel.value?.url) {
        window.open(currentModel.value.url, '_blank', 'noopener,noreferrer')
      }
    }

    // 处理新记录提交（已禁用）
    // const handleNewRecord = (newRecord) => {
    //   // 显示确认提示而不是立即刷新页面
    //   console.log('New record submitted:', newRecord)
    //   
    //   // 显示确认消息
    //   message.success('Submission successful! Your upgrade record is under review and will be visible after approval.')
    //   
    //   // 关闭添加表单
    //   showAddFormModal.value = false
    //   
    //   // 注意：不立即刷新页面，等待管理员审核
    //   // 用户可以在审核通过后手动刷新页面查看记录
    // }

    onMounted(() => {
      // 处理语义化路由参数：/search/:brand/:model
      if (route.params.brand && route.params.model) {
        const brand = route.params.brand.replace(/-/g, ' ')
        const model = route.params.model.replace(/-/g, ' ')
        
        // 根据品牌和车型查找车型
        const foundModel = findModelByBrandAndModel(brand, model)
        if (foundModel) {
          searchQuery.value = foundModel.fullName
          currentModel.value = {
            id: foundModel.id,
            brand: foundModel.brand,
            model: foundModel.model,
            fullName: foundModel.fullName,
            scale: foundModel.scale,
            drive: foundModel.drive,
            url: foundModel.url
          }
          // 加载该车型的升级记录
          loadUpgradeRecords(foundModel.id)
        }
      }
      // 从路由参数获取车型ID
      else if (route.query.id) {
        // 根据ID查找车型
        const foundModel = findModelById(route.query.id)
        if (foundModel) {
          searchQuery.value = foundModel.fullName
          currentModel.value = {
            id: foundModel.id,
            brand: foundModel.brand,
            model: foundModel.model,
            fullName: foundModel.fullName,
            scale: foundModel.scale,
            drive: foundModel.drive,
            url: foundModel.url
          }
          // 加载该车型的升级记录
          loadUpgradeRecords(foundModel.id)
        }
      } else if (route.query.q) {
        // 向后兼容：处理旧的名称查询
        const decodedQuery = route.query.q.replace(/\+/g, ' ').replace(/-/g, ' ')
        searchQuery.value = decodedQuery
        // 查找车型
        const foundModel = findModelByName(decodedQuery)
        if (foundModel) {
          currentModel.value = {
            id: foundModel.id,
            brand: foundModel.brand,
            model: foundModel.model,
            fullName: foundModel.fullName,
            scale: foundModel.scale,
            drive: foundModel.drive,
            url: foundModel.url
          }
          // 加载该车型的升级记录
          loadUpgradeRecords(foundModel.id)
        }
      }
    })

    return {
      searchQuery,
      currentModel,
      upgradeRecords,
      loading,
      showDetailModal,
      selectedRecord,
      router,
      showRecordDetail,
      openBrandWebsite
    }
  }
})
</script>

<style scoped>
.upgrade-results-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  color: #ffffff;
}

/* Page Header with Glassmorphism Effect */
.page-header {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.back-section {
  flex-shrink: 0;
}

.back-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.model-info {
  flex: 1;
  text-align: center;
}

.model-name {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 15px 0;
  text-shadow: 0 2px 10px rgba(0, 180, 219, 0.3);
}

.model-tags {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.model-tags .n-tag {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.header-actions {
  flex-shrink: 0;
}

.add-record-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 15px;
  padding: 15px 30px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(240, 147, 251, 0.3);
}

.add-record-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(240, 147, 251, 0.5);
}

/* 品牌官网按钮样式 */
.brand-website-section {
  flex-shrink: 0;
}

.brand-website-btn {
  background: linear-gradient(135deg, #00b09b 0%, #96c93d 100%);
  border: none;
  border-radius: 15px;
  padding: 15px 30px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 176, 155, 0.3);
  color: white !important;
}

.brand-website-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 176, 155, 0.5);
  background: linear-gradient(135deg, #00a08b 0%, #8bb832 100%);
}

/* Upgrade Records Container */
.upgrade-records-container {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px;
  min-height: 400px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #ffffff;
}

.loading-state p {
  margin-top: 20px;
  font-size: 1.2rem;
  opacity: 0.8;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state .n-empty__description {
  color: #ffffff !important;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.empty-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 25px;
}

.empty-state .n-button {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.empty-state .n-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
}

/* Records Grid */
.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 25px;
}

/* Responsive Design */
 @media (max-width: 768px) {
   .upgrade-results-page {
     padding: 15px;
   }
   
   .page-header {
     padding: 20px;
     border-radius: 15px;
   }
   
   .header-content {
     flex-direction: column;
     text-align: center;
     gap: 20px;
   }
   
   .model-name {
     font-size: 2rem;
   }
   
   .upgrade-records-container {
     padding: 20px;
     border-radius: 15px;
   }
   
   .records-grid {
     grid-template-columns: 1fr;
     gap: 20px;
   }
 }

/* Animation for page load */
.upgrade-results-page {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar Styling */
.upgrade-results-page::-webkit-scrollbar {
  width: 8px;
}

.upgrade-results-page::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.upgrade-results-page::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.upgrade-results-page::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
</style>