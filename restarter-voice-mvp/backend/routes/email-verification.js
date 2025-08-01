const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

// 儲存待驗證的註冊
const pendingRegistrations = new Map();

// 創建 Resend 實例
const resend = new Resend(process.env.RESEND_API_KEY || 're_dLgquqs9_PhX32DutRnPrtSgJP35kNCiy');

// 生成驗證碼
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 發送驗證碼
router.post('/send-code', async (req, res) => {
  try {
    const { email, nickname, password, registrationData } = req.body;

    // 支援兩種數據格式：直接傳遞或包含在 registrationData 中
    const finalNickname = nickname || (registrationData && registrationData.nickname);
    const finalPassword = password || (registrationData && registrationData.password);

    if (!email || !finalNickname || !finalPassword) {
      return res.status(400).json({ 
        success: false, 
        message: '請提供完整的註冊資訊' 
      });
    }

    // 生成驗證碼
    const verificationCode = generateVerificationCode();
    
    // 儲存待驗證的註冊資訊（10分鐘過期）
    pendingRegistrations.set(email, {
      nickname: finalNickname,
      password: finalPassword,
      verificationCode,
      timestamp: Date.now()
    });

    // 發送驗證碼郵件
    try {
      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Restarter - 電子郵件驗證',
        html: `
          <div style="font-size:16px;line-height:1.7;max-width:600px;margin:0 auto;">
            <h2 style="color:#6B5BFF;margin-bottom:20px;">🔐 電子郵件驗證</h2>
            <div style="background:#f7f8fa;padding:20px;border-radius:8px;margin-bottom:20px;">
              <p style="margin:0 0 15px 0;">您的驗證碼是：</p>
              <div style="background:#6B5BFF;color:white;padding:15px;border-radius:8px;text-align:center;font-size:24px;font-weight:bold;margin:15px 0;">
                ${verificationCode}
              </div>
              <p style="margin:15px 0 0 0;color:#666;font-size:14px;">
                此驗證碼將在 10 分鐘後過期。如果這不是您的操作，請忽略此郵件。
              </p>
            </div>
            <div style="text-align:center;color:#666;font-size:14px;">
              此郵件由 Restarter 驗證系統自動發送
            </div>
          </div>
        `
      });

      console.log('✅ 驗證碼郵件發送成功 (Resend)');
      console.log('郵件ID:', result.data?.id);

      res.json({ 
        success: true, 
        message: '驗證碼已發送到您的電子郵件' 
      });

    } catch (emailError) {
      console.error('❌ 驗證碼郵件發送失敗:', emailError.message);
      res.status(500).json({ 
        success: false, 
        message: '郵件發送失敗，請稍後再試' 
      });
    }

  } catch (error) {
    console.error('註冊驗證錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: '伺服器錯誤，請稍後再試' 
    });
  }
});

// 驗證碼驗證
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ 
        success: false, 
        message: '請提供電子郵件和驗證碼' 
      });
    }

    const registration = pendingRegistrations.get(email);

    if (!registration) {
      return res.status(400).json({ 
        success: false, 
        message: '未找到待驗證的註冊，請重新發送驗證碼' 
      });
    }

    // 檢查驗證碼是否過期（10分鐘）
    const now = Date.now();
    const timeDiff = now - registration.timestamp;
    const tenMinutes = 10 * 60 * 1000;

    if (timeDiff > tenMinutes) {
      pendingRegistrations.delete(email);
      return res.status(400).json({ 
        success: false, 
        message: '驗證碼已過期，請重新發送' 
      });
    }

    // 驗證碼檢查
    if (registration.verificationCode !== code) {
      return res.status(400).json({ 
        success: false, 
        message: '驗證碼錯誤，請重新輸入' 
      });
    }

    // 驗證成功，清除待驗證資料
    pendingRegistrations.delete(email);

    res.json({ 
      success: true, 
      message: '電子郵件驗證成功！',
      userData: {
        email: email,
        nickname: registration.nickname
      }
    });

  } catch (error) {
    console.error('驗證碼驗證錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: '伺服器錯誤，請稍後再試' 
    });
  }
});

module.exports = router; 