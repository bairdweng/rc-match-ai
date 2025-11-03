<template>
  <n-modal v-model:show="visible" :mask-closable="true">
    <n-card
      style="width: 500px; max-width: 90vw;"
      title="Add Upgrade Record"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="Model" path="model">
          <n-input
            :value="formData.model"
            placeholder="Selected model"
            readonly
            disabled
          />
        </n-form-item>

        <n-form-item label="Part Name" path="part">
          <n-input
            v-model:value="formData.part"
            placeholder="e.g., Aluminum Shock Towers"
            clearable
          />
        </n-form-item>

        <n-form-item label="Upgrade Specification" path="upgrade_spec">
          <n-input
            v-model:value="formData.upgrade_spec"
            placeholder="e.g., GPM Racing Aluminum Upgrade"
            clearable
          />
        </n-form-item>

        <n-form-item label="Reason for Upgrade" path="reason">
          <n-input
            v-model:value="formData.reason"
            type="textarea"
            placeholder="Describe why this upgrade is beneficial..."
            :autosize="{ minRows: 2, maxRows: 4 }"
            clearable
          />
        </n-form-item>

        <n-form-item label="Difficulty Level (1-5)" path="difficulty">
          <n-slider
            v-model:value="formData.difficulty"
            :min="1"
            :max="5"
            :step="1"
            :marks="{1: '1', 2: '2', 3: '3', 4: '4', 5: '5'}"
          />
          <div class="difficulty-display">
            <span class="stars">
              <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= formData.difficulty }">
                ★
              </span>
            </span>
            <span class="level">Level {{ formData.difficulty }}/5</span>
          </div>
        </n-form-item>

        <n-form-item label="Source URL (Optional)" path="source">
          <n-input
            v-model:value="formData.source"
            placeholder="https://example.com/upgrade-guide"
            clearable
          />
        </n-form-item>

        <n-form-item label="Your Name (Optional)" path="submitter">
          <n-input
            v-model:value="formData.submitter"
            placeholder="Anonymous if left blank"
            clearable
          />
        </n-form-item>
      </n-form>

      <template #action>
        <div class="form-actions">
          <n-button @click="close">Cancel</n-button>
          <n-button type="primary" @click="submit" :loading="submitting">
            Submit Upgrade
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script>
import { defineComponent, ref, reactive, watch } from 'vue'
import { NModal, NCard, NForm, NFormItem, NInput, NSlider, NButton, useMessage } from 'naive-ui'

export default defineComponent({
  name: 'AddUpgradeForm',
  components: {
    NModal,
    NCard,
    NForm,
    NFormItem,
    NInput,
    NSlider,
    NButton
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modelName: {
      type: String,
      default: ''
    },
    modelId: {
      type: Number,
      default: null
    }
  },
  emits: ['update:visible', 'submitted'],
  setup(props, { emit }) {
    const formRef = ref(null)
    const submitting = ref(false)
    const message = useMessage()
    
    const formData = reactive({
      part: '',
      upgrade_spec: '',
      reason: '',
      difficulty: 3,
      source: '',
      submitter: '',
      model: props.modelName,
      approved: false,
      timestamp: new Date().toISOString()
    })

    const rules = {
      part: {
        required: true,
        message: 'Please enter the part name',
        trigger: ['input', 'blur']
      },
      upgrade_spec: {
        required: true,
        message: 'Please enter the upgrade specification',
        trigger: ['input', 'blur']
      },
      reason: {
        required: true,
        message: 'Please describe the reason for this upgrade',
        trigger: ['input', 'blur']
      },
      difficulty: {
        required: true,
        validator: (rule, value) => {
          return value >= 1 && value <= 5
        },
        message: 'Please select a difficulty level between 1 and 5',
        trigger: ['input', 'blur']
      }
    }

    const submit = async () => {
      try {
        await formRef.value?.validate()
        submitting.value = true
        
        // 构建提交URL - 使用车型ID
        const submitUrl = `https://script.google.com/macros/s/AKfycbwRZzDYt_1K3oga0k7Bbu8QvdHTF-p4jEzgsMJzhYJva3G6431sf0BNPT0_vDl19pxv/exec?` + 
          `id=${encodeURIComponent(props.modelId || '')}&` +
          `model=${encodeURIComponent(formData.model)}&` +
          `part=${encodeURIComponent(formData.part)}&` +
          `upgrade_spec=${encodeURIComponent(formData.upgrade_spec)}&` +
          `reason=${encodeURIComponent(formData.reason || '')}&` +
          `difficulty=${encodeURIComponent(formData.difficulty || '3')}&` +
          `submitter=${encodeURIComponent(formData.submitter || 'Anonymous')}&` +
          `source=${encodeURIComponent(formData.source || 'web')}`
        
        console.log('正在提交数据:', submitUrl)
        
        const response = await fetch(submitUrl)
        const result = await response.json()
        
        console.log('提交响应:', result)
        
        if (result.status === 'success') {
          // 创建新记录（包含API返回的信息）
          const newRecord = {
            id: result.debug.rowWritten || Date.now(),
            model: formData.model,
            part: formData.part,
            upgrade_spec: formData.upgrade_spec,
            reason: formData.reason || '',
            difficulty: parseInt(formData.difficulty) || 3,
            submitter: formData.submitter || 'Anonymous',
            approved: false,
            timestamp: new Date().toISOString(),
            source: formData.source || 'web'
          }
          
          console.log('提交成功，新记录:', newRecord)
          
          // 重置表单
          Object.assign(formData, {
            part: '',
            upgrade_spec: '',
            reason: '',
            difficulty: 3,
            source: '',
            submitter: '',
            model: props.modelName,
            approved: false,
            timestamp: new Date().toISOString()
          })
          
          // Emit events
          emit('submitted', newRecord)
          emit('update:visible', false)
        } else {
          throw new Error(result.message || 'Submission failed')
        }
        
      } catch (errors) {
        console.error('Submission failed:', errors)
        message.error('Submission failed, please try again: ' + errors.message)
      } finally {
        submitting.value = false
      }
    }

    const close = () => {
      emit('update:visible', false)
    }

    // 监听modelName变化，更新formData.model
    watch(() => props.modelName, (newModelName) => {
      formData.model = newModelName
    })

    return {
      formRef,
      formData,
      rules,
      submitting,
      submit,
      close
    }
  }
})
</script>

<style scoped>
.difficulty-display {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 16px;
}

.star.active {
  color: #f39c12;
}

.level {
  color: #666;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions > * {
    width: 100%;
  }
}
</style>