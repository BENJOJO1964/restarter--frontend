const express = require('express');
const router = express.Router();

// 測試路由
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: '職位API測試成功',
    query: req.query
  });
});

// 簡單的職位搜尋API
router.get('/search', async (req, res) => {
  try {
    const {
      keyword = '',
      location = '',
      jobType = '',
      skills = '',
      page = 1,
      limit = 20
    } = req.query;

    // 解碼URL編碼的參數
    const decodedKeyword = decodeURIComponent(keyword);
    const decodedLocation = decodeURIComponent(location);
    const decodedJobType = decodeURIComponent(jobType);
    const decodedSkills = decodeURIComponent(skills);

    console.log('職位搜尋請求:', { 
      keyword: decodedKeyword, 
      location: decodedLocation, 
      jobType: decodedJobType, 
      skills: decodedSkills, 
      page, 
      limit 
    });

    // 智能生成職位資料
    const allJobs = generateSmartJobs(decodedKeyword, decodedLocation, decodedJobType, limit);
    const dataSources = ['智能生成資料'];

    // 根據技能篩選
    let filteredJobs = allJobs;
    if (decodedSkills) {
      const skillArray = decodedSkills.split(',').map(s => s.trim());
      filteredJobs = filteredJobs.filter(job => 
        job.skills && skillArray.some(skill => job.skills.includes(skill))
      );
    }

    res.json({
      success: true,
      data: {
        jobs: filteredJobs,
        total: filteredJobs.length,
        page: parseInt(page),
        limit: parseInt(limit),
        sources: dataSources,
        note: `整合${dataSources.join('、')}資料`,
        dataType: '智能職位系統'
      }
    });

  } catch (error) {
    console.error('職位搜尋錯誤:', error.message);
    res.status(500).json({
      success: false,
      message: '職位搜尋服務暫時無法使用',
      error: error.message
    });
  }
});

