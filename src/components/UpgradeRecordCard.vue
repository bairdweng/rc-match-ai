<template>
  <div class="upgrade-record-card" @click="showDetail">
    <div class="card-header">
      <div class="part-name">{{ record.part }}</div>
      <div class="difficulty-rating">
        <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= record.difficulty }">
          ★
        </span>
      </div>
    </div>
    
    <div class="upgrade-spec">{{ record.upgrade_spec }}</div>
    
    <div class="upgrade-reason">{{ record.reason }}</div>
    
    <div class="card-footer">
      <div class="submitter-info">
        <span class="submitter">{{ record.submitter || 'Anonymous' }}</span>
        <span class="status-badge" :class="{ approved: record.approved, pending: !record.approved }">
          {{ record.approved ? '✅ Verified' : '⏳ Pending Review' }}
        </span>
      </div>
      <div class="timestamp">{{ formatTimestamp(record.timestamp) }}</div>
    </div>
    
    <div class="action-buttons">
      <n-button 
        size="small" 
        type="primary" 
        text 
        @click.stop="showDetail"
        class="detail-btn"
      >
        View Details
      </n-button>
      <n-button 
        v-if="record.source" 
        size="small" 
        type="info" 
        text 
        @click.stop="openSource"
        class="source-btn"
      >
        Source
      </n-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { NButton } from 'naive-ui'

export default defineComponent({
  name: 'UpgradeRecordCard',
  components: {
    NButton
  },
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatTimestamp(timestamp) {
      if (!timestamp) return 'Unknown'
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    },
    
    showDetail() {
      this.$emit('show-detail', this.record)
    },
    
    openSource() {
      if (this.record.source) {
        window.open(this.record.source, '_blank')
      }
    }
  }
})
</script>

<style scoped>
.upgrade-record-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.upgrade-record-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.part-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.2;
  flex: 1;
  margin-right: 12px;
}

.difficulty-rating {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 14px;
}

.star.active {
  color: #f39c12;
}

.upgrade-spec {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
  line-height: 1.4;
}

.upgrade-reason {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.submitter-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.submitter {
  font-size: 12px;
  color: #666;
}

.status-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: 500;
}

.status-badge.approved {
  background: #e8f5e8;
  color: #27ae60;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.timestamp {
  font-size: 11px;
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.detail-btn, .source-btn {
  font-size: 12px;
}

/* Responsive design */
@media (max-width: 768px) {
  .upgrade-record-card {
    padding: 12px;
  }
  
  .part-name {
    font-size: 16px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .difficulty-rating {
    align-self: flex-start;
  }
}
</style>