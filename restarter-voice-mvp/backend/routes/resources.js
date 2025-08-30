const express = require('express');
const router = express.Router();

// 資源搜尋API
router.get('/search', async (req, res) => {
  try {
    const {
      keyword = '',
      category = '',
      location = '',
      page = 1,
      limit = 20
    } = req.query;

    console.log('資源搜尋請求:', { keyword, category, location, page, limit });

    // 智能生成資源資料
    const allResources = generateSmartResources(keyword, category, location, limit);

    res.json({
      success: true,
      data: {
        resources: allResources,
        total: allResources.length,
        page: parseInt(page),
        limit: parseInt(limit),
        sources: ['智能生成資料'],
        note: '整合智能生成資料',
        dataType: '智能資源系統'
      }
    });

  } catch (error) {
    console.error('資源搜尋錯誤:', error.message);
    res.status(500).json({
      success: false,
      message: '資源搜尋服務暫時無法使用',
      error: error.message
    });
  }
});

// 智能生成資源資料
function generateSmartResources(keyword, category, location, limit) {
  const resourceTemplates = [
    // 就業服務類
    {
      id: '1',
      title: '台北市就業服務站',
      category: '就業服務',
      description: '提供免費的就業諮詢、職涯規劃、技能培訓課程等服務。',
      location: '台北市',
      contact: '02-2341-2345',
      website: 'https://www.taipei.gov.tw',
      cost: '免費',
      rating: 4.5,
      tags: ['就業諮詢', '職涯規劃', '技能培訓']
    },
    {
      id: '2',
      title: '身心障礙者就業服務中心',
      category: '特殊就業服務',
      description: '專門為身心障礙者提供就業諮詢、技能培訓、工作媒合等服務。',
      location: '台北市',
      contact: '02-2345-2345',
      cost: '免費',
      rating: 4.8,
      tags: ['身心障礙', '就業服務', '技能培訓']
    },
    {
      id: '3',
      title: '新北市就業服務站',
      category: '就業服務',
      description: '提供就業媒合、職業訓練、創業輔導等全方位就業服務。',
      location: '新北市',
      contact: '02-2345-6789',
      website: 'https://www.ntpc.gov.tw',
      cost: '免費',
      rating: 4.3,
      tags: ['就業媒合', '職業訓練', '創業輔導']
    },
    {
      id: '53',
      title: '基隆市就業服務站',
      category: '就業服務',
      description: '提供基隆地區就業諮詢、職涯規劃、技能培訓等服務。',
      location: '基隆市',
      contact: '02-2420-1234',
      cost: '免費',
      rating: 4.2,
      tags: ['就業諮詢', '職涯規劃', '技能培訓']
    },
    {
      id: '54',
      title: '新竹市就業服務站',
      category: '就業服務',
      description: '提供新竹市就業媒合、職業訓練、創業輔導等服務。',
      location: '新竹市',
      contact: '03-532-1234',
      cost: '免費',
      rating: 4.4,
      tags: ['就業媒合', '職業訓練', '創業輔導']
    },
    {
      id: '55',
      title: '新竹縣就業服務站',
      category: '就業服務',
      description: '提供新竹縣就業諮詢、技能培訓、工作媒合等服務。',
      location: '新竹縣',
      contact: '03-551-1234',
      cost: '免費',
      rating: 4.3,
      tags: ['就業諮詢', '技能培訓', '工作媒合']
    },
    {
      id: '56',
      title: '苗栗縣就業服務站',
      category: '就業服務',
      description: '提供苗栗地區就業服務、職業訓練、創業輔導等。',
      location: '苗栗縣',
      contact: '037-321-1234',
      cost: '免費',
      rating: 4.1,
      tags: ['就業服務', '職業訓練', '創業輔導']
    },
    {
      id: '57',
      title: '彰化縣就業服務站',
      category: '就業服務',
      description: '提供彰化地區就業諮詢、職涯規劃、技能培訓等服務。',
      location: '彰化縣',
      contact: '04-722-1234',
      cost: '免費',
      rating: 4.2,
      tags: ['就業諮詢', '職涯規劃', '技能培訓']
    },
    {
      id: '58',
      title: '南投縣就業服務站',
      category: '就業服務',
      description: '提供南投地區就業媒合、職業訓練、創業輔導等服務。',
      location: '南投縣',
      contact: '049-222-1234',
      cost: '免費',
      rating: 4.0,
      tags: ['就業媒合', '職業訓練', '創業輔導']
    },
    {
      id: '59',
      title: '雲林縣就業服務站',
      category: '就業服務',
      description: '提供雲林地區就業諮詢、技能培訓、工作媒合等服務。',
      location: '雲林縣',
      contact: '05-532-1234',
      cost: '免費',
      rating: 4.1,
      tags: ['就業諮詢', '技能培訓', '工作媒合']
    },
    {
      id: '60',
      title: '嘉義市就業服務站',
      category: '就業服務',
      description: '提供嘉義市就業服務、職業訓練、創業輔導等。',
      location: '嘉義市',
      contact: '05-225-1234',
      cost: '免費',
      rating: 4.3,
      tags: ['就業服務', '職業訓練', '創業輔導']
    },
    {
      id: '61',
      title: '嘉義縣就業服務站',
      category: '就業服務',
      description: '提供嘉義縣就業諮詢、職涯規劃、技能培訓等服務。',
      location: '嘉義縣',
      contact: '05-362-1234',
      cost: '免費',
      rating: 4.2,
      tags: ['就業諮詢', '職涯規劃', '技能培訓']
    },
    {
      id: '62',
      title: '屏東縣就業服務站',
      category: '就業服務',
      description: '提供屏東地區就業媒合、職業訓練、創業輔導等服務。',
      location: '屏東縣',
      contact: '08-732-1234',
      cost: '免費',
      rating: 4.1,
      tags: ['就業媒合', '職業訓練', '創業輔導']
    },
    {
      id: '63',
      title: '宜蘭縣就業服務站',
      category: '就業服務',
      description: '提供宜蘭地區就業諮詢、技能培訓、工作媒合等服務。',
      location: '宜蘭縣',
      contact: '03-932-1234',
      cost: '免費',
      rating: 4.2,
      tags: ['就業諮詢', '技能培訓', '工作媒合']
    },
    {
      id: '64',
      title: '花蓮縣就業服務站',
      category: '就業服務',
      description: '提供花蓮地區就業服務、職業訓練、創業輔導等。',
      location: '花蓮縣',
      contact: '03-822-1234',
      cost: '免費',
      rating: 4.0,
      tags: ['就業服務', '職業訓練', '創業輔導']
    },
    {
      id: '65',
      title: '台東縣就業服務站',
      category: '就業服務',
      description: '提供台東地區就業諮詢、職涯規劃、技能培訓等服務。',
      location: '台東縣',
      contact: '089-322-1234',
      cost: '免費',
      rating: 4.1,
      tags: ['就業諮詢', '職涯規劃', '技能培訓']
    },
    {
      id: '66',
      title: '澎湖縣就業服務站',
      category: '就業服務',
      description: '提供澎湖地區就業媒合、職業訓練、創業輔導等服務。',
      location: '澎湖縣',
      contact: '06-927-1234',
      cost: '免費',
      rating: 4.0,
      tags: ['就業媒合', '職業訓練', '創業輔導']
    },
    {
      id: '67',
      title: '金門縣就業服務站',
      category: '就業服務',
      description: '提供金門地區就業諮詢、技能培訓、工作媒合等服務。',
      location: '金門縣',
      contact: '082-312-1234',
      cost: '免費',
      rating: 4.1,
      tags: ['就業諮詢', '技能培訓', '工作媒合']
    },
    {
      id: '68',
      title: '連江縣就業服務站',
      category: '就業服務',
      description: '提供連江地區就業服務、職業訓練、創業輔導等。',
      location: '連江縣',
      contact: '0836-221-234',
      cost: '免費',
      rating: 4.0,
      tags: ['就業服務', '職業訓練', '創業輔導']
    },
    
    // 職業培訓類
    {
      id: '4',
      title: '新北市職業訓練中心',
      category: '職業培訓',
      description: '提供各種職業技能培訓課程，包括程式設計、設計、行銷等。',
      location: '新北市',
      contact: '02-2345-6789',
      website: 'https://www.ntpc.gov.tw',
      cost: '部分免費',
      rating: 4.3,
      tags: ['程式設計', '設計', '行銷', '職業培訓']
    },
    {
      id: '5',
      title: '勞動部勞動力發展署',
      category: '職業培訓',
      description: '全國性的職業訓練和技能發展機構，提供多元化的培訓課程。',
      location: '台北市',
      contact: '02-2345-1111',
      website: 'https://www.wda.gov.tw',
      cost: '部分免費',
      rating: 4.6,
      tags: ['職業訓練', '技能發展', '全國性']
    },
    {
      id: '6',
      title: '技能發展中心',
      category: '職業培訓',
      description: '專注於技能發展和職業認證的專業培訓機構。',
      location: '台中市',
      contact: '04-2345-6789',
      cost: '收費',
      rating: 4.4,
      tags: ['技能發展', '職業認證', '專業培訓']
    },
    {
      id: '69',
      title: '基隆市職業訓練中心',
      category: '職業培訓',
      description: '提供基隆地區職業技能培訓和技能認證服務。',
      location: '基隆市',
      contact: '02-2420-5678',
      cost: '部分免費',
      rating: 4.2,
      tags: ['職業技能', '技能認證', '專業培訓']
    },
    {
      id: '70',
      title: '新竹市職業訓練中心',
      category: '職業培訓',
      description: '提供新竹市科技產業相關職業培訓課程。',
      location: '新竹市',
      contact: '03-532-5678',
      cost: '收費',
      rating: 4.5,
      tags: ['科技產業', '職業培訓', '技能發展']
    },
    {
      id: '71',
      title: '新竹縣職業訓練中心',
      category: '職業培訓',
      description: '提供新竹縣多元化職業技能培訓服務。',
      location: '新竹縣',
      contact: '03-551-5678',
      cost: '部分免費',
      rating: 4.3,
      tags: ['多元化培訓', '職業技能', '技能發展']
    },
    {
      id: '72',
      title: '苗栗縣職業訓練中心',
      category: '職業培訓',
      description: '提供苗栗地區傳統產業和現代技能培訓。',
      location: '苗栗縣',
      contact: '037-321-5678',
      cost: '部分免費',
      rating: 4.1,
      tags: ['傳統產業', '現代技能', '職業培訓']
    },
    {
      id: '73',
      title: '彰化縣職業訓練中心',
      category: '職業培訓',
      description: '提供彰化地區製造業和服務業技能培訓。',
      location: '彰化縣',
      contact: '04-722-5678',
      cost: '部分免費',
      rating: 4.2,
      tags: ['製造業', '服務業', '技能培訓']
    },
    {
      id: '74',
      title: '南投縣職業訓練中心',
      category: '職業培訓',
      description: '提供南投地區觀光產業和在地技能培訓。',
      location: '南投縣',
      contact: '049-222-5678',
      cost: '部分免費',
      rating: 4.0,
      tags: ['觀光產業', '在地技能', '職業培訓']
    },
    {
      id: '75',
      title: '雲林縣職業訓練中心',
      category: '職業培訓',
      description: '提供雲林地區農業和科技技能培訓服務。',
      location: '雲林縣',
      contact: '05-532-5678',
      cost: '部分免費',
      rating: 4.1,
      tags: ['農業技能', '科技技能', '職業培訓']
    },
    {
      id: '76',
      title: '嘉義市職業訓練中心',
      category: '職業培訓',
      description: '提供嘉義市多元職業技能培訓和認證服務。',
      location: '嘉義市',
      contact: '05-225-5678',
      cost: '收費',
      rating: 4.3,
      tags: ['多元技能', '職業認證', '專業培訓']
    },
    {
      id: '77',
      title: '嘉義縣職業訓練中心',
      category: '職業培訓',
      description: '提供嘉義縣農業和觀光產業技能培訓。',
      location: '嘉義縣',
      contact: '05-362-5678',
      cost: '部分免費',
      rating: 4.2,
      tags: ['農業技能', '觀光產業', '職業培訓']
    },
    {
      id: '78',
      title: '屏東縣職業訓練中心',
      category: '職業培訓',
      description: '提供屏東地區農業和海洋產業技能培訓。',
      location: '屏東縣',
      contact: '08-732-5678',
      cost: '部分免費',
      rating: 4.1,
      tags: ['農業技能', '海洋產業', '職業培訓']
    },
    {
      id: '79',
      title: '宜蘭縣職業訓練中心',
      category: '職業培訓',
      description: '提供宜蘭地區觀光和文創產業技能培訓。',
      location: '宜蘭縣',
      contact: '03-932-5678',
      cost: '部分免費',
      rating: 4.2,
      tags: ['觀光產業', '文創產業', '職業培訓']
    },
    {
      id: '80',
      title: '花蓮縣職業訓練中心',
      category: '職業培訓',
      description: '提供花蓮地區觀光和原住民文化技能培訓。',
      location: '花蓮縣',
      contact: '03-822-5678',
      cost: '部分免費',
      rating: 4.0,
      tags: ['觀光產業', '原住民文化', '職業培訓']
    },
    {
      id: '81',
      title: '台東縣職業訓練中心',
      category: '職業培訓',
      description: '提供台東地區觀光和原住民技能培訓服務。',
      location: '台東縣',
      contact: '089-322-5678',
      cost: '部分免費',
      rating: 4.1,
      tags: ['觀光產業', '原住民技能', '職業培訓']
    },
    {
      id: '82',
      title: '澎湖縣職業訓練中心',
      category: '職業培訓',
      description: '提供澎湖地區觀光和海洋產業技能培訓。',
      location: '澎湖縣',
      contact: '06-927-5678',
      cost: '部分免費',
      rating: 4.0,
      tags: ['觀光產業', '海洋產業', '職業培訓']
    },
    {
      id: '83',
      title: '金門縣職業訓練中心',
      category: '職業培訓',
      description: '提供金門地區觀光和傳統產業技能培訓。',
      location: '金門縣',
      contact: '082-312-5678',
      cost: '部分免費',
      rating: 4.1,
      tags: ['觀光產業', '傳統產業', '職業培訓']
    },
    {
      id: '84',
      title: '連江縣職業訓練中心',
      category: '職業培訓',
      description: '提供連江地區觀光和漁業技能培訓服務。',
      location: '連江縣',
      contact: '0836-221-678',
      cost: '部分免費',
      rating: 4.0,
      tags: ['觀光產業', '漁業技能', '職業培訓']
    },
    
    // 心理健康類
    {
      id: '7',
      title: '心理諮商中心',
      category: '心理健康',
      description: '專業的心理諮商服務，幫助您處理職涯轉換過程中的心理壓力。',
      location: '台北市',
      contact: '02-2345-1234',
      cost: '收費',
      rating: 4.7,
      tags: ['心理諮商', '壓力管理', '職涯輔導']
    },
    {
      id: '8',
      title: '心理健康中心',
      category: '心理健康',
      description: '提供心理健康評估、諮商治療、心理教育等服務。',
      location: '台北市',
      contact: '02-2345-5678',
      cost: '收費',
      rating: 4.5,
      tags: ['心理健康', '心理評估', '心理教育']
    },
    {
      id: '9',
      title: '精神衛生中心',
      category: '心理健康',
      description: '專業的精神衛生服務，提供心理治療和精神健康諮詢。',
      location: '高雄市',
      contact: '07-2345-6789',
      cost: '部分免費',
      rating: 4.2,
      tags: ['精神衛生', '心理治療', '精神健康']
    },
    
    // 創業支援類
    {
      id: '10',
      title: '創業輔導中心',
      category: '創業支援',
      description: '提供創業諮詢、資金申請、商業計劃書撰寫等服務。',
      location: '台北市',
      contact: '02-2345-5678',
      website: 'https://www.sme.gov.tw',
      cost: '免費諮詢',
      rating: 4.2,
      tags: ['創業諮詢', '資金申請', '商業計劃']
    },
    {
      id: '11',
      title: '創業育成中心',
      category: '創業支援',
      description: '提供創業空間、技術支援、商業輔導等全方位創業服務。',
      location: '新北市',
      contact: '02-2345-9012',
      cost: '收費',
      rating: 4.4,
      tags: ['創業空間', '技術支援', '商業輔導']
    },
    {
      id: '12',
      title: '創業加速器',
      category: '創業支援',
      description: '專注於新創企業加速成長，提供資金、導師、資源等支援。',
      location: '台北市',
      contact: '02-2345-3456',
      cost: '收費',
      rating: 4.6,
      tags: ['創業加速', '資金支援', '導師指導']
    },
    
    // 語言培訓類
    {
      id: '13',
      title: '語言學習中心',
      category: '語言培訓',
      description: '提供英語、日語、韓語等多種語言培訓課程。',
      location: '台北市',
      contact: '02-2345-9012',
      cost: '收費',
      rating: 4.4,
      tags: ['英語', '日語', '韓語', '語言培訓']
    },
    {
      id: '14',
      title: '英語培訓中心',
      category: '語言培訓',
      description: '專業的英語培訓機構，提供商務英語、考試英語等課程。',
      location: '台北市',
      contact: '02-2345-7890',
      cost: '收費',
      rating: 4.5,
      tags: ['英語培訓', '商務英語', '考試英語']
    },
    {
      id: '15',
      title: '日語培訓中心',
      category: '語言培訓',
      description: '專業的日語培訓，提供JLPT考試準備和實用日語課程。',
      location: '台北市',
      contact: '02-2345-3456',
      cost: '收費',
      rating: 4.3,
      tags: ['日語培訓', 'JLPT考試', '實用日語']
    },
    
    // 技能培訓類
    {
      id: '16',
      title: '數位技能培訓中心',
      category: '技能培訓',
      description: '提供AI、大數據、雲端運算等數位技能培訓課程。',
      location: '新北市',
      contact: '02-2345-3456',
      website: 'https://www.digital-skills.org',
      cost: '收費',
      rating: 4.6,
      tags: ['AI', '大數據', '雲端運算', '數位技能']
    },
    {
      id: '17',
      title: '程式設計培訓中心',
      category: '技能培訓',
      description: '專業的程式設計培訓，涵蓋前端、後端、全端開發技能。',
      location: '台北市',
      contact: '02-2345-6789',
      cost: '收費',
      rating: 4.7,
      tags: ['程式設計', '前端開發', '後端開發', '全端開發']
    },
    {
      id: '18',
      title: 'UI/UX設計培訓中心',
      category: '技能培訓',
      description: '專業的UI/UX設計培訓，培養現代化的設計思維和技能。',
      location: '台北市',
      contact: '02-2345-1234',
      cost: '收費',
      rating: 4.5,
      tags: ['UI設計', 'UX設計', '設計思維', '用戶體驗']
    },
    
    // 職涯輔導類
    {
      id: '19',
      title: '職涯發展協會',
      category: '職涯輔導',
      description: '提供職涯規劃、履歷撰寫、面試技巧等專業輔導服務。',
      location: '台北市',
      contact: '02-2345-7890',
      cost: '會員制',
      rating: 4.1,
      tags: ['職涯規劃', '履歷撰寫', '面試技巧']
    },
    {
      id: '20',
      title: '職涯規劃中心',
      category: '職涯輔導',
      description: '專業的職涯規劃服務，幫助您找到適合的職業發展方向。',
      location: '台中市',
      contact: '04-2345-6789',
      cost: '收費',
      rating: 4.3,
      tags: ['職涯規劃', '職業發展', '職涯諮詢']
    },
    {
      id: '21',
      title: '職涯諮詢中心',
      category: '職涯輔導',
      description: '提供一對一的職涯諮詢服務，協助解決職涯發展問題。',
      location: '高雄市',
      contact: '07-2345-6789',
      cost: '收費',
      rating: 4.4,
      tags: ['職涯諮詢', '一對一服務', '職涯發展']
    },
    
    // 特殊就業服務類
    {
      id: '22',
      title: '視覺障礙者就業服務中心',
      category: '特殊就業服務',
      description: '專門為視覺障礙者提供就業服務和技能培訓。',
      location: '台北市',
      contact: '02-2345-2346',
      cost: '免費',
      rating: 4.6,
      tags: ['視覺障礙', '就業服務', '技能培訓']
    },
    {
      id: '23',
      title: '聽覺障礙者就業服務中心',
      category: '特殊就業服務',
      description: '專門為聽覺障礙者提供就業服務和溝通技能培訓。',
      location: '台北市',
      contact: '02-2345-2347',
      cost: '免費',
      rating: 4.5,
      tags: ['聽覺障礙', '就業服務', '溝通技能']
    },
    {
      id: '24',
      title: '肢體障礙者就業服務中心',
      category: '特殊就業服務',
      description: '專門為肢體障礙者提供就業服務和無障礙工作環境支援。',
      location: '台北市',
      contact: '02-2345-2348',
      cost: '免費',
      rating: 4.4,
      tags: ['肢體障礙', '就業服務', '無障礙環境']
    },
    
    // 教育培訓類
    {
      id: '25',
      title: '成人教育中心',
      category: '教育培訓',
      description: '提供成人教育和終身學習課程，促進個人成長和發展。',
      location: '台北市',
      contact: '02-2345-3457',
      cost: '收費',
      rating: 4.2,
      tags: ['成人教育', '終身學習', '個人成長']
    },
    {
      id: '26',
      title: '社區大學',
      category: '教育培訓',
      description: '提供多元化的社區教育課程，促進社區發展和學習。',
      location: '台北市',
      contact: '02-2345-3458',
      cost: '收費',
      rating: 4.3,
      tags: ['社區教育', '多元課程', '社區發展']
    },
    {
      id: '27',
      title: '推廣教育中心',
      category: '教育培訓',
      description: '提供推廣教育課程，滿足不同年齡層的學習需求。',
      location: '台中市',
      contact: '04-2345-6789',
      cost: '收費',
      rating: 4.1,
      tags: ['推廣教育', '多元學習', '年齡層需求']
    },
    
    // 金融理財類
    {
      id: '28',
      title: '理財諮詢中心',
      category: '金融理財',
      description: '提供個人理財規劃和投資諮詢服務。',
      location: '台北市',
      contact: '02-2345-4567',
      cost: '收費',
      rating: 4.5,
      tags: ['理財規劃', '投資諮詢', '個人理財']
    },
    {
      id: '29',
      title: '財務規劃中心',
      category: '金融理財',
      description: '專業的財務規劃服務，協助制定個人財務目標。',
      location: '台北市',
      contact: '02-2345-4568',
      cost: '收費',
      rating: 4.4,
      tags: ['財務規劃', '財務目標', '個人財務']
    },
    {
      id: '30',
      title: '退休規劃中心',
      category: '金融理財',
      description: '專門提供退休規劃和養老金管理諮詢服務。',
      location: '台北市',
      contact: '02-2345-4569',
      cost: '收費',
      rating: 4.3,
      tags: ['退休規劃', '養老金管理', '退休諮詢']
    },
    
    // 法律服務類
    {
      id: '31',
      title: '法律諮詢中心',
      category: '法律服務',
      description: '提供法律諮詢和法律文件審查服務。',
      location: '台北市',
      contact: '02-2345-5678',
      cost: '收費',
      rating: 4.6,
      tags: ['法律諮詢', '法律文件', '法律服務']
    },
    {
      id: '32',
      title: '法律援助中心',
      category: '法律服務',
      description: '為經濟困難者提供免費的法律援助服務。',
      location: '台北市',
      contact: '02-2345-5679',
      cost: '免費',
      rating: 4.4,
      tags: ['法律援助', '免費服務', '法律支援']
    },
    {
      id: '33',
      title: '法律教育中心',
      category: '法律服務',
      description: '提供法律教育和法律知識普及服務。',
      location: '台北市',
      contact: '02-2345-5680',
      cost: '收費',
      rating: 4.2,
      tags: ['法律教育', '法律知識', '法律普及']
    },
    
    // 醫療健康類
    {
      id: '34',
      title: '健康管理中心',
      category: '醫療健康',
      description: '提供健康檢查、健康諮詢和健康管理服務。',
      location: '台北市',
      contact: '02-2345-6789',
      cost: '收費',
      rating: 4.5,
      tags: ['健康檢查', '健康諮詢', '健康管理']
    },
    {
      id: '35',
      title: '營養諮詢中心',
      category: '醫療健康',
      description: '提供營養諮詢和飲食規劃服務。',
      location: '台北市',
      contact: '02-2345-6790',
      cost: '收費',
      rating: 4.3,
      tags: ['營養諮詢', '飲食規劃', '健康飲食']
    },
    {
      id: '36',
      title: '運動健身中心',
      category: '醫療健康',
      description: '提供運動健身指導和體能訓練服務。',
      location: '台北市',
      contact: '02-2345-6791',
      cost: '收費',
      rating: 4.4,
      tags: ['運動健身', '體能訓練', '健身指導']
    },
    
    // 社會服務類
    {
      id: '37',
      title: '社會服務中心',
      category: '社會服務',
      description: '提供社會工作和社會服務支援。',
      location: '台北市',
      contact: '02-2345-7890',
      cost: '免費',
      rating: 4.2,
      tags: ['社會工作', '社會服務', '社會支援']
    },
    {
      id: '38',
      title: '社會福利中心',
      category: '社會服務',
      description: '提供社會福利諮詢和申請協助服務。',
      location: '台北市',
      contact: '02-2345-7891',
      cost: '免費',
      rating: 4.1,
      tags: ['社會福利', '福利諮詢', '申請協助']
    },
    {
      id: '39',
      title: '社會救助中心',
      category: '社會服務',
      description: '提供社會救助和緊急援助服務。',
      location: '台北市',
      contact: '02-2345-7892',
      cost: '免費',
      rating: 4.3,
      tags: ['社會救助', '緊急援助', '救助服務']
    },
    
    // 文化藝術類
    {
      id: '40',
      title: '文化藝術中心',
      category: '文化藝術',
      description: '提供文化藝術展覽和藝術教育服務。',
      location: '台北市',
      contact: '02-2345-8901',
      cost: '部分免費',
      rating: 4.4,
      tags: ['文化藝術', '藝術展覽', '藝術教育']
    },
    {
      id: '41',
      title: '美術館',
      category: '文化藝術',
      description: '提供美術展覽和藝術欣賞服務。',
      location: '台北市',
      contact: '02-2345-8902',
      cost: '收費',
      rating: 4.6,
      tags: ['美術展覽', '藝術欣賞', '美術教育']
    },
    {
      id: '42',
      title: '博物館',
      category: '文化藝術',
      description: '提供文物展覽和文化教育服務。',
      location: '台北市',
      contact: '02-2345-8903',
      cost: '收費',
      rating: 4.5,
      tags: ['文物展覽', '文化教育', '歷史文化']
    },
    
    // 科技創新類
    {
      id: '43',
      title: '科技創新中心',
      category: '科技創新',
      description: '提供科技創新和研發支援服務。',
      location: '新北市',
      contact: '02-2345-9012',
      cost: '收費',
      rating: 4.4,
      tags: ['科技創新', '研發支援', '技術創新']
    },
    {
      id: '44',
      title: '研發中心',
      category: '科技創新',
      description: '提供研發服務和技術開發支援。',
      location: '新北市',
      contact: '02-2345-9013',
      cost: '收費',
      rating: 4.3,
      tags: ['研發服務', '技術開發', '創新研發']
    },
    {
      id: '45',
      title: '技術中心',
      category: '科技創新',
      description: '提供技術諮詢和技術轉移服務。',
      location: '新北市',
      contact: '02-2345-9014',
      cost: '收費',
      rating: 4.2,
      tags: ['技術諮詢', '技術轉移', '技術服務']
    },
    
    // 環境保護類
    {
      id: '46',
      title: '環境保護中心',
      category: '環境保護',
      description: '提供環境保護教育和環保諮詢服務。',
      location: '台北市',
      contact: '02-2345-0123',
      cost: '免費',
      rating: 4.1,
      tags: ['環境保護', '環保教育', '環保諮詢']
    },
    {
      id: '47',
      title: '環保教育中心',
      category: '環境保護',
      description: '提供環保教育和環境意識提升服務。',
      location: '台北市',
      contact: '02-2345-0124',
      cost: '免費',
      rating: 4.0,
      tags: ['環保教育', '環境意識', '環保培訓']
    },
    {
      id: '48',
      title: '環保培訓中心',
      category: '環境保護',
      description: '提供環保技術培訓和環保認證服務。',
      location: '台北市',
      contact: '02-2345-0125',
      cost: '收費',
      rating: 4.2,
      tags: ['環保技術', '環保培訓', '環保認證']
    },
    
    // 其他專業類
    {
      id: '49',
      title: '專業諮詢中心',
      category: '其他專業',
      description: '提供各類專業諮詢和顧問服務。',
      location: '台北市',
      contact: '02-2345-1234',
      cost: '收費',
      rating: 4.3,
      tags: ['專業諮詢', '顧問服務', '專業支援']
    },
    {
      id: '50',
      title: '顧問服務中心',
      category: '其他專業',
      description: '提供企業顧問和專業諮詢服務。',
      location: '台北市',
      contact: '02-2345-1235',
      cost: '收費',
      rating: 4.4,
      tags: ['企業顧問', '專業諮詢', '顧問服務']
    },
    {
      id: '51',
      title: '研究發展中心',
      category: '其他專業',
      description: '提供研究發展和技術創新服務。',
      location: '台北市',
      contact: '02-2345-1236',
      cost: '收費',
      rating: 4.2,
      tags: ['研究發展', '技術創新', '研發服務']
    },
    {
      id: '52',
      title: '技術服務中心',
      category: '其他專業',
      description: '提供技術服務和技術支援。',
      location: '台北市',
      contact: '02-2345-1237',
      cost: '收費',
      rating: 4.1,
      tags: ['技術服務', '技術支援', '技術諮詢']
    },
    
    // 教育發展類
    {
      id: '85',
      title: '成人教育中心',
      category: '成人教育',
      description: '提供成人教育和終身學習課程，促進個人成長和發展。',
      location: '台北市',
      contact: '02-2345-3457',
      cost: '收費',
      rating: 4.2,
      tags: ['成人教育', '終身學習', '個人成長']
    },
    {
      id: '86',
      title: '社區大學',
      category: '社區教育',
      description: '提供多元化的社區教育課程，促進社區發展和學習。',
      location: '台北市',
      contact: '02-2345-3458',
      cost: '收費',
      rating: 4.3,
      tags: ['社區教育', '多元課程', '社區發展']
    },
    {
      id: '87',
      title: '推廣教育中心',
      category: '推廣教育',
      description: '提供推廣教育課程，滿足不同年齡層的學習需求。',
      location: '台中市',
      contact: '04-2345-6789',
      cost: '收費',
      rating: 4.1,
      tags: ['推廣教育', '多元學習', '年齡層需求']
    },
    
    // 金融理財類
    {
      id: '88',
      title: '理財諮詢中心',
      category: '理財諮詢',
      description: '提供個人理財規劃和投資諮詢服務。',
      location: '台北市',
      contact: '02-2345-4567',
      cost: '收費',
      rating: 4.5,
      tags: ['理財規劃', '投資諮詢', '個人理財']
    },
    {
      id: '89',
      title: '財務規劃中心',
      category: '財務規劃',
      description: '專業的財務規劃服務，協助制定個人財務目標。',
      location: '台北市',
      contact: '02-2345-4568',
      cost: '收費',
      rating: 4.4,
      tags: ['財務規劃', '財務目標', '個人財務']
    },
    {
      id: '90',
      title: '退休規劃中心',
      category: '退休規劃',
      description: '專門提供退休規劃和養老金管理諮詢服務。',
      location: '台北市',
      contact: '02-2345-4569',
      cost: '收費',
      rating: 4.3,
      tags: ['退休規劃', '養老金管理', '退休諮詢']
    },
    
    // 法律服務類
    {
      id: '91',
      title: '法律諮詢中心',
      category: '法律諮詢',
      description: '提供法律諮詢和法律文件審查服務。',
      location: '台北市',
      contact: '02-2345-5678',
      cost: '收費',
      rating: 4.6,
      tags: ['法律諮詢', '法律文件', '法律服務']
    },
    {
      id: '92',
      title: '法律援助中心',
      category: '法律援助',
      description: '為經濟困難者提供免費的法律援助服務。',
      location: '台北市',
      contact: '02-2345-5679',
      cost: '免費',
      rating: 4.4,
      tags: ['法律援助', '免費服務', '法律支援']
    },
    {
      id: '93',
      title: '法律教育中心',
      category: '法律教育',
      description: '提供法律教育和法律知識普及服務。',
      location: '台北市',
      contact: '02-2345-5680',
      cost: '收費',
      rating: 4.2,
      tags: ['法律教育', '法律知識', '法律普及']
    },
    
    // 醫療健康類
    {
      id: '94',
      title: '健康管理中心',
      category: '健康管理',
      description: '提供健康檢查、健康諮詢和健康管理服務。',
      location: '台北市',
      contact: '02-2345-6789',
      cost: '收費',
      rating: 4.5,
      tags: ['健康檢查', '健康諮詢', '健康管理']
    },
    {
      id: '95',
      title: '營養諮詢中心',
      category: '營養諮詢',
      description: '提供營養諮詢和飲食規劃服務。',
      location: '台北市',
      contact: '02-2345-6790',
      cost: '收費',
      rating: 4.3,
      tags: ['營養諮詢', '飲食規劃', '健康飲食']
    },
    {
      id: '96',
      title: '運動健身中心',
      category: '運動健身',
      description: '提供運動健身指導和體能訓練服務。',
      location: '台北市',
      contact: '02-2345-6791',
      cost: '收費',
      rating: 4.4,
      tags: ['運動健身', '體能訓練', '健身指導']
    },
    
    // 社會服務類
    {
      id: '97',
      title: '社會服務中心',
      category: '社會服務',
      description: '提供社會工作和社會服務支援。',
      location: '台北市',
      contact: '02-2345-7890',
      cost: '免費',
      rating: 4.2,
      tags: ['社會工作', '社會服務', '社會支援']
    },
    {
      id: '98',
      title: '社會福利中心',
      category: '社會福利',
      description: '提供社會福利諮詢和申請協助服務。',
      location: '台北市',
      contact: '02-2345-7891',
      cost: '免費',
      rating: 4.1,
      tags: ['社會福利', '福利諮詢', '申請協助']
    },
    {
      id: '99',
      title: '社會救助中心',
      category: '社會救助',
      description: '提供社會救助和緊急援助服務。',
      location: '台北市',
      contact: '02-2345-7892',
      cost: '免費',
      rating: 4.3,
      tags: ['社會救助', '緊急援助', '救助服務']
    },
    
    // 文化藝術類
    {
      id: '100',
      title: '文化藝術中心',
      category: '文化藝術',
      description: '提供文化藝術展覽和藝術教育服務。',
      location: '台北市',
      contact: '02-2345-8901',
      cost: '部分免費',
      rating: 4.4,
      tags: ['文化藝術', '藝術展覽', '藝術教育']
    },
    {
      id: '101',
      title: '美術館',
      category: '藝術教育',
      description: '提供美術展覽和藝術欣賞服務。',
      location: '台北市',
      contact: '02-2345-8902',
      cost: '收費',
      rating: 4.6,
      tags: ['美術展覽', '藝術欣賞', '美術教育']
    },
    {
      id: '102',
      title: '博物館',
      category: '文化保存',
      description: '提供文物展覽和文化教育服務。',
      location: '台北市',
      contact: '02-2345-8903',
      cost: '收費',
      rating: 4.5,
      tags: ['文物展覽', '文化教育', '歷史文化']
    },
    
    // 科技創新類
    {
      id: '103',
      title: '科技創新中心',
      category: '科技創新',
      description: '提供科技創新和研發支援服務。',
      location: '新北市',
      contact: '02-2345-9012',
      cost: '收費',
      rating: 4.4,
      tags: ['科技創新', '研發支援', '技術創新']
    },
    {
      id: '104',
      title: '研發中心',
      category: '研發服務',
      description: '提供研發服務和技術開發支援。',
      location: '新北市',
      contact: '02-2345-9013',
      cost: '收費',
      rating: 4.3,
      tags: ['研發服務', '技術開發', '創新研發']
    },
    {
      id: '105',
      title: '技術中心',
      category: '技術服務',
      description: '提供技術諮詢和技術轉移服務。',
      location: '新北市',
      contact: '02-2345-9014',
      cost: '收費',
      rating: 4.2,
      tags: ['技術諮詢', '技術轉移', '技術服務']
    },
    
    // 環境保護類
    {
      id: '106',
      title: '環境保護中心',
      category: '環境保護',
      description: '提供環境保護教育和環保諮詢服務。',
      location: '台北市',
      contact: '02-2345-0123',
      cost: '免費',
      rating: 4.1,
      tags: ['環境保護', '環保教育', '環保諮詢']
    },
    {
      id: '107',
      title: '環保教育中心',
      category: '環保教育',
      description: '提供環保教育和環境意識提升服務。',
      location: '台北市',
      contact: '02-2345-0124',
      cost: '免費',
      rating: 4.0,
      tags: ['環保教育', '環境意識', '環保培訓']
    },
    {
      id: '108',
      title: '環保培訓中心',
      category: '環保培訓',
      description: '提供環保技術培訓和環保認證服務。',
      location: '台北市',
      contact: '02-2345-0125',
      cost: '收費',
      rating: 4.2,
      tags: ['環保技術', '環保培訓', '環保認證']
    },
    
    // 農業發展類
    {
      id: '109',
      title: '農業技術推廣站',
      category: '農業技術',
      description: '提供農業技術推廣和農民輔導服務。',
      location: '雲林縣',
      contact: '05-532-3456',
      cost: '免費',
      rating: 4.3,
      tags: ['農業技術', '農民輔導', '技術推廣']
    },
    {
      id: '110',
      title: '農業推廣中心',
      category: '農業推廣',
      description: '提供農業推廣和農業政策宣導服務。',
      location: '嘉義縣',
      contact: '05-362-3456',
      cost: '免費',
      rating: 4.2,
      tags: ['農業推廣', '農業政策', '推廣教育']
    },
    {
      id: '111',
      title: '農業諮詢中心',
      category: '農業諮詢',
      description: '提供農業諮詢和農業問題解決服務。',
      location: '屏東縣',
      contact: '08-732-3456',
      cost: '免費',
      rating: 4.1,
      tags: ['農業諮詢', '問題解決', '農業服務']
    },
    
    // 觀光旅遊類
    {
      id: '112',
      title: '觀光旅遊中心',
      category: '觀光旅遊',
      description: '提供觀光旅遊資訊和旅遊規劃服務。',
      location: '南投縣',
      contact: '049-222-3456',
      cost: '免費',
      rating: 4.4,
      tags: ['觀光旅遊', '旅遊資訊', '旅遊規劃']
    },
    {
      id: '113',
      title: '旅遊服務中心',
      category: '旅遊服務',
      description: '提供旅遊服務和遊客接待服務。',
      location: '宜蘭縣',
      contact: '03-932-3456',
      cost: '免費',
      rating: 4.3,
      tags: ['旅遊服務', '遊客接待', '旅遊諮詢']
    },
    {
      id: '114',
      title: '導覽服務中心',
      category: '導覽服務',
      description: '提供專業導覽和旅遊解說服務。',
      location: '花蓮縣',
      contact: '03-822-3456',
      cost: '收費',
      rating: 4.2,
      tags: ['導覽服務', '旅遊解說', '專業導覽']
    },
    
    // 餐飲服務類
    {
      id: '115',
      title: '餐飲服務中心',
      category: '餐飲服務',
      description: '提供餐飲服務和餐飲管理諮詢。',
      location: '台北市',
      contact: '02-2345-2345',
      cost: '收費',
      rating: 4.3,
      tags: ['餐飲服務', '餐飲管理', '餐飲諮詢']
    },
    {
      id: '116',
      title: '廚藝培訓中心',
      category: '廚藝培訓',
      description: '提供廚藝培訓和烹飪技能教學。',
      location: '台北市',
      contact: '02-2345-2346',
      cost: '收費',
      rating: 4.4,
      tags: ['廚藝培訓', '烹飪技能', '廚藝教學']
    },
    {
      id: '117',
      title: '餐飲管理學院',
      category: '餐飲管理',
      description: '提供餐飲管理和餐飲經營培訓。',
      location: '台北市',
      contact: '02-2345-2347',
      cost: '收費',
      rating: 4.2,
      tags: ['餐飲管理', '餐飲經營', '管理培訓']
    },
    
    // 美容美髮類
    {
      id: '118',
      title: '美容美髮中心',
      category: '美容美髮',
      description: '提供美容美髮服務和造型設計。',
      location: '台北市',
      contact: '02-2345-3456',
      cost: '收費',
      rating: 4.3,
      tags: ['美容美髮', '造型設計', '美容服務']
    },
    {
      id: '119',
      title: '美容培訓中心',
      category: '美容培訓',
      description: '提供美容培訓和美容技能教學。',
      location: '台北市',
      contact: '02-2345-3457',
      cost: '收費',
      rating: 4.2,
      tags: ['美容培訓', '美容技能', '美容教學']
    },
    {
      id: '120',
      title: '美髮培訓中心',
      category: '美髮培訓',
      description: '提供美髮培訓和美髮技能教學。',
      location: '台北市',
      contact: '02-2345-3458',
      cost: '收費',
      rating: 4.1,
      tags: ['美髮培訓', '美髮技能', '美髮教學']
    },
    
    // 汽車服務類
    {
      id: '121',
      title: '汽車服務中心',
      category: '汽車服務',
      description: '提供汽車服務和汽車維修保養。',
      location: '台北市',
      contact: '02-2345-4567',
      cost: '收費',
      rating: 4.2,
      tags: ['汽車服務', '汽車維修', '汽車保養']
    },
    {
      id: '122',
      title: '汽車維修中心',
      category: '汽車維修',
      description: '提供汽車維修和故障排除服務。',
      location: '台北市',
      contact: '02-2345-4568',
      cost: '收費',
      rating: 4.3,
      tags: ['汽車維修', '故障排除', '維修服務']
    },
    {
      id: '123',
      title: '汽車保養中心',
      category: '汽車保養',
      description: '提供汽車保養和定期維護服務。',
      location: '台北市',
      contact: '02-2345-4569',
      cost: '收費',
      rating: 4.1,
      tags: ['汽車保養', '定期維護', '保養服務']
    },
    
    // 建築裝潢類
    {
      id: '124',
      title: '建築裝潢中心',
      category: '建築裝潢',
      description: '提供建築裝潢和室內設計服務。',
      location: '台北市',
      contact: '02-2345-5678',
      cost: '收費',
      rating: 4.4,
      tags: ['建築裝潢', '室內設計', '裝潢服務']
    },
    {
      id: '125',
      title: '建築設計中心',
      category: '建築設計',
      description: '提供建築設計和工程規劃服務。',
      location: '台北市',
      contact: '02-2345-5679',
      cost: '收費',
      rating: 4.5,
      tags: ['建築設計', '工程規劃', '設計服務']
    },
    {
      id: '126',
      title: '室內設計中心',
      category: '室內設計',
      description: '提供室內設計和空間規劃服務。',
      location: '台北市',
      contact: '02-2345-5680',
      cost: '收費',
      rating: 4.3,
      tags: ['室內設計', '空間規劃', '設計服務']
    },
    
    // 資訊科技類
    {
      id: '127',
      title: '資訊科技中心',
      category: '資訊科技',
      description: '提供資訊科技和數位化服務。',
      location: '台北市',
      contact: '02-2345-6789',
      cost: '收費',
      rating: 4.4,
      tags: ['資訊科技', '數位化', '科技服務']
    },
    {
      id: '128',
      title: '軟體開發中心',
      category: '軟體開發',
      description: '提供軟體開發和程式設計服務。',
      location: '台北市',
      contact: '02-2345-6790',
      cost: '收費',
      rating: 4.5,
      tags: ['軟體開發', '程式設計', '開發服務']
    },
    {
      id: '129',
      title: '網路服務中心',
      category: '網路服務',
      description: '提供網路服務和網路技術支援。',
      location: '台北市',
      contact: '02-2345-6791',
      cost: '收費',
      rating: 4.2,
      tags: ['網路服務', '網路技術', '技術支援']
    },
    
    // 媒體傳播類
    {
      id: '130',
      title: '媒體傳播中心',
      category: '媒體傳播',
      description: '提供媒體傳播和新聞媒體服務。',
      location: '台北市',
      contact: '02-2345-7890',
      cost: '收費',
      rating: 4.3,
      tags: ['媒體傳播', '新聞媒體', '傳播服務']
    },
    {
      id: '131',
      title: '廣播電視中心',
      category: '廣播電視',
      description: '提供廣播電視和影視製作服務。',
      location: '台北市',
      contact: '02-2345-7891',
      cost: '收費',
      rating: 4.4,
      tags: ['廣播電視', '影視製作', '媒體服務']
    },
    {
      id: '132',
      title: '廣告行銷中心',
      category: '廣告行銷',
      description: '提供廣告行銷和品牌推廣服務。',
      location: '台北市',
      contact: '02-2345-7892',
      cost: '收費',
      rating: 4.2,
      tags: ['廣告行銷', '品牌推廣', '行銷服務']
    },
    
    // 汽修相關（最接地氣）
    {
      id: '136',
      title: '台北市汽修服務中心',
      category: '汽修服務',
      description: '提供汽車維修、保養、洗車等全方位汽修服務。',
      location: '台北市',
      contact: '02-2345-8904',
      cost: '收費',
      rating: 4.5,
      tags: ['汽車維修', '汽車保養', '洗車服務']
    },
    {
      id: '137',
      title: '新北市汽修培訓中心',
      category: '汽修培訓',
      description: '提供汽修技術培訓、證照考試輔導等服務。',
      location: '新北市',
      contact: '02-2345-8905',
      cost: '收費',
      rating: 4.4,
      tags: ['汽修培訓', '技術培訓', '證照考試']
    },
    {
      id: '138',
      title: '桃園市洗車服務站',
      category: '洗車服務',
      description: '提供專業洗車、汽車美容、打蠟等服務。',
      location: '桃園市',
      contact: '03-2345-8906',
      cost: '收費',
      rating: 4.3,
      tags: ['洗車服務', '汽車美容', '打蠟服務']
    },
    {
      id: '139',
      title: '台中市汽修諮詢中心',
      category: '汽修諮詢',
      description: '提供汽修技術諮詢、故障診斷、維修建議等服務。',
      location: '台中市',
      contact: '04-2345-8907',
      cost: '免費',
      rating: 4.2,
      tags: ['汽修諮詢', '故障診斷', '維修建議']
    },
    
    // 水電相關
    {
      id: '140',
      title: '台北市水電服務中心',
      category: '水電服務',
      description: '提供水電維修、安裝、保養等專業服務。',
      location: '台北市',
      contact: '02-2345-8908',
      cost: '收費',
      rating: 4.4,
      tags: ['水電維修', '水電安裝', '水電保養']
    },
    {
      id: '141',
      title: '新北市冷氣安裝中心',
      category: '冷氣安裝',
      description: '提供冷氣安裝、維修、保養等專業服務。',
      location: '新北市',
      contact: '02-2345-8909',
      cost: '收費',
      rating: 4.3,
      tags: ['冷氣安裝', '冷氣維修', '冷氣保養']
    },
    
    // 餐飲服務（接地氣）
    {
      id: '142',
      title: '台北市廚師培訓中心',
      category: '廚師培訓',
      description: '提供專業廚師培訓、證照考試、實習機會等服務。',
      location: '台北市',
      contact: '02-2345-8910',
      cost: '收費',
      rating: 4.6,
      tags: ['廚師培訓', '證照考試', '實習機會']
    },
    {
      id: '143',
      title: '新北市服務員培訓中心',
      category: '服務員培訓',
      description: '提供餐飲服務員培訓、禮儀培訓、實務操作等服務。',
      location: '新北市',
      contact: '02-2345-8911',
      cost: '收費',
      rating: 4.3,
      tags: ['服務員培訓', '禮儀培訓', '實務操作']
    },
    {
      id: '144',
      title: '桃園市外送服務中心',
      category: '外送服務',
      description: '提供外送員培訓、配送服務、客戶服務等。',
      location: '桃園市',
      contact: '03-2345-8912',
      cost: '收費',
      rating: 4.2,
      tags: ['外送服務', '配送服務', '客戶服務']
    },
    
    // 美容美髮（接地氣）
    {
      id: '145',
      title: '台北市理髮服務中心',
      category: '理髮服務',
      description: '提供專業理髮、造型設計、美髮諮詢等服務。',
      location: '台北市',
      contact: '02-2345-8913',
      cost: '收費',
      rating: 4.4,
      tags: ['理髮服務', '造型設計', '美髮諮詢']
    },
    {
      id: '146',
      title: '新北市理髮培訓中心',
      category: '理髮培訓',
      description: '提供理髮技術培訓、造型設計培訓、實務操作等。',
      location: '新北市',
      contact: '02-2345-8914',
      cost: '收費',
      rating: 4.3,
      tags: ['理髮培訓', '造型設計', '實務操作']
    },
    
    // 物流運輸（接地氣）
    {
      id: '147',
      title: '台北市司機培訓中心',
      category: '司機培訓',
      description: '提供駕駛培訓、考照輔導、安全駕駛教育等服務。',
      location: '台北市',
      contact: '02-2345-8915',
      cost: '收費',
      rating: 4.5,
      tags: ['駕駛培訓', '考照輔導', '安全駕駛']
    },
    {
      id: '148',
      title: '新北市駕駛培訓中心',
      category: '駕駛培訓',
      description: '提供各類車輛駕駛培訓、考照服務、安全駕駛教育。',
      location: '新北市',
      contact: '02-2345-8916',
      cost: '收費',
      rating: 4.4,
      tags: ['駕駛培訓', '考照服務', '安全駕駛']
    },
    
    // 就業相關（接地氣）
    {
      id: '149',
      title: '台北市文員培訓中心',
      category: '文員培訓',
      description: '提供文書處理、辦公室軟體、行政實務等培訓服務。',
      location: '台北市',
      contact: '02-2345-8917',
      cost: '收費',
      rating: 4.3,
      tags: ['文書處理', '辦公室軟體', '行政實務']
    },
    {
      id: '150',
      title: '新北市會計培訓中心',
      category: '會計培訓',
      description: '提供會計實務、記帳軟體、稅務申報等培訓服務。',
      location: '新北市',
      contact: '02-2345-8918',
      cost: '收費',
      rating: 4.4,
      tags: ['會計實務', '記帳軟體', '稅務申報']
    },
    
    // 運輸物流類
    {
      id: '133',
      title: '運輸物流中心',
      category: '運輸物流',
      description: '提供運輸物流和供應鏈管理服務。',
      location: '台北市',
      contact: '02-2345-8901',
      cost: '收費',
      rating: 4.3,
      tags: ['運輸物流', '供應鏈管理', '物流服務']
    },
    {
      id: '134',
      title: '物流服務中心',
      category: '物流服務',
      description: '提供物流服務和倉儲管理服務。',
      location: '台北市',
      contact: '02-2345-8902',
      cost: '收費',
      rating: 4.2,
      tags: ['物流服務', '倉儲管理', '配送服務']
    },
    {
      id: '135',
      title: '倉儲服務中心',
      category: '倉儲服務',
      description: '提供倉儲服務和庫存管理服務。',
      location: '台北市',
      contact: '02-2345-8903',
      cost: '收費',
      rating: 4.1,
      tags: ['倉儲服務', '庫存管理', '倉儲管理']
    }
  ];

  // 根據關鍵字篩選
  let filteredResources = resourceTemplates;
  if (keyword) {
    filteredResources = filteredResources.filter(resource => 
      resource.title.toLowerCase().includes(keyword.toLowerCase()) ||
      resource.description.toLowerCase().includes(keyword.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
    );
  }

  // 根據分類篩選
  if (category && category !== '全部') {
    filteredResources = filteredResources.filter(resource => resource.category === category);
  }

  // 根據地點篩選
  if (location && location !== '全部') {
    filteredResources = filteredResources.filter(resource => resource.location === location);
  }

  // 添加隨機評分和聯絡資訊
  return filteredResources.slice(0, limit).map((resource, index) => ({
    ...resource,
    rating: resource.rating + (Math.random() - 0.5) * 0.4, // 添加一些隨機性
    contact: resource.contact || `02-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`
  }));
}

// 資源詳情API
router.get('/:resourceId', async (req, res) => {
  try {
    const { resourceId } = req.params;
    
    // 從智能生成資料中找到對應資源
    const allResources = generateSmartResources('', '', '', 100);
    const resourceDetail = allResources.find(resource => resource.id === resourceId);

    if (resourceDetail) {
      res.json({
        success: true,
        data: resourceDetail
      });
    } else {
      res.status(404).json({
        success: false,
        message: '資源不存在'
      });
    }

  } catch (error) {
    console.error('資源詳情錯誤:', error.message);
    res.status(500).json({
      success: false,
      message: '獲取資源詳情失敗',
      error: error.message
    });
  }
});

module.exports = router;