// 智能生成職位資料（基於真實市場數據）
function generateSmartJobs(keyword, location, jobType, limit) {
  const jobTemplates = [
    // 技術開發類
    {
      title: '前端開發工程師',
      company: '科技新創公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 60,000 - 80,000',
      description: '負責開發現代化的Web應用程式，使用React、TypeScript等技術。',
      requirements: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS'],
      skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Git'],
      source: '智能生成'
    },
    {
      title: '後端開發工程師',
      company: '大型企業',
      location: '新北市',
      type: '全職',
      salary: '月薪 70,000 - 90,000',
      description: '負責開發和維護後端API，使用Node.js、Python等技術。',
      requirements: ['Node.js', 'Python', 'SQL', 'MongoDB'],
      skills: ['Node.js', 'Python', 'SQL', 'MongoDB', 'AWS'],
      source: '智能生成'
    },
    {
      title: '全端開發工程師',
      company: '軟體公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 80,000 - 120,000',
      description: '負責前後端開發，具備完整的Web開發技能。',
      requirements: ['React', 'Node.js', 'Python', '資料庫設計'],
      skills: ['React', 'Node.js', 'Python', 'MySQL', 'MongoDB'],
      source: '智能生成'
    },
    {
      title: 'DevOps工程師',
      company: '雲端服務公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 75,000 - 100,000',
      description: '負責CI/CD流程、容器化部署和雲端架構管理。',
      requirements: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'GitLab'],
      source: '智能生成'
    },
    {
      title: 'AI工程師',
      company: '人工智慧公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 90,000 - 130,000',
      description: '負責機器學習模型開發和AI系統整合。',
      requirements: ['Python', '機器學習', '深度學習', 'TensorFlow'],
      skills: ['Python', '機器學習', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
      source: '智能生成'
    },
    {
      title: '資料科學家',
      company: '數據分析公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 85,000 - 120,000',
      description: '負責大數據分析和預測模型建立。',
      requirements: ['Python', 'R', '統計分析', '機器學習'],
      skills: ['Python', 'R', 'SQL', '統計分析', '機器學習'],
      source: '智能生成'
    },
    
    // 設計與創意類
    {
      title: 'UI/UX設計師',
      company: '設計工作室',
      location: '台北市',
      type: '全職',
      salary: '月薪 50,000 - 70,000',
      description: '負責產品界面設計和用戶體驗優化。',
      requirements: ['Figma', 'Adobe創意套件', 'UI/UX設計'],
      skills: ['Figma', 'Adobe創意套件', 'UI/UX設計', '原型設計'],
      source: '智能生成'
    },
    {
      title: '視覺設計師',
      company: '廣告公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 45,000 - 65,000',
      description: '負責品牌視覺設計和創意表現。',
      requirements: ['Adobe Photoshop', 'Adobe Illustrator', '創意設計'],
      skills: ['Adobe Photoshop', 'Adobe Illustrator', '創意設計', '品牌設計'],
      source: '智能生成'
    },
    {
      title: '產品設計師',
      company: '硬體公司',
      location: '新北市',
      type: '全職',
      salary: '月薪 60,000 - 85,000',
      description: '負責產品外觀設計和用戶體驗設計。',
      requirements: ['工業設計', '3D建模', '產品開發'],
      skills: ['工業設計', '3D建模', 'Rhino', 'SolidWorks', '產品開發'],
      source: '智能生成'
    },
    
    // 數據與分析類
    {
      title: '數據分析師',
      company: '金融科技公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 65,000 - 85,000',
      description: '負責數據分析和商業洞察，支持業務決策。',
      requirements: ['Python', 'SQL', '數據分析', '機器學習'],
      skills: ['Python', 'SQL', '數據分析', '機器學習', 'Tableau'],
      source: '智能生成'
    },
    {
      title: '商業分析師',
      company: '顧問公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 70,000 - 90,000',
      description: '負責商業策略分析和市場研究。',
      requirements: ['商業分析', '市場研究', '策略規劃'],
      skills: ['商業分析', '市場研究', 'Excel', 'PowerPoint', '策略規劃'],
      source: '智能生成'
    },
    {
      title: '財務分析師',
      company: '投資公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 75,000 - 95,000',
      description: '負責財務報表分析和投資評估。',
      requirements: ['財務分析', '會計', '投資評估'],
      skills: ['財務分析', '會計', 'Excel', '財務建模', '投資評估'],
      source: '智能生成'
    },
    
    // 管理與領導類
    {
      title: '專案經理',
      company: '顧問公司',
      location: '台中市',
      type: '全職',
      salary: '月薪 80,000 - 100,000',
      description: '負責專案規劃、執行和團隊管理。',
      requirements: ['專案管理', '領導力', '溝通技巧'],
      skills: ['專案管理', '領導力', '溝通技巧', '敏捷開發'],
      source: '智能生成'
    },
    {
      title: '產品經理',
      company: '科技公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 85,000 - 120,000',
      description: '負責產品策略規劃和產品生命週期管理。',
      requirements: ['產品管理', '市場分析', '用戶研究'],
      skills: ['產品管理', '市場分析', '用戶研究', '敏捷開發', '數據分析'],
      source: '智能生成'
    },
    {
      title: '技術經理',
      company: '軟體公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 100,000 - 150,000',
      description: '負責技術團隊管理和技術架構規劃。',
      requirements: ['技術管理', '團隊領導', '系統架構'],
      skills: ['技術管理', '團隊領導', '系統架構', '敏捷開發', '技術規劃'],
      source: '智能生成'
    },
    
    // 行銷與業務類
    {
      title: '數位行銷專員',
      company: '電商平台',
      location: '台北市',
      type: '全職',
      salary: '月薪 45,000 - 65,000',
      description: '負責社群媒體行銷、SEO優化和內容創作。',
      requirements: ['數位行銷', '社群媒體行銷', 'SEO優化'],
      skills: ['數位行銷', '社群媒體行銷', 'SEO優化', '內容創作', 'Google Analytics'],
      source: '智能生成'
    },
    {
      title: '業務專員',
      company: '貿易公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 50,000 - 70,000',
      description: '負責客戶開發和業務拓展。',
      requirements: ['業務開發', '客戶關係管理', '銷售技巧'],
      skills: ['業務開發', '客戶關係管理', '銷售技巧', '溝通技巧', '談判技巧'],
      source: '智能生成'
    },
    {
      title: '客戶經理',
      company: '金融服務公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 60,000 - 80,000',
      description: '負責高端客戶關係維護和金融產品銷售。',
      requirements: ['客戶關係管理', '金融產品', '投資理財'],
      skills: ['客戶關係管理', '金融產品', '投資理財', '風險管理', '財務規劃'],
      source: '智能生成'
    },
    
    // 財務與會計類
    {
      title: '會計專員',
      company: '會計師事務所',
      location: '台北市',
      type: '全職',
      salary: '月薪 40,000 - 55,000',
      description: '負責財務報表製作、稅務申報和帳務處理。',
      requirements: ['會計', '簿記', '稅務申報'],
      skills: ['會計', '簿記', '稅務申報', 'Excel', 'QuickBooks'],
      source: '智能生成'
    },
    {
      title: '財務經理',
      company: '製造業公司',
      location: '桃園市',
      type: '全職',
      salary: '月薪 80,000 - 110,000',
      description: '負責財務規劃、預算管理和財務報告。',
      requirements: ['財務管理', '預算規劃', '財務分析'],
      skills: ['財務管理', '預算規劃', '財務分析', 'Excel', '財務建模'],
      source: '智能生成'
    },
    {
      title: '投資顧問',
      company: '證券公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 70,000 - 100,000',
      description: '負責投資建議和理財規劃服務。',
      requirements: ['投資分析', '理財規劃', '金融產品'],
      skills: ['投資分析', '理財規劃', '金融產品', '風險管理', '市場分析'],
      source: '智能生成'
    },
    
    // 人力資源類
    {
      title: '人資專員',
      company: '製造業公司',
      location: '桃園市',
      type: '全職',
      salary: '月薪 45,000 - 60,000',
      description: '負責招募、員工關係和人力資源管理。',
      requirements: ['招募', '員工關係', '人資政策'],
      skills: ['招募', '員工關係', '人資政策', '績效評估', '人資資訊系統'],
      source: '智能生成'
    },
    {
      title: '招募專員',
      company: '獵頭公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 50,000 - 70,000',
      description: '負責人才招募和獵頭服務。',
      requirements: ['人才招募', '獵頭服務', '人才評估'],
      skills: ['人才招募', '獵頭服務', '人才評估', '面試技巧', '人才市場分析'],
      source: '智能生成'
    },
    {
      title: '培訓專員',
      company: '教育機構',
      location: '台北市',
      type: '全職',
      salary: '月薪 45,000 - 65,000',
      description: '負責企業培訓課程規劃和執行。',
      requirements: ['培訓規劃', '課程設計', '教學技巧'],
      skills: ['培訓規劃', '課程設計', '教學技巧', '成人教育', '培訓評估'],
      source: '智能生成'
    },
    
    // 醫療與健康類
    {
      title: '護理師',
      company: '醫院',
      location: '高雄市',
      type: '全職',
      salary: '月薪 50,000 - 70,000',
      description: '負責病人照護、醫療記錄和護理評估。',
      requirements: ['護理', '病人照護', '臨床技能'],
      skills: ['護理', '病人照護', '臨床技能', '病歷管理', 'CPR'],
      source: '智能生成'
    },
    {
      title: '醫師',
      company: '醫院',
      location: '台北市',
      type: '全職',
      salary: '月薪 150,000 - 300,000',
      description: '負責病患診斷、治療和醫療服務。',
      requirements: ['醫學專業', '臨床診斷', '醫療技術'],
      skills: ['醫學專業', '臨床診斷', '醫療技術', '病患照護', '醫療管理'],
      source: '智能生成'
    },
    {
      title: '藥師',
      company: '藥局',
      location: '台北市',
      type: '全職',
      salary: '月薪 60,000 - 80,000',
      description: '負責藥品調劑、用藥諮詢和藥事服務。',
      requirements: ['藥學專業', '藥品調劑', '用藥諮詢'],
      skills: ['藥學專業', '藥品調劑', '用藥諮詢', '藥事管理', '藥物相互作用'],
      source: '智能生成'
    },
    
    // 教育與培訓類
    {
      title: '英文教師',
      company: '語言學校',
      location: '台中市',
      type: '兼職',
      salary: '時薪 400 - 600',
      description: '負責英語教學、課程規劃和學生評估。',
      requirements: ['教學', '英語', '課程開發'],
      skills: ['教學', '英語', '課程開發', '英語教學', '班級管理'],
      source: '智能生成'
    },
    {
      title: '程式設計教師',
      company: '程式教育機構',
      location: '台北市',
      type: '全職',
      salary: '月薪 55,000 - 75,000',
      description: '負責程式設計課程教學和學生指導。',
      requirements: ['程式設計', '教學', '課程開發'],
      skills: ['Python', 'JavaScript', 'Java', '教學', '課程開發'],
      source: '智能生成'
    },
    {
      title: '企業講師',
      company: '管理顧問公司',
      location: '台北市',
      type: '兼職',
      salary: '時薪 800 - 1,500',
      description: '負責企業內部培訓和專業課程講授。',
      requirements: ['專業知識', '演講技巧', '課程設計'],
      skills: ['專業知識', '演講技巧', '課程設計', '成人教育', '企業培訓'],
      source: '智能生成'
    },
    
    // 行政與支援類
    {
      title: '行政助理',
      company: '貿易公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 35,000 - 45,000',
      description: '負責文書處理、會議安排和行政支援。',
      requirements: ['行政支援', '辦公室管理', 'Microsoft Office'],
      skills: ['行政支援', '辦公室管理', 'Microsoft Office', '行程管理', '資料輸入'],
      source: '智能生成'
    },
    {
      title: '法務專員',
      company: '法律事務所',
      location: '台北市',
      type: '全職',
      salary: '月薪 60,000 - 80,000',
      description: '負責法律文件審查、合約管理和法律諮詢。',
      requirements: ['法律專業', '合約審查', '法律研究'],
      skills: ['法律專業', '合約審查', '法律研究', '法規遵循', '法律寫作'],
      source: '智能生成'
    },
    {
      title: '律師',
      company: '律師事務所',
      location: '台北市',
      type: '全職',
      salary: '月薪 80,000 - 150,000',
      description: '負責法律訴訟、法律諮詢和法律文件撰寫。',
      requirements: ['法律專業', '訴訟技巧', '法律分析'],
      skills: ['法律專業', '訴訟技巧', '法律分析', '法律寫作', '法律諮詢'],
      source: '智能生成'
    },
    
    // 製造與工程類
    {
      title: '機械工程師',
      company: '製造業公司',
      location: '台南市',
      type: '全職',
      salary: '月薪 60,000 - 80,000',
      description: '負責機械設計、產品開發和技術支援。',
      requirements: ['機械工程', 'CAD設計', '產品開發'],
      skills: ['機械工程', 'CAD設計', '產品開發', '技術製圖', '品質控制'],
      source: '智能生成'
    },
    {
      title: '電機工程師',
      company: '電子製造公司',
      location: '新北市',
      type: '全職',
      salary: '月薪 65,000 - 85,000',
      description: '負責電路設計、系統整合和技術開發。',
      requirements: ['電機工程', '電路設計', '系統整合'],
      skills: ['電機工程', '電路設計', '系統整合', 'PCB設計', '電子測試'],
      source: '智能生成'
    },
    {
      title: '建築師',
      company: '建築事務所',
      location: '台北市',
      type: '全職',
      salary: '月薪 70,000 - 100,000',
      description: '負責建築設計、規劃和專案管理。',
      requirements: ['建築設計', 'AutoCAD', '建築法規'],
      skills: ['建築設計', 'AutoCAD', '建築法規', '3D建模', '專案管理'],
      source: '智能生成'
    },
    
    // 服務與零售類
    {
      title: '客服專員',
      company: '電信公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 35,000 - 45,000',
      description: '負責客戶服務、問題處理和客戶關係維護。',
      requirements: ['客戶服務', '溝通技巧', '問題解決'],
      skills: ['客戶服務', '溝通技巧', '問題解決', 'CRM系統', '產品知識'],
      source: '智能生成'
    },
    {
      title: '店長',
      company: '零售連鎖店',
      location: '台北市',
      type: '全職',
      salary: '月薪 45,000 - 60,000',
      description: '負責店面營運、員工管理和業績達成。',
      requirements: ['店面管理', '員工管理', '業績管理'],
      skills: ['店面管理', '員工管理', '業績管理', '庫存管理', '客戶服務'],
      source: '智能生成'
    },
    {
      title: '物流專員',
      company: '物流公司',
      location: '桃園市',
      type: '全職',
      salary: '月薪 40,000 - 55,000',
      description: '負責物流規劃、倉儲管理和配送協調。',
      requirements: ['物流管理', '倉儲管理', '配送規劃'],
      skills: ['物流管理', '倉儲管理', '配送規劃', '供應鏈管理', 'WMS系統'],
      source: '智能生成'
    },
    
    // 餐飲與觀光類
    {
      title: '主廚',
      company: '高級餐廳',
      location: '台北市',
      type: '全職',
      salary: '月薪 70,000 - 100,000',
      description: '負責廚房管理、菜單設計和廚師團隊領導。',
      requirements: ['廚藝技能', '廚房管理', '菜單設計'],
      skills: ['廚藝技能', '廚房管理', '菜單設計', '食材採購', '團隊領導'],
      source: '智能生成'
    },
    {
      title: '導遊',
      company: '旅行社',
      location: '台北市',
      type: '兼職',
      salary: '日薪 1,500 - 2,500',
      description: '負責旅遊導覽、行程安排和旅客服務。',
      requirements: ['導遊證照', '語言能力', '旅遊知識'],
      skills: ['導遊證照', '語言能力', '旅遊知識', '行程規劃', '旅客服務'],
      source: '智能生成'
    },
    {
      title: '飯店經理',
      company: '五星級飯店',
      location: '台北市',
      type: '全職',
      salary: '月薪 80,000 - 120,000',
      description: '負責飯店營運、服務管理和業績達成。',
      requirements: ['飯店管理', '服務管理', '營運管理'],
      skills: ['飯店管理', '服務管理', '營運管理', '客戶服務', '團隊領導'],
      source: '智能生成'
    },
    
    // 傳播與媒體類
    {
      title: '記者',
      company: '新聞媒體',
      location: '台北市',
      type: '全職',
      salary: '月薪 45,000 - 65,000',
      description: '負責新聞採訪、報導撰寫和新聞編輯。',
      requirements: ['新聞採訪', '報導撰寫', '新聞編輯'],
      skills: ['新聞採訪', '報導撰寫', '新聞編輯', '媒體倫理', '數位媒體'],
      source: '智能生成'
    },
    {
      title: '影片剪輯師',
      company: '影視製作公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 50,000 - 70,000',
      description: '負責影片剪輯、後製處理和視覺效果製作。',
      requirements: ['影片剪輯', '後製處理', '視覺效果'],
      skills: ['Premiere Pro', 'After Effects', '影片剪輯', '後製處理', '視覺效果'],
      source: '智能生成'
    },
    {
      title: '廣告專員',
      company: '廣告公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 45,000 - 65,000',
      description: '負責廣告企劃、創意發想和客戶溝通。',
      requirements: ['廣告企劃', '創意發想', '客戶溝通'],
      skills: ['廣告企劃', '創意發想', '客戶溝通', '市場分析', '創意設計'],
      source: '智能生成'
    },
    
    // 其他專業類
    {
      title: '翻譯員',
      company: '翻譯公司',
      location: '台北市',
      type: '兼職',
      salary: '字數計費 0.5 - 1.5元',
      description: '負責文件翻譯、口譯服務和語言諮詢。',
      requirements: ['語言能力', '翻譯技巧', '專業知識'],
      skills: ['語言能力', '翻譯技巧', '專業知識', '文化理解', '語言諮詢'],
      source: '智能生成'
    },
    {
      title: '研究員',
      company: '研究機構',
      location: '台北市',
      type: '全職',
      salary: '月薪 60,000 - 85,000',
      description: '負責學術研究、資料分析和研究報告撰寫。',
      requirements: ['研究方法', '資料分析', '報告撰寫'],
      skills: ['研究方法', '資料分析', '報告撰寫', '統計分析', '學術寫作'],
      source: '智能生成'
    },
    {
      title: '顧問',
      company: '管理顧問公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 100,000 - 200,000',
      description: '負責企業諮詢、策略規劃和問題解決。',
      requirements: ['諮詢技巧', '策略規劃', '問題解決'],
      skills: ['諮詢技巧', '策略規劃', '問題解決', '商業分析', '專案管理'],
      source: '智能生成'
    },
    
    // 基隆市職位
    {
      title: '港口物流專員',
      company: '基隆港務公司',
      location: '基隆市',
      type: '全職',
      salary: '月薪 45,000 - 60,000',
      description: '負責港口物流規劃、貨物調度和運輸協調。',
      requirements: ['物流管理', '港口作業', '運輸規劃'],
      skills: ['物流管理', '港口作業', '運輸規劃', '貨物調度', '海運知識'],
      source: '智能生成'
    },
    {
      title: '海洋工程師',
      company: '基隆海洋科技公司',
      location: '基隆市',
      type: '全職',
      salary: '月薪 65,000 - 85,000',
      description: '負責海洋工程設計、船舶維護和海洋技術開發。',
      requirements: ['海洋工程', '船舶技術', '海洋科學'],
      skills: ['海洋工程', '船舶技術', '海洋科學', '工程設計', '技術開發'],
      source: '智能生成'
    },
    
    // 新竹市職位
    {
      title: '半導體工程師',
      company: '新竹科技園區公司',
      location: '新竹市',
      type: '全職',
      salary: '月薪 80,000 - 120,000',
      description: '負責半導體製程開發、晶片設計和技術優化。',
      requirements: ['半導體工程', '晶片設計', '製程技術'],
      skills: ['半導體工程', '晶片設計', '製程技術', 'IC設計', '技術優化'],
      source: '智能生成'
    },
    {
      title: 'IC設計工程師',
      company: '新竹IC設計公司',
      location: '新竹市',
      type: '全職',
      salary: '月薪 90,000 - 130,000',
      description: '負責積體電路設計、驗證和測試。',
      requirements: ['IC設計', '電路設計', '驗證測試'],
      skills: ['IC設計', '電路設計', '驗證測試', 'EDA工具', '數位電路'],
      source: '智能生成'
    },
    
    // 新竹縣職位
    {
      title: '光電工程師',
      company: '新竹光電科技公司',
      location: '新竹縣',
      type: '全職',
      salary: '月薪 70,000 - 100,000',
      description: '負責光電技術開發、光學系統設計和產品研發。',
      requirements: ['光電工程', '光學設計', '技術研發'],
      skills: ['光電工程', '光學設計', '技術研發', '光學系統', '產品開發'],
      source: '智能生成'
    },
    {
      title: '生技研發工程師',
      company: '新竹生技公司',
      location: '新竹縣',
      type: '全職',
      salary: '月薪 75,000 - 110,000',
      description: '負責生物技術研發、實驗設計和產品開發。',
      requirements: ['生物技術', '實驗設計', '產品開發'],
      skills: ['生物技術', '實驗設計', '產品開發', '分子生物學', '細胞培養'],
      source: '智能生成'
    },
    
    // 苗栗縣職位
    {
      title: '傳統產業工程師',
      company: '苗栗製造公司',
      location: '苗栗縣',
      type: '全職',
      salary: '月薪 55,000 - 75,000',
      description: '負責傳統製造業技術改進、設備維護和製程優化。',
      requirements: ['製造工程', '設備維護', '製程優化'],
      skills: ['製造工程', '設備維護', '製程優化', '自動化技術', '品質控制'],
      source: '智能生成'
    },
    {
      title: '陶瓷工藝師',
      company: '苗栗陶瓷工坊',
      location: '苗栗縣',
      type: '全職',
      salary: '月薪 40,000 - 60,000',
      description: '負責陶瓷工藝製作、設計創作和技術傳承。',
      requirements: ['陶瓷工藝', '設計創作', '技術傳承'],
      skills: ['陶瓷工藝', '設計創作', '技術傳承', '手工製作', '藝術設計'],
      source: '智能生成'
    },
    
    // 彰化縣職位
    {
      title: '製造業工程師',
      company: '彰化製造公司',
      location: '彰化縣',
      type: '全職',
      salary: '月薪 60,000 - 80,000',
      description: '負責製造業生產管理、設備維護和製程改善。',
      requirements: ['製造工程', '生產管理', '設備維護'],
      skills: ['製造工程', '生產管理', '設備維護', '製程改善', '品質管理'],
      source: '智能生成'
    },
    {
      title: '農業技術專員',
      company: '彰化農業公司',
      location: '彰化縣',
      type: '全職',
      salary: '月薪 45,000 - 65,000',
      description: '負責農業技術推廣、作物管理和農業諮詢。',
      requirements: ['農業技術', '作物管理', '農業諮詢'],
      skills: ['農業技術', '作物管理', '農業諮詢', '農作技術', '病蟲害防治'],
      source: '智能生成'
    },
    
    // 南投縣職位
    {
      title: '觀光導覽員',
      company: '南投觀光公司',
      location: '南投縣',
      type: '全職',
      salary: '月薪 35,000 - 50,000',
      description: '負責觀光導覽、旅遊規劃和遊客服務。',
      requirements: ['觀光導覽', '旅遊規劃', '遊客服務'],
      skills: ['觀光導覽', '旅遊規劃', '遊客服務', '導遊證照', '在地知識'],
      source: '智能生成'
    },
    {
      title: '茶藝師',
      company: '南投茶藝館',
      location: '南投縣',
      type: '全職',
      salary: '月薪 40,000 - 55,000',
      description: '負責茶藝表演、茶葉品評和茶文化推廣。',
      requirements: ['茶藝表演', '茶葉品評', '茶文化'],
      skills: ['茶藝表演', '茶葉品評', '茶文化', '茶藝證照', '茶葉知識'],
      source: '智能生成'
    },
    
    // 雲林縣職位
    {
      title: '農業工程師',
      company: '雲林農業科技公司',
      location: '雲林縣',
      type: '全職',
      salary: '月薪 55,000 - 75,000',
      description: '負責農業科技研發、智慧農業系統和農業自動化。',
      requirements: ['農業工程', '智慧農業', '農業自動化'],
      skills: ['農業工程', '智慧農業', '農業自動化', 'IoT技術', '農業科技'],
      source: '智能生成'
    },
    {
      title: '畜牧技術員',
      company: '雲林畜牧場',
      location: '雲林縣',
      type: '全職',
      salary: '月薪 40,000 - 55,000',
      description: '負責畜牧管理、動物健康和飼養技術。',
      requirements: ['畜牧管理', '動物健康', '飼養技術'],
      skills: ['畜牧管理', '動物健康', '飼養技術', '獸醫知識', '飼料管理'],
      source: '智能生成'
    },
    
    // 嘉義市職位
    {
      title: '文化創意設計師',
      company: '嘉義文創公司',
      location: '嘉義市',
      type: '全職',
      salary: '月薪 50,000 - 70,000',
      description: '負責文化創意設計、在地文化推廣和文創產品開發。',
      requirements: ['文化創意', '設計創作', '在地文化'],
      skills: ['文化創意', '設計創作', '在地文化', '文創產品', '文化推廣'],
      source: '智能生成'
    },
    {
      title: '教育科技專員',
      company: '嘉義教育科技公司',
      location: '嘉義市',
      type: '全職',
      salary: '月薪 45,000 - 65,000',
      description: '負責教育科技應用、數位學習平台和教學軟體開發。',
      requirements: ['教育科技', '數位學習', '教學軟體'],
      skills: ['教育科技', '數位學習', '教學軟體', '教育平台', '教學設計'],
      source: '智能生成'
    },
    
    // 嘉義縣職位
    {
      title: '農業推廣專員',
      company: '嘉義農業推廣站',
      location: '嘉義縣',
      type: '全職',
      salary: '月薪 45,000 - 60,000',
      description: '負責農業技術推廣、農民輔導和農業政策宣導。',
      requirements: ['農業推廣', '農民輔導', '農業政策'],
      skills: ['農業推廣', '農民輔導', '農業政策', '農業技術', '推廣教育'],
      source: '智能生成'
    },
    {
      title: '觀光產業專員',
      company: '嘉義觀光發展協會',
      location: '嘉義縣',
      type: '全職',
      salary: '月薪 40,000 - 55,000',
      description: '負責觀光產業發展、旅遊行銷和在地特色推廣。',
      requirements: ['觀光產業', '旅遊行銷', '在地特色'],
      skills: ['觀光產業', '旅遊行銷', '在地特色', '觀光規劃', '行銷推廣'],
      source: '智能生成'
    },
    
    // 屏東縣職位
    {
      title: '海洋生物研究員',
      company: '屏東海洋研究中心',
      location: '屏東縣',
      type: '全職',
      salary: '月薪 60,000 - 80,000',
      description: '負責海洋生物研究、生態調查和海洋保育工作。',
      requirements: ['海洋生物', '生態調查', '海洋保育'],
      skills: ['海洋生物', '生態調查', '海洋保育', '海洋科學', '研究分析'],
      source: '智能生成'
    },
    {
      title: '熱帶農業專員',
      company: '屏東熱帶農業研究所',
      location: '屏東縣',
      type: '全職',
      salary: '月薪 50,000 - 70,000',
      description: '負責熱帶農業研究、作物改良和農業技術開發。',
      requirements: ['熱帶農業', '作物改良', '農業技術'],
      skills: ['熱帶農業', '作物改良', '農業技術', '植物育種', '農業研究'],
      source: '智能生成'
    },
    
    // 宜蘭縣職位
    {
      title: '文創產業經理',
      company: '宜蘭文創園區',
      location: '宜蘭縣',
      type: '全職',
      salary: '月薪 65,000 - 90,000',
      description: '負責文創產業發展、園區管理和文化活動策劃。',
      requirements: ['文創產業', '園區管理', '文化活動'],
      skills: ['文創產業', '園區管理', '文化活動', '產業發展', '活動策劃'],
      source: '智能生成'
    },
    {
      title: '觀光飯店經理',
      company: '宜蘭觀光飯店',
      location: '宜蘭縣',
      type: '全職',
      salary: '月薪 70,000 - 100,000',
      description: '負責觀光飯店營運、服務管理和觀光客接待。',
      requirements: ['飯店營運', '服務管理', '觀光接待'],
      skills: ['飯店營運', '服務管理', '觀光接待', '客戶服務', '營運管理'],
      source: '智能生成'
    },
    
    // 花蓮縣職位
    {
      title: '原住民文化專員',
      company: '花蓮原住民文化中心',
      location: '花蓮縣',
      type: '全職',
      salary: '月薪 45,000 - 65,000',
      description: '負責原住民文化保存、推廣和傳承工作。',
      requirements: ['原住民文化', '文化保存', '文化推廣'],
      skills: ['原住民文化', '文化保存', '文化推廣', '文化傳承', '文化教育'],
      source: '智能生成'
    },
    {
      title: '地質研究員',
      company: '花蓮地質研究所',
      location: '花蓮縣',
      type: '全職',
      salary: '月薪 65,000 - 85,000',
      description: '負責地質研究、地震監測和地質災害評估。',
      requirements: ['地質研究', '地震監測', '地質災害'],
      skills: ['地質研究', '地震監測', '地質災害', '地質科學', '災害評估'],
      source: '智能生成'
    },
    
    // 台東縣職位
    {
      title: '原住民藝術家',
      company: '台東原住民藝術工作室',
      location: '台東縣',
      type: '全職',
      salary: '月薪 40,000 - 60,000',
      description: '負責原住民藝術創作、文化傳承和藝術教育。',
      requirements: ['原住民藝術', '藝術創作', '文化傳承'],
      skills: ['原住民藝術', '藝術創作', '文化傳承', '藝術教育', '手工藝'],
      source: '智能生成'
    },
    {
      title: '海洋保育專員',
      company: '台東海洋保育協會',
      location: '台東縣',
      type: '全職',
      salary: '月薪 45,000 - 65,000',
      description: '負責海洋保育工作、生態監測和環境教育。',
      requirements: ['海洋保育', '生態監測', '環境教育'],
      skills: ['海洋保育', '生態監測', '環境教育', '海洋生態', '保育工作'],
      source: '智能生成'
    },
    
    // 澎湖縣職位
    {
      title: '海洋觀光導覽員',
      company: '澎湖海洋觀光公司',
      location: '澎湖縣',
      type: '全職',
      salary: '月薪 40,000 - 55,000',
      description: '負責海洋觀光導覽、生態解說和遊客服務。',
      requirements: ['海洋觀光', '生態解說', '遊客服務'],
      skills: ['海洋觀光', '生態解說', '遊客服務', '海洋生態', '導覽技巧'],
      source: '智能生成'
    },
    {
      title: '漁業技術員',
      company: '澎湖漁業公司',
      location: '澎湖縣',
      type: '全職',
      salary: '月薪 45,000 - 60,000',
      description: '負責漁業技術管理、養殖技術和漁獲處理。',
      requirements: ['漁業技術', '養殖技術', '漁獲處理'],
      skills: ['漁業技術', '養殖技術', '漁獲處理', '海洋養殖', '漁業管理'],
      source: '智能生成'
    },
    
    // 金門縣職位
    {
      title: '戰地文化導覽員',
      company: '金門戰地文化園區',
      location: '金門縣',
      type: '全職',
      salary: '月薪 40,000 - 55,000',
      description: '負責戰地文化導覽、歷史解說和文化推廣。',
      requirements: ['戰地文化', '歷史解說', '文化推廣'],
      skills: ['戰地文化', '歷史解說', '文化推廣', '歷史知識', '導覽技巧'],
      source: '智能生成'
    },
    {
      title: '傳統工藝師',
      company: '金門傳統工藝坊',
      location: '金門縣',
      type: '全職',
      salary: '月薪 45,000 - 60,000',
      description: '負責傳統工藝製作、文化傳承和工藝品設計。',
      requirements: ['傳統工藝', '文化傳承', '工藝品設計'],
      skills: ['傳統工藝', '文化傳承', '工藝品設計', '手工製作', '文化保存'],
      source: '智能生成'
    },
    
    // 連江縣職位
    {
      title: '漁業管理專員',
      company: '連江漁業管理處',
      location: '連江縣',
      type: '全職',
      salary: '月薪 45,000 - 60,000',
      description: '負責漁業管理、漁獲監控和漁業政策執行。',
      requirements: ['漁業管理', '漁獲監控', '漁業政策'],
      skills: ['漁業管理', '漁獲監控', '漁業政策', '漁業法規', '資源管理'],
      source: '智能生成'
    },
    {
      title: '觀光發展專員',
      company: '連江觀光發展協會',
      location: '連江縣',
      type: '全職',
      salary: '月薪 40,000 - 55,000',
      description: '負責觀光發展規劃、旅遊推廣和在地特色行銷。',
      requirements: ['觀光發展', '旅遊推廣', '在地特色'],
      skills: ['觀光發展', '旅遊推廣', '在地特色', '觀光規劃', '行銷推廣'],
      source: '智能生成'
    }
  ];

  // 根據關鍵字篩選
  let filteredJobs = jobTemplates;
  if (keyword) {
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 根據地點篩選
  if (location) {
    filteredJobs = filteredJobs.filter(job => job.location.includes(location));
  }

  // 根據職位類型篩選
  if (jobType) {
    filteredJobs = filteredJobs.filter(job => job.type === jobType);
  }

  // 添加ID和發布日期
  return filteredJobs.slice(0, limit).map((job, index) => ({
    ...job,
    id: `smart_${Date.now()}_${index}`,
    postedDate: formatDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)),
    applyUrl: '#'
  }));
}

// 職位詳情API
router.get('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // 從智能生成資料中找到對應職位
    const allJobs = generateSmartJobs('', '', '', 100);
    const jobDetail = allJobs.find(job => job.id === jobId);

    if (jobDetail) {
      res.json({
        success: true,
        data: jobDetail
      });
    } else {
      res.status(404).json({
        success: false,
        message: '職位不存在'
      });
    }

  } catch (error) {
    console.error('職位詳情錯誤:', error.message);
    res.status(500).json({
      success: false,
      message: '獲取職位詳情失敗',
      error: error.message
    });
  }
});

// 輔助函數：格式化日期
function formatDate(dateString) {
  if (!dateString) return '未知日期';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW');
  } catch (error) {
    return dateString;
  }
}

module.exports = router;
