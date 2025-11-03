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
        
        <div class="header-actions">
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
        </div>
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
            <p class="empty-text">Be the first to share upgrade experience for this model!</p>
            <n-button type="primary" @click="showAddFormModal = true">
              Add First Upgrade Record
            </n-button>
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

    <AddUpgradeForm
      :model-name="currentModel?.fullName || searchQuery"
      :model-id="currentModel?.id"
      :visible="showAddFormModal"
      @update:visible="showAddFormModal = false"
      @submitted="handleNewRecord"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NIcon, NSpin, NEmpty, NTag, useMessage } from 'naive-ui'
import UpgradeRecordCard from './UpgradeRecordCard.vue'
import UpgradeRecordDetail from './UpgradeRecordDetail.vue'
import AddUpgradeForm from './AddUpgradeForm.vue'

export default defineComponent({
  name: 'SearchResults',
  components: {
    NButton,
    NIcon,
    NSpin,
    NEmpty,
    NTag,
    UpgradeRecordCard,
    UpgradeRecordDetail,
    AddUpgradeForm
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
    const showAddFormModal = ref(false)
    const selectedRecord = ref(null)

    // 导入车型数据
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

    // 加载升级记录
    const loadUpgradeRecords = async (modelName) => {
      loading.value = true
      
      try {
        // 获取当前车型的ID
        const modelId = currentModel.value?.id || ''
        
        if (!modelId) {
          console.error('无法获取车型ID')
          upgradeRecords.value = []
          loading.value = false
          return
        }
        
        // 调用Google Apps Script API进行搜索 - 只使用ID
        const searchUrl = `https://script.google.com/macros/s/AKfycbwRZzDYt_1K3oga0k7Bbu8QvdHTF-p4jEzgsMJzhYJva3G6431sf0BNPT0_vDl19pxv/exec?action=search&id=${encodeURIComponent(modelId)}`
        
        console.log('正在搜索升级记录:', searchUrl)
        
        const response = await fetch(searchUrl)
        const result = await response.json()
        
        console.log('搜索响应:', result)
        
        if (result.status === 'success') {
          // 转换Google表格数据为前端格式，并只显示已审核通过的记录
          upgradeRecords.value = result.results
            .map(item => ({
              id: item.rowNumber,
              model: item.data.model,
              part: item.data.part,
              upgrade_spec: item.data.upgrade_spec,
              reason: item.data.reason,
              difficulty: parseInt(item.data.difficulty) || 3,
              submitter: item.data.submitter || 'Anonymous',
              approved: item.data.approved === 'TRUE' || item.data.approved === true,
              timestamp: item.data.timestamp,
              source: item.data.source
            }))
            .filter(record => record.approved) // 只显示已审核通过的记录
          
          console.log('转换后的升级记录 (只显示已审核的):', upgradeRecords.value)
        } else {
          console.error('搜索失败:', result.message)
          upgradeRecords.value = []
        }
        
      } catch (error) {
        console.error('Error loading升级记录:', error)
        // API调用失败，显示空结果
        upgradeRecords.value = []
        message.error('搜索失败，请检查网络连接后重试')
      } finally {
        loading.value = false
      }
    }

    // 显示详情弹窗
    const showRecordDetail = (record) => {
      selectedRecord.value = record
      showDetailModal.value = true
    }

    // 处理新记录提交
    const handleNewRecord = (newRecord) => {
      // 显示确认提示而不是立即刷新页面
      console.log('New record submitted:', newRecord)
      
      // 显示确认消息
      message.success('Submission successful! Your upgrade record is under review and will be visible after approval.')
      
      // 关闭添加表单
      showAddFormModal.value = false
      
      // 注意：不立即刷新页面，等待管理员审核
      // 用户可以在审核通过后手动刷新页面查看记录
    }

    onMounted(() => {
      // 从路由参数获取车型ID
      if (route.query.id) {
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
            drive: foundModel.drive
          }
          // 加载该车型的升级记录
          loadUpgradeRecords(foundModel.fullName)
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
            drive: foundModel.drive
          }
          // 加载该车型的升级记录
          loadUpgradeRecords(foundModel.fullName)
        }
      }
    })

    return {
      searchQuery,
      currentModel,
      upgradeRecords,
      loading,
      showDetailModal,
      showAddFormModal,
      selectedRecord,
      router,
      showRecordDetail,
      handleNewRecord
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