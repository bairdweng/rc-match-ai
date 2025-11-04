<template>
  <n-modal :show="localVisible" :mask-closable="true" @update:show="handleClose">
    <n-card
      style="width: 600px; max-width: 90vw;"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header>
        <div class="modal-header">
          <h3>{{ record.part }}</h3>
          <div class="header-actions">
            <n-button 
              v-if="record.source" 
              size="small" 
              type="info" 
              @click="openSource"
            >
              View Source
            </n-button>
            <n-button size="small" @click="close">
              Close
            </n-button>
          </div>
        </div>
      </template>

      <div class="modal-content">
        <div class="info-section">
          <div class="info-row">
            <span class="label">Model:</span>
            <span class="value">{{ record.model }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Upgrade Specification:</span>
            <span class="value">{{ record.upgrade_spec }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Reason for Upgrade:</span>
            <span class="value">{{ record.reason }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Difficulty Level:</span>
            <span class="value">
              <span class="difficulty-stars">
                <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= record.difficulty }">
                  ★
                </span>
                <span class="difficulty-text">(Level {{ record.difficulty }}/5)</span>
              </span>
            </span>
          </div>
          
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value">
              <n-tag :type="isApproved(record.approved) ? 'success' : 'warning'">
                {{ isApproved(record.approved) ? '✅ Verified' : '⏳ Pending Review' }}
              </n-tag>
            </span>
          </div>
          
          <div class="info-row">
            <span class="label">Submitted by:</span>
            <span class="value">{{ record.submitter || 'Anonymous' }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Submitted on:</span>
            <span class="value">{{ formatTimestamp(record.timestamp) }}</span>
          </div>
          
          <div v-if="record.source" class="info-row">
            <span class="label">Source URL:</span>
            <span class="value">
              <a :href="record.source" target="_blank" class="source-link">
                {{ record.source }}
              </a>
            </span>
          </div>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { NModal, NCard, NButton, NTag } from 'naive-ui'

export default defineComponent({
  name: 'UpgradeRecordDetail',
  components: {
    NModal,
    NCard,
    NButton,
    NTag
  },
  props: {
    record: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const localVisible = ref(props.visible)
    
    // Watch for changes to the prop and update local value
    watch(() => props.visible, (newValue) => {
      localVisible.value = newValue
    })
    
    // Handle modal close event
    const handleClose = () => {
      emit('update:visible', false)
    }
    
    return {
      localVisible,
      handleClose
    }
  },
  methods: {
    formatTimestamp(timestamp) {
      if (!timestamp) return 'Unknown'
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    openSource() {
      if (this.record.source) {
        window.open(this.record.source, '_blank')
      }
    },
    
    close() {
      this.handleClose()
    },
    
    isApproved(approvedValue) {
      // Handle both boolean true/false and numeric 1/0 values
      return approvedValue === true || approvedValue === 1
    }
  }
})
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.modal-content {
  padding: 8px 0;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.label {
  font-weight: 600;
  color: #555;
  min-width: 150px;
  font-size: 14px;
}

.value {
  flex: 1;
  color: #333;
  font-size: 14px;
  line-height: 1.4;
}

.difficulty-stars {
  display: flex;
  align-items: center;
  gap: 8px;
}

.star {
  color: #ddd;
  font-size: 16px;
}

.star.active {
  color: #f39c12;
}

.difficulty-text {
  color: #666;
  font-size: 13px;
}

.source-link {
  color: #3498db;
  text-decoration: none;
  word-break: break-all;
}

.source-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .info-row {
    flex-direction: column;
    gap: 4px;
  }
  
  .label {
    min-width: auto;
  }
  
  .modal-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>