import axios from 'axios';

export async function speak(text: string, voice: 'male' | 'female', apiKey: string): Promise<string> {
  // PlayHT API 參數與 voiceId 需根據官方文件設置
  const voiceId = voice === 'male' ? 's3://voice-cloning-zero-shot/zh-CN-YunxiNeural' : 's3://voice-cloning-zero-shot/zh-CN-XiaoxiaoNeural';
  const res = await axios.post('https://api.play.ht/api/v2/tts', {
    text,
    voice: voiceId,
    output_format: 'mp3',
    quality: 'medium',
    speed: 1.0,
    sample_rate: 24000,
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
  });
  // 假設回傳 { audioUrl: '...' }
  return res.data.audioUrl;
} 