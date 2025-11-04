// Google Analytics配置
export const initGoogleAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
  
  if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
    console.warn('Google Analytics测量ID未配置，请检查.env文件')
    return false
  }
  
  try {
    // 检查gtag是否已初始化
    if (window.gtag) {
      console.log('Google Analytics已初始化')
      return true
    }
    
    // 创建dataLayer和gtag函数
    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer.push(arguments)
    }
    
    // 添加Google Analytics脚本
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
    
    // 初始化配置
    gtag('js', new Date())
    gtag('config', measurementId, {
      page_location: window.location.href,
      page_title: document.title
    })
    
    console.log('Google Analytics初始化成功，测量ID:', measurementId)
    return true
  } catch (error) {
    console.error('Google Analytics初始化失败:', error)
    return false
  }
}

// 页面浏览跟踪
export const trackPageView = (pageTitle, pagePath) => {
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_title: pageTitle,
      page_location: window.location.origin + pagePath,
      page_path: pagePath
    })
  }
}

// 自定义事件跟踪
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams)
  }
}

// 搜索事件跟踪
export const trackSearch = (searchTerm, resultsCount = 0) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
    event_category: 'search'
  })
}

// 升级记录事件跟踪
export const trackUpgradeRecord = (action, recordType) => {
  trackEvent('upgrade_record', {
    action: action, // 'create', 'update', 'delete', 'view'
    record_type: recordType,
    event_category: 'upgrade_records'
  })
}

// 错误事件跟踪
export const trackError = (errorType, errorMessage) => {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    event_category: 'errors'
  })
}