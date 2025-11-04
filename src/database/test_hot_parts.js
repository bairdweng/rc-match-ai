// 热门配件数据库测试脚本
import hotPartsDB from './hot_parts.js'

async function testHotPartsDatabase() {
  console.log('开始测试热门配件数据库...')
  
  try {
    // 测试初始化
    console.log('1. 初始化热门配件数据...')
    const parts = await hotPartsDB.initHotPartsData()
    console.log('✓ 热门配件数据初始化成功')
    console.log(`   加载了 ${parts.length} 个热门配件`)
    
    // 测试获取所有配件
    console.log('2. 获取所有热门配件...')
    const allParts = await hotPartsDB.getAllHotParts()
    console.log(`✓ 成功获取 ${allParts.length} 个配件`)
    
    // 测试按车型ID获取配件
    console.log('3. 按车型ID获取配件...')
    const traxxasParts = await hotPartsDB.getHotPartsByModelId(1) // Traxxas Slash 2WD
    console.log(`✓ Traxxas Slash 2WD 有 ${traxxasParts.length} 个热门配件`)
    
    const trx4Parts = await hotPartsDB.getHotPartsByModelId(13) // Traxxas TRX-4
    console.log(`✓ Traxxas TRX-4 有 ${trx4Parts.length} 个热门配件`)
    
    // 显示部分配件信息
    console.log('4. 显示部分配件信息:')
    allParts.slice(0, 3).forEach((part, index) => {
      console.log(`   ${index + 1}. ${part.part} - ${part.upgrade_spec}`)
      console.log(`      原因: ${part.reason}`)
      console.log(`      难度: ${part.difficulty}/5`)
      console.log(`      提交者: ${part.submitter}`)
    })
    
    console.log('\n✓ 热门配件数据库测试完成！所有功能正常')
    return true
    
  } catch (error) {
    console.error('✗ 测试失败:', error)
    return false
  }
}

// 如果直接运行此文件，则执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testHotPartsDatabase()
}

export default testHotPartsDatabase