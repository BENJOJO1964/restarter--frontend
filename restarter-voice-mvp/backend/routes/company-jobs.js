const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// 企業職位發布API
router.post('/publish', async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyPhone,
      jobTitle,
      jobDescription,
      requirements,
      location,
      jobType,
      salary,
      contactPerson,
      contactEmail
    } = req.body;

    // 驗證必填欄位
    if (!companyName || !jobTitle || !jobDescription || !location) {
      return res.status(400).json({
        success: false,
        message: '請填寫所有必填欄位'
      });
    }

    // 創建職位資料
    const jobData = {
      id: `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      company: companyName,
      title: jobTitle,
      description: jobDescription,
      requirements: requirements || [],
      location: location,
      type: jobType || '全職',
      salary: salary || '薪資面議',
      contactPerson: contactPerson,
      contactEmail: contactEmail,
      companyEmail: companyEmail,
      companyPhone: companyPhone,
      postedDate: new Date().toISOString(),
      status: 'active',
      source: '企業直接發布',
      skills: extractSkills(jobDescription),
      applyUrl: '#',
      logo: '',
      views: 0,
      applications: 0
    };

    // 儲存到Firestore
    const db = admin.firestore();
    await db.collection('company_jobs').doc(jobData.id).set(jobData);

    res.json({
      success: true,
      message: '職位發布成功！',
      data: {
        jobId: jobData.id,
        postedDate: jobData.postedDate
      }
    });

  } catch (error) {
    console.error('職位發布錯誤:', error.message);
    res.status(500).json({
      success: false,
      message: '職位發布失敗',
      error: error.message
    });
  }
});

// 企業職位管理API
router.get('/company/:companyEmail', async (req, res) => {
  try {
    const { companyEmail } = req.params;
    
    const db = admin.firestore();
    const snapshot = await db.collection('company_jobs')
      .where('companyEmail', '==', companyEmail)
      .orderBy('postedDate', 'desc')
      .get();

    const jobs = [];
    snapshot.forEach(doc => {
      jobs.push(doc.data());
    });

    res.json({
      success: true,
      data: {
        jobs: jobs,
        total: jobs.length
      }
    });

  } catch (error) {
    console.error('企業職位查詢錯誤:', error.message);
    res.status(500).json({
      success: false,
      message: '查詢失敗',
      error: error.message
    });
  }
});

// 更新職位狀態
router.put('/:jobId/status', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'filled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '無效的狀態值'
      });
    }

    const db = admin.firestore();
    await db.collection('company_jobs').doc(jobId).update({
      status: status,
      updatedDate: new Date().toISOString()
    });

    res.json({
      success: true,
      message: '職位狀態更新成功'
    });

  } catch (error) {
    console.error('職位狀態更新錯誤:', error.message);
    res.status(500).json({
      success: false,
      message: '更新失敗',
      error: error.message
    });
  }
});

// 刪除職位
router.delete('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    const db = admin.firestore();
    await db.collection('company_jobs').doc(jobId).delete();

    res.json({
      success: true,
      message: '職位刪除成功'
    });

  } catch (error) {
    console.error('職位刪除錯誤:', error.message);
    res.status(500).json({
      success: false,
      message: '刪除失敗',
      error: error.message
    });
  }
});

// 輔助函數：提取技能關鍵字
function extractSkills(description) {
  if (!description) return [];
  
  const skillKeywords = [
    'React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Git',
    'Node.js', 'Python', 'SQL', 'MongoDB', 'AWS',
    'Figma', 'Adobe創意套件', 'UI/UX設計', '原型設計',
    '數據分析', '機器學習', 'Tableau',
    '專案管理', '領導力', '溝通技巧', '敏捷開發',
    '數位行銷', 'SEO優化', '社群媒體行銷',
    '會計', '簿記', '稅務申報',
    '招募', '員工關係', '人資政策',
    '護理', '病人照護', '臨床技能',
    '教學', '課程開發', '學生評估',
    '行政支援', '辦公室管理', 'Microsoft Office',
    '機械工程', 'CAD設計', '產品開發'
  ];

  const foundSkills = [];
  skillKeywords.forEach(skill => {
    if (description.toLowerCase().includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return foundSkills.slice(0, 5);
}

module.exports = router;
