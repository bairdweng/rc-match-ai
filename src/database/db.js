import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 数据库文件路径
const dbPath = path.join(__dirname, 'rc_models.db')

// 创建数据库连接
const db = new Database(dbPath)

// 初始化数据库表
const initDatabase = () => {
  try {
    // 创建车型表
    db.exec(`
      CREATE TABLE IF NOT EXISTS models (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        fullName TEXT NOT NULL,
        scale TEXT NOT NULL,
        drive TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 创建热门配件表
    db.exec(`
      CREATE TABLE IF NOT EXISTS hot_parts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modelId INTEGER NOT NULL,
        part TEXT NOT NULL,
        upgrade_spec TEXT NOT NULL,
        reason TEXT NOT NULL,
        difficulty INTEGER NOT NULL,
        source TEXT NOT NULL,
        submitter TEXT NOT NULL,
        timestamp DATETIME NOT NULL,
        approved BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (modelId) REFERENCES models(id)
      )
    `)

    // 创建索引
    db.exec(`CREATE INDEX IF NOT EXISTS idx_models_brand ON models(brand)`)
    db.exec(`CREATE INDEX IF NOT EXISTS idx_models_model ON models(model)`)
    db.exec(`CREATE INDEX IF NOT EXISTS idx_models_fullName ON models(fullName)`)
    db.exec(`CREATE INDEX IF NOT EXISTS idx_hot_parts_modelId ON hot_parts(modelId)`)
    db.exec(`CREATE INDEX IF NOT EXISTS idx_hot_parts_timestamp ON hot_parts(timestamp)`)

    console.log('数据库初始化成功')
    return true
  } catch (error) {
    console.error('数据库初始化失败:', error)
    return false
  }
}

// 插入车型数据
const insertModels = (models) => {
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO models (id, brand, model, fullName, scale, drive)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const insertMany = db.transaction((models) => {
      for (const model of models) {
        stmt.run(
          model.id,
          model.brand,
          model.model,
          model.fullName,
          model.scale,
          model.drive
        )
      }
    })

    insertMany(models)
    console.log(`成功插入/更新 ${models.length} 个车型数据`)
    return true
  } catch (error) {
    console.error('插入车型数据失败:', error)
    return false
  }
}

// 获取所有车型
const getAllModels = () => {
  try {
    const stmt = db.prepare('SELECT * FROM models ORDER BY brand, model')
    return stmt.all()
  } catch (error) {
    console.error('获取车型数据失败:', error)
    return []
  }
}

// 根据ID获取车型
const getModelById = (id) => {
  try {
    const stmt = db.prepare('SELECT * FROM models WHERE id = ?')
    return stmt.get(id)
  } catch (error) {
    console.error('根据ID获取车型失败:', error)
    return null
  }
}

// 根据品牌搜索车型
const getModelsByBrand = (brand) => {
  try {
    const stmt = db.prepare('SELECT * FROM models WHERE brand LIKE ? ORDER BY model')
    return stmt.all(`%${brand}%`)
  } catch (error) {
    console.error('根据品牌搜索车型失败:', error)
    return []
  }
}

// 根据关键词搜索车型
const searchModels = (keyword) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM models 
      WHERE brand LIKE ? OR model LIKE ? OR fullName LIKE ?
      ORDER BY brand, model
    `)
    return stmt.all(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
  } catch (error) {
    console.error('搜索车型失败:', error)
    return []
  }
}

// 更新车型数据
const updateModel = (id, updates) => {
  try {
    const fields = []
    const values = []
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id') {
        fields.push(`${key} = ?`)
        values.push(value)
      }
    }
    
    values.push(id)
    
    const stmt = db.prepare(`
      UPDATE models 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    const result = stmt.run(...values)
    return result.changes > 0
  } catch (error) {
    console.error('更新车型失败:', error)
    return false
  }
}

// 删除车型
const deleteModel = (id) => {
  try {
    const stmt = db.prepare('DELETE FROM models WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  } catch (error) {
    console.error('删除车型失败:', error)
    return false
  }
}

// 热门配件数据操作

// 插入热门配件数据
const insertHotParts = (hotParts) => {
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO hot_parts (id, modelId, part, upgrade_spec, reason, difficulty, source, submitter, timestamp, approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const insertMany = db.transaction((hotParts) => {
      for (const part of hotParts) {
        stmt.run(
          part.id,
          part.modelId,
          part.part,
          part.upgrade_spec,
          part.reason,
          part.difficulty,
          part.source,
          part.submitter,
          part.timestamp,
          part.approved ? 1 : 0
        )
      }
    })

    insertMany(hotParts)
    console.log(`成功插入/更新 ${hotParts.length} 个热门配件数据`)
    return true
  } catch (error) {
    console.error('插入热门配件数据失败:', error)
    return false
  }
}

// 获取所有热门配件
const getAllHotParts = () => {
  try {
    const stmt = db.prepare('SELECT * FROM hot_parts ORDER BY timestamp DESC')
    return stmt.all()
  } catch (error) {
    console.error('获取热门配件数据失败:', error)
    return []
  }
}

// 根据车型ID获取热门配件
const getHotPartsByModelId = (modelId) => {
  try {
    const stmt = db.prepare('SELECT * FROM hot_parts WHERE modelId = ? ORDER BY timestamp DESC')
    return stmt.all(modelId)
  } catch (error) {
    console.error('根据车型ID获取热门配件失败:', error)
    return []
  }
}

// 根据配件名称搜索热门配件
const searchHotParts = (keyword) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM hot_parts 
      WHERE part LIKE ? OR upgrade_spec LIKE ? OR reason LIKE ?
      ORDER BY timestamp DESC
    `)
    return stmt.all(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
  } catch (error) {
    console.error('搜索热门配件失败:', error)
    return []
  }
}

// 删除热门配件
const deleteHotPart = (id) => {
  try {
    const stmt = db.prepare('DELETE FROM hot_parts WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  } catch (error) {
    console.error('删除热门配件失败:', error)
    return false
  }
}

// 关闭数据库连接
const closeDatabase = () => {
  try {
    db.close()
    console.log('数据库连接已关闭')
  } catch (error) {
    console.error('关闭数据库失败:', error)
  }
}

// 初始化数据库
initDatabase()

export {
  db,
  initDatabase,
  insertModels,
  getAllModels,
  getModelById,
  getModelsByBrand,
  searchModels,
  updateModel,
  deleteModel,
  insertHotParts,
  getAllHotParts,
  getHotPartsByModelId,
  searchHotParts,
  deleteHotPart,
  closeDatabase
}