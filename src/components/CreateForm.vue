<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- 模态框头部 -->
      <div class="modal-header">
        <h2 class="modal-title">Submit Upgrade Recommendation</h2>
        <button class="close-button" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- 表单内容 -->
      <div class="form-content">
        <div class="form-section">
          <h3 class="section-title">Model Information</h3>
          
          <div class="form-group">
            <label for="model" class="form-label">Model *</label>
            <n-input 
              id="model" 
              v-model:value="formData.model" 
              placeholder="e.g. Traxxas Slash 2WD" 
              class="form-input"
              :bordered="false"
              required
            />
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Part Information</h3>
          
          <div class="form-group">
            <label for="part" class="form-label">Part *</label>
            <n-input 
              id="part" 
              v-model:value="formData.part" 
              placeholder="e.g. shock absorber kit" 
              class="form-input"
              :bordered="false"
              required
            />
          </div>

          <div class="form-group">
            <label for="upgrade_spec" class="form-label">Upgrade Specification *</label>
            <n-input 
              id="upgrade_spec" 
              v-model:value="formData.upgrade_spec" 
              placeholder="e.g. 12mm aluminum oil-filled shocks" 
              class="form-input"
              :bordered="false"
              required
            />
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Upgrade Details</h3>
          
          <div class="form-group">
            <label for="reason" class="form-label">Reason for Upgrade *</label>
            <n-input 
              type="textarea" 
              id="reason" 
              v-model:value="formData.reason" 
              placeholder="e.g. Improves jump handling and off-road stability" 
              class="form-textarea"
              :bordered="false"
              :rows="3"
              required
            />
          </div>

          <div class="form-group">
            <label for="difficulty" class="form-label">Difficulty Level</label>
            <n-input 
              id="difficulty" 
              v-model:value="formData.difficulty" 
              placeholder="e.g. light mod, moderate mod, fits stock" 
              class="form-input"
              :bordered="false"
            />
          </div>

          <div class="form-group">
            <label for="submitter" class="form-label">Submitter Name</label>
            <n-input 
              id="submitter" 
              v-model:value="formData.submitter" 
              placeholder="Your name" 
              class="form-input"
              :bordered="false"
            />
          </div>

          <div class="form-group">
            <label for="source" class="form-label">Source</label>
            <n-input 
              id="source" 
              v-model:value="formData.source" 
              placeholder="e.g. Personal experience, Manufacturer recommendation" 
              class="form-input"
              :bordered="false"
            />
          </div>
        </div>
      </div>

      <!-- 表单操作按钮 -->
      <div class="form-actions">
        <n-button class="cancel-button" @click="closeModal">Cancel</n-button>
        <n-button type="primary" class="submit-button" @click="handleSubmit">Submit Recommendation</n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { NInput, NButton, useMessage } from 'naive-ui'

// 定义props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show'])
const message = useMessage()

// 调试：检查组件挂载状态
onMounted(() => {
  console.log('CreateForm component mounted, props.show:', props.show)
})

// 表单数据 - 与Google Apps Script字段完全匹配
const formData = reactive({
  model: '',        // data.model
  part: '',         // data.part
  upgrade_spec: '', // data.upgrade_spec
  reason: '',       // data.reason
  difficulty: '',   // data.difficulty
  submitter: '',    // data.submitter
  source: ''        // data.source
})

// 关闭模态框
const closeModal = () => {
  emit('update:show', false)
}

// 处理表单提交
const handleSubmit = async () => {
  // 验证必填字段
  if (!formData.model || !formData.part || !formData.upgrade_spec || !formData.reason) {
    message.error('Please fill in all required fields (marked with *)')
    return
  }

  try {
    // 准备提交数据 - 与Google Apps Script字段完全匹配
    const submitData = {
      model: formData.model || "",
      part: formData.part || "",
      upgrade_spec: formData.upgrade_spec || "",
      reason: formData.reason || "",
      difficulty: formData.difficulty || "",
      submitter: formData.submitter || "",
      source: formData.source || ""
    }

    // 方法1: 使用GET请求（直接匹配Google Apps Script配置）
    try {
      const params = new URLSearchParams();
      Object.keys(submitData).forEach(key => {
        params.append(key, submitData[key]);
      });
      
      const response = await fetch(`https://script.google.com/macros/s/AKfycbwRZzDYt_1K3oga0k7Bbu8QvdHTF-p4jEzgsMJzhYJva3G6431sf0BNPT0_vDl19pxv/exec?${params.toString()}`, {
        method: 'GET',
        mode: 'cors'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          message.success('Upgrade recommendation submitted successfully!')
          closeModal()
          // 重置表单
          Object.keys(formData).forEach(key => {
            formData[key] = ''
          })
          return
        } else {
          throw new Error(result.message || 'Submission failed')
        }
      }
    } catch (error) {
      console.log('GET method failed:', error);
      throw new Error('Submission failed')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    
    // 如果方法1失败，尝试方法2: 使用JSONP或GET请求
    try {
      const params = new URLSearchParams()
      Object.keys(submitData).forEach(key => {
        params.append(key, submitData[key])
      })
      
      // 使用GET请求作为备选方案
      await fetch(`https://script.google.com/macros/s/AKfycbwRZzDYt_1K3oga0k7Bbu8QvdHTF-p4jEzgsMJzhYJva3G6431sf0BNPT0_vDl19pxv/exec?${params.toString()}`)
      
      message.success('Upgrade recommendation submitted successfully!')
      closeModal()
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
    } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError)
        
        // 方法3: 本地存储作为最后备选
        try {
          const localData = {
            timestamp: new Date().toISOString(),
            ...submitData
          }
          
          // 保存到localStorage
          const existingData = JSON.parse(localStorage.getItem('upgradeRecommendations') || '[]')
          existingData.push(localData)
          localStorage.setItem('upgradeRecommendations', JSON.stringify(existingData))
          
          message.success('Recommendation saved locally (Google Apps Script not available)')
          closeModal()
          Object.keys(formData).forEach(key => {
            formData[key] = ''
          })
        } catch (localError) {
          console.error('Local storage also failed:', localError)
          message.error('All submission methods failed. Please check your Google Apps Script configuration.')
        }
      }
    }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: var(--bg-primary);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--bg-tertiary);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.form-content {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--bg-tertiary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.form-input {
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid var(--bg-tertiary);
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: var(--accent-color);
  outline: none;
}

.form-textarea {
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid var(--bg-tertiary);
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s ease;
}

.form-textarea:focus {
  border-color: var(--accent-color);
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--bg-tertiary);
}

.cancel-button {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--bg-tertiary);
}

.cancel-button:hover {
  background-color: var(--bg-tertiary);
}

.submit-button {
  background-color: var(--accent-color);
  color: white;
}

.submit-button:hover {
  background-color: var(--accent-hover);
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .form-content {
    padding: 1rem;
  }
  
  .form-actions {
    padding: 1rem;
  }
}
</style>