// 数据库迁移工具 - 从SQLite迁移到JSON
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 数据库文件路径
const dbPath = path.join(__dirname, 'rc_models.db')

// 输出JSON文件路径
const jsonOutputPath = path.join(__dirname, '..', 'data', 'hotParts.json')

// 检查数据库文件是否存在
if (!fs.existsSync(dbPath)) {
  console.error('数据库文件不存在:', dbPath)
  process.exit(1)
}

// 创建数据库连接
const db = new Database(dbPath)

// 迁移函数
async function migrateData() {
  try {
    console.log('开始迁移数据...')
    
    // 获取所有热门配件数据
    const stmt = db.prepare(`
      SELECT 
        hp.id,
        hp.modelId,
        hp.part,
        hp.upgrade_spec,
        hp.reason,
        hp.difficulty,
        hp.source,
        hp.submitter,
        hp.timestamp,
        hp.approved,
        m.brand,
        m.model,
        m.fullName
      FROM hot_parts hp
      LEFT JOIN models m ON hp.modelId = m.id
      ORDER BY hp.modelId, hp.timestamp DESC
    `)
    
    const hotParts = stmt.all()
    
    console.log(`找到 ${hotParts.length} 条配件记录`)
    
    // 转换数据格式
    const jsonData = {
      upgradeRecords: hotParts.map(part => ({
        id: part.id,
        modelId: part.modelId,
        part: part.part,
        upgrade_spec: part.upgrade_spec,
        reason: part.reason,
        difficulty: part.difficulty,
        source: part.source,
        submitter: part.submitter,
        timestamp: part.timestamp,
        approved: part.approved === 1,
        // 添加车型信息用于调试
        modelInfo: {
          brand: part.brand,
          model: part.model,
          fullName: part.fullName
        }
      }))
    }
    
    // 写入JSON文件
    fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonData, null, 2), 'utf8')
    
    console.log(`数据迁移完成！共迁移 ${hotParts.length} 条记录到 ${jsonOutputPath}`)
    
    // 显示统计信息
    const modelCounts = {}
    hotParts.forEach(part => {
      if (!modelCounts[part.modelId]) {
        modelCounts[part.modelId] = 0
      }
      modelCounts[part.modelId]++
    })
    
    console.log('\n车型分布统计:')
    Object.keys(modelCounts).forEach(modelId => {
      const model = hotParts.find(p => p.modelId == modelId)
      console.log(`  ${model.fullName}: ${modelCounts[modelId]} 个配件`)
    })
    
    // 关闭数据库连接
    db.close()
    
  } catch (error) {
    console.error('迁移数据失败:', error)
    db.close()
    process.exit(1)
  }
}

// 执行迁移
migrateData()