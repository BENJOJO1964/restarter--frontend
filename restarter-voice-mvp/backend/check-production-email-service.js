const https = require('https');

// 测试生产环境的邮件服务配置
const testEmailService = () => {
  const data = JSON.stringify({
    email: 'rbben521@gmail.com',
    registrationData: {
      nickname: 'test',
      password: 'test123'
    }
  });

  const options = {
    hostname: 'restarter-backend-6e9s.onrender.com',
    port: 443,
    path: '/api/email-verification/send-code',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log('🔍 檢查生產環境郵件服務配置...');

  const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('生產環境響應:', responseData);
      
      // 如果返回成功但收不到邮件，说明可能是Resend API key无效
      if (responseData.includes('"success":true')) {
        console.log('⚠️  API返回成功但收不到邮件，可能原因：');
        console.log('1. 生產環境仍在使用Resend，但API key無效');
        console.log('2. 生產環境的Gmail SMTP配置有問題');
        console.log('3. 郵件被Gmail過濾');
      }
    });
  });

  req.on('error', (error) => {
    console.error('請求錯誤:', error);
  });

  req.write(data);
  req.end();
};

testEmailService();
