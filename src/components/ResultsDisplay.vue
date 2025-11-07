<template>
  <section class="results-section" v-if="hasResults || loading || (searched && !results.length)">
    <div class="results-header">
      <h2 class="section-title">Search Results</h2>
      <p v-if="hasResults" class="results-count">{{ results.length }} model(s) found</p>
    </div>
    
    <!-- Loading State -->
    <div class="loading-container" v-if="loading">
      <n-skeleton text :repeat="3" />
    </div>
    
    <!-- Results Grid -->
    <div class="results-grid" v-else-if="hasResults">
      <n-card
        v-for="(result, index) in results"
        :key="index"
        class="result-card tech-glow"
        :bordered="false"
        @click="navigateToModel(result)"
        style="cursor: pointer;"
      >
        <div class="result-content">
          <!-- Model Header -->
          <div class="model-header">
            <h3 class="brand-name">{{ result.brand }}</h3>
            <h2 class="model-name">{{ result.model }}</h2>
            <div class="model-basic-info">
              <span class="scale-info">Scale: {{ result.scale }}</span>
              <span class="drive-info">{{ result.drive }}</span>
            </div>
          </div>
          
          <!-- Model Details in Tables -->
          <div class="model-details">
            <!-- 动态生成所有表格组 -->
            <div 
              v-for="(groupData, groupName) in getTableGroups(result)" 
              :key="groupName"
              class="detail-group"
            >
              <h4 class="detail-title">{{ formatGroupTitle(groupName) }}</h4>
              
              <!-- 一级表格：显示基本字段 -->
              <n-table class="info-table" striped v-if="hasBasicFields(groupData)">
                <tbody>
                  <tr v-for="(value, key) in groupData" :key="key" v-if="!isObject(value)">
                    <td class="label">{{ formatLabel(key) }}</td>
                    <td class="value">{{ formatValue(value, key) }}</td>
                  </tr>
                </tbody>
              </n-table>
              
              <!-- 二级表格：显示嵌套对象 -->
              <div v-for="(subData, subKey) in groupData" :key="subKey" v-if="isObject(subData)">
                <h5 class="sub-group-title">{{ formatSubGroupTitle(subKey) }}</h5>
                <n-table class="info-table sub-table" striped>
                  <tbody>
                    <tr v-for="(value, key) in subData" :key="key">
                      <td class="label">{{ formatLabel(key) }}</td>
                      <td class="value">{{ formatValue(value, key) }}</td>
                    </tr>
                  </tbody>
                </n-table>
              </div>
            </div>
            
            <!-- Upgrade Options -->
            <div class="detail-group" v-if="result.upgrade_options">
              <h4 class="detail-title">Available Upgrades</h4>
              <div class="upgrades-grid">
                <n-tag 
                  v-for="(available, option) in result.upgrade_options" 
                  :key="option"
                  :type="available ? 'success' : 'default'"
                  class="upgrade-tag"
                >
                  {{ formatUpgradeOption(option) }}: {{ available ? 'Available' : 'Not Available' }}
                </n-tag>
              </div>
            </div>
            
            <!-- Notes -->
            <div class="detail-group" v-if="result.notes">
              <h4 class="detail-title">Notes</h4>
              <div class="notes-content">
                <p>{{ result.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </div>
    
    <!-- No Results -->
    <div class="no-results" v-else-if="searched && !results.length">
      <n-empty description="No matching models found" />
      <p class="no-results-hint">Try different keywords or check your spelling</p>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NSkeleton, NEmpty, NTable, NTag } from 'naive-ui'

export default {
  name: 'ResultsDisplay',
  components: {
    NCard,
    NSkeleton,
    NEmpty,
    NTable,
    NTag
  },
  props: {
    results: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    searched: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const router = useRouter()
    
    // 导航到车型详情页
    const navigateToModel = (model) => {
      // 生成语义化URL：/search/brand/model
      const brandSlug = model.brand.toLowerCase().replace(/\s+/g, '-')
      const modelSlug = model.model.toLowerCase().replace(/\s+/g, '-')
      
      router.push(`/search/${brandSlug}/${modelSlug}`)
    }
    const hasResults = computed(() => props.results && props.results.length > 0)
    
    const formatUpgradeOption = (option) => {
      const optionMap = {
        'metal_drivetrain': 'Metal Drivetrain',
        'aluminum_shocks': 'Aluminum Shocks',
        'upgraded_wheels': 'Upgraded Wheels',
        'brushless_motor': 'Brushless Motor'
      }
      return optionMap[option] || option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    // Check if a key is basic info (not nested object)
    const isBasicInfo = (key) => {
      const basicKeys = ['brand', 'model', 'scale', 'drive', 'fileName', 'label']
      return basicKeys.includes(key) && typeof props.results[0]?.[key] !== 'object'
    }

    // Check if value is an object
    const isObject = (value) => {
      return typeof value === 'object' && value !== null && !Array.isArray(value)
    }

    // Format field label from key
    const formatLabel = (key) => {
      // Remove common suffixes
      let formatted = key
        .replace(/_/g, ' ')
        .replace(/_mm$/, '')
        .replace(/_kg$/, '')
        .replace(/_g$/, '')
        .replace(/_s$/, '')
        .replace(/_deg$/, '')
        .replace(/_cm$/, '')
        .replace(/_teeth$/, '')
        .replace(/_type$/, '')
        .replace(/_size$/, '')
        .replace(/_length$/, '')
        .replace(/_width$/, '')
        .replace(/_height$/, '')
        .replace(/_diameter$/, '')
        .replace(/_clearance$/, '')
        .replace(/_weight$/, '')
        .replace(/_ratio$/, '')
        .replace(/_torque$/, '')
        .replace(/_speed$/, '')
        .replace(/_angle$/, '')
        .replace(/_offset$/, '')
        .replace(/_profile$/, '')
        .replace(/_pattern$/, '')
        .replace(/_material$/, '')
        .replace(/_connector$/, '')
        .replace(/_waterproof$/, '')
        .replace(/_kv$/, '')

      // Capitalize first letter of each word
      formatted = formatted.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // Special cases
      if (key === 'wheelbase_mm') return 'Wheelbase'
      if (key === 'ground_clearance_mm') return 'Ground Clearance'
      if (key === 'tire_outer_diameter') return 'Tire Diameter'
      if (key === 'tire_width_front') return 'Front Tire Width'
      if (key === 'tire_width_rear') return 'Rear Tire Width'
      if (key === 'shock_length_front_mm') return 'Front Shock Length'
      if (key === 'shock_length_rear_mm') return 'Rear Shock Length'
      if (key === 'pinion_gear_teeth') return 'Pinion Gear Teeth'
      if (key === 'spur_gear_teeth') return 'Spur Gear Teeth'
      if (key === 'battery_max_dimensions_mm') return 'Battery Max Dimensions'
      if (key === 'esc_type') return 'ESC Type'
      if (key === 'servo_type') return 'Servo Type'
      if (key === 'motor_size') return 'Motor Size'
      if (key === 'wheel_hex') return 'Wheel Hex'
      if (key === 'wheel_bearing') return 'Wheel Bearings'
      if (key === 'suspension_type') return 'Suspension Type'
      if (key === 'battery_type') return 'Battery Type'

      return formatted
    }

    // Format field value based on key
    const formatValue = (value, key) => {
      if (value === null || value === undefined) return 'N/A'
      
      // Add units based on key
      if (key.endsWith('_mm')) return `${value}mm`
      if (key.endsWith('_kg')) return `${value}kg`
      if (key.endsWith('_g')) return `${value}g`
      if (key.endsWith('_s')) return `${value}s`
      if (key.endsWith('_deg')) return `${value}°`
      if (key.endsWith('_cm')) return `${value}cm`
      if (key.endsWith('_teeth')) return `${value} teeth`
      if (key.endsWith('_kv')) return `${value}KV`
      
      // Handle boolean values
      if (typeof value === 'boolean') return value ? 'Yes' : 'No'
      
      return value
    }
    
    // 获取表格分组数据
    const getTableGroups = (result) => {
      const groups = {}
      
      // 基础信息组（顶级字段）
      const basicInfo = {}
      Object.keys(result).forEach(key => {
        if (!isObject(result[key]) && key !== 'upgrade_options' && key !== 'notes') {
          basicInfo[key] = result[key]
        }
      })
      if (Object.keys(basicInfo).length > 0) {
        groups['basic'] = basicInfo
      }
      
      // 其他对象组（dimensions, parts等）
      Object.keys(result).forEach(key => {
        if (isObject(result[key]) && key !== 'upgrade_options' && key !== 'notes') {
          groups[key] = result[key]
        }
      })
      
      return groups
    }
    
    // 格式化组标题
    const formatGroupTitle = (groupName) => {
      const titleMap = {
        'basic': 'Basic Information',
        'dimensions': 'Dimensions',
        'parts': 'Parts & Components'
      }
      return titleMap[groupName] || groupName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
    
    // 格式化子组标题
    const formatSubGroupTitle = (subKey) => {
      return subKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
    
    // 检查是否有基本字段
    const hasBasicFields = (groupData) => {
      return Object.keys(groupData).some(key => !isObject(groupData[key]))
    }
    
    return {
      hasResults,
      formatUpgradeOption,
      isBasicInfo,
      isObject,
      formatLabel,
      formatValue,
      getTableGroups,
      formatGroupTitle,
      formatSubGroupTitle,
      hasBasicFields,
      navigateToModel
    }
  }
}
</script>

<style scoped>
.results-section {
  margin-top: 2rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results-header {
  margin-bottom: 1.5rem;
}

.results-count {
  color: #aaa;
  margin-top: 0.5rem;
}

.loading-container {
  gap: 1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 2rem;
}

.result-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(0, 255, 255, 0.2) !important;
  backdrop-filter: blur(10px);
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3) !important;
  border-color: rgba(0, 255, 255, 0.4) !important;
}

.result-content {
  padding: 1.5rem;
}

.model-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-name {
  font-size: 1rem;
  color: #00ffcc;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.model-name {
  font-size: 1.75rem;
  margin: 0 0 1rem 0;
  color: #fff;
}

.model-basic-info {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  color: #aaa;
  font-size: 0.9rem;
}

.detail-group {
  margin-bottom: 2rem;
}

.detail-title {
  font-size: 1.1rem;
  color: #00ffcc;
  margin: 0 0 1rem 0;
  border-left: 3px solid #00ffcc;
  padding-left: 0.75rem;
}

.sub-group-title {
  font-size: 1rem;
  color: #66ccff;
  margin: 1rem 0 0.75rem 0;
  border-left: 2px solid #66ccff;
  padding-left: 0.75rem;
}

.sub-table {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.sub-table :deep(.n-table) {
  background: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(102, 204, 255, 0.2) !important;
}

.sub-table :deep(.n-table-th) {
  background: rgba(102, 204, 255, 0.1) !important;
  color: #66ccff !important;
}

.sub-table :deep(.n-table-td) {
  background: rgba(0, 0, 0, 0.1) !important;
}

/* Table Styles */
.info-table {
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 12px;
  overflow: hidden;
}

.info-table :deep(.n-table) {
  background: var(--bg-secondary) !important;
  border: 1px solid var(--bg-tertiary) !important;
}

.info-table :deep(.n-table-th) {
  background: var(--bg-tertiary) !important;
  color: var(--accent-color) !important;
  font-weight: 600;
  border: none !important;
  font-size: 1rem;
}

.info-table :deep(.n-table-td) {
  background: var(--bg-secondary) !important;
  border: none !important;
  border-bottom: 1px solid var(--bg-tertiary) !important;
  color: var(--text-primary) !important;
  font-size: 1rem;
}

.info-table :deep(.n-table-tr) {
  background: var(--bg-secondary) !important;
}

.info-table :deep(.n-table-tr:nth-child(even)) {
  background: var(--bg-tertiary) !important;
}

.info-table :deep(.n-table-tr:hover) {
  background: var(--accent-color) !important;
  opacity: 0.8;
}

.info-table .label {
  color: var(--text-secondary) !important;
  font-weight: 600;
  width: 40%;
  padding: 0.75rem 1rem;
}

.info-table .value {
  color: var(--text-secondary) !important;
  font-weight: 500;
  width: 60%;
  padding: 0.75rem 1rem;
}

/* Upgrade Options Styles */
.upgrades-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.upgrade-tag {
  margin: 0.25rem;
}

.notes-content {
  background: rgba(255, 255, 255, 0.02);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #00ffcc;
}

.notes-content p {
  color: #ccc;
  line-height: 1.6;
  font-size: 0.95rem;
  margin: 0;
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: #aaa;
}

.no-results-hint {
  margin-top: 1rem;
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .model-basic-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .result-content {
    padding: 1.25rem;
  }
  
  .info-table .label,
  .info-table .value {
    width: 50%;
    padding: 0.5rem 0.75rem;
  }
}
</style>