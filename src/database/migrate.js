import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { insertModels, getAllModels, closeDatabase } from './db.js'

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 读取config.json文件
const configPath = path.join(__dirname, '../data/config.json')

const migrateData = () => {
  try {
    console.log('开始数据迁移...')
    
    // 读取config.json文件
    const configData = JSON.parse(readFileSync(configPath, 'utf8'))
    console.log('读取到车型数据:', configData.models.length, '个车型')
    
    // 导入数据到数据库
    const success = insertModels(configData.models)
    
    if (success) {
      console.log('数据迁移成功!')
      
      // 验证数据
      const modelsInDb = getAllModels()
      console.log('数据库中的车型数量:', modelsInDb.length)
      
      // 显示前几个车型作为验证
      console.log('前5个车型:')
      modelsInDb.slice(0, 5).forEach(model => {
        console.log(`  ${model.id}: ${model.brand} ${model.model}`)
      })
    } else {
      console.error('数据迁移失败')
    }
    
  } catch (error) {
    console.error('数据迁移过程中发生错误:', error)
  } finally {
    // 关闭数据库连接
    closeDatabase()
  }
}

// 执行迁移
migrateData()