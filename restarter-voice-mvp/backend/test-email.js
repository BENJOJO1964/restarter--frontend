const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🧪 測試郵件發送...');

// 只使用 Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const testEmail = 'rbben521@gmail.com';
const verificationCode = '123456';

const mailOptions = {
  from: 'Restarter驗證系統 <noreply.restarter@gmail.com>',
  to: testEmail,
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
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Gmail SMTP 發送失敗:', error.message);
  } else {
    console.log('✅ 郵件發送成功:', info.messageId);
  }
});
