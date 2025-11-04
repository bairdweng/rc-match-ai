// 数据库API工具 - 使用静态JSON数据的只读方案

// 导入静态数据
import hotPartsData from '../data/hotParts.json'

// 缓存数据以提高性能
let cachedData = null

// 加载数据函数
async function loadData() {
  if (cachedData) {
    return cachedData
  }
  
  try {
    // 直接使用导入的JSON数据
    cachedData = hotPartsData.upgradeRecords
    console.log('加载静态数据成功，共', cachedData.length, '条记录')
    return cachedData
  } catch (error) {
    console.error('加载数据失败:', error)
    return []
  }
}

// 查询配件数据
 async function queryHotPartsFromDatabase(modelId) {
   try {
     console.log('查询配件数据，车型ID:', modelId)
     
     const allData = await loadData()
     
     // 过滤出对应车型的数据
     const result = allData.filter(record => record.modelId === modelId)
     
     console.log('查询结果:', result.length, '条记录')
     return result
   } catch (error) {
     console.error('查询数据失败:', error)
     return []
   }
 }

 // 添加新的升级记录（只读模式下禁用）
 async function addUpgradeRecord(record) {
   console.warn('只读模式：添加记录功能已禁用')
   return { 
     success: false, 
     error: '当前为只读模式，无法添加新记录。如需添加记录，请使用可写数据库版本。' 
   }
 }

 // 获取所有记录（用于调试和管理）
 async function getAllRecords() {
   try {
     const allData = await loadData()
     return allData
   } catch (error) {
     console.error('获取所有记录失败:', error)
     return []
   }
 }

 // 获取统计数据
 async function getStats() {
   try {
     const allData = await loadData()
     
     const stats = {
       totalRecords: allData.length,
       uniqueModels: [...new Set(allData.map(record => record.modelId))].length,
       uniqueParts: [...new Set(allData.map(record => record.part))].length,
       difficultyDistribution: {
         easy: allData.filter(record => record.difficulty <= 2).length,
         medium: allData.filter(record => record.difficulty === 3).length,
         hard: allData.filter(record => record.difficulty >= 4).length
       }
     }
     
     return stats
   } catch (error) {
     console.error('获取统计数据失败:', error)
     return {}
   }
 }

export { queryHotPartsFromDatabase, addUpgradeRecord, getAllRecords, getStats }