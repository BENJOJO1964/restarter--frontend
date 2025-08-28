import axios from 'axios';
import { getAuth } from 'firebase/auth';

export async function* generateResponse(userText: string, lang: string, systemPrompt: string, isTestMode: boolean): AsyncGenerator<string> {
  try {
    // 獲取當前用戶ID
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error('用戶未登入');
    }

    // 獲取Firebase認證令牌
    let headers: any = {
      'x-test-mode': isTestMode ? 'true' : 'false'
    };
    
    try {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Failed to get user token:', error);
    }

    // 使用傳入的isTestMode參數，而不是從localStorage讀取
    const response = await axios.post('/api/gpt', {
      messages: [
        { sender: 'user', text: userText }
      ],
      system_prompt: systemPrompt,
      userId: user.uid
    }, {
      headers
    });
    
    const reply = response.data.reply;
    console.log('API Response:', response.data); // 調試信息
    
    if (reply && reply.trim()) {
      // 模擬流式輸出
      const words = reply.split('');
      for (const word of words) {
        yield word;
        await new Promise(resolve => setTimeout(resolve, 50)); // 50ms 延遲
      }
    } else {
      // 如果沒有回覆，拋出錯誤而不是yield錯誤訊息
      console.error('Empty reply from API');
      throw new Error('AI回覆為空，請稍後再試。');
    }
  } catch (error) {
    console.error('Error calling GPT API:', error);
    if (error instanceof Error) {
      throw new Error(`API錯誤：${error.message}`);
    } else {
      throw new Error('抱歉，我現在無法回應，請稍後再試。');
    }
  }
} 