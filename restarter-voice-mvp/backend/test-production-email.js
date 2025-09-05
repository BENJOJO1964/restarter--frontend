const https = require('https');

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

console.log('🧪 測試生產環境郵件發送...');

const req = https.request(options, (res) => {
  console.log('狀態碼:', res.statusCode);
  console.log('響應頭:', res.headers);

  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('響應內容:', responseData);
    console.log('請檢查 rbben521@gmail.com 的收件箱和垃圾郵件文件夾');
  });
});

req.on('error', (error) => {
  console.error('請求錯誤:', error);
});

req.write(data);
req.end();
