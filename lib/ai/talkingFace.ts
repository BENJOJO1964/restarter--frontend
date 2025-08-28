import axios from 'axios';

export async function generateTalkingFace({
  imageUrl,
  audioUrl,
  text,
  apiKey,
}: {
  imageUrl: string;
  audioUrl: string;
  text: string;
  apiKey: string;
}): Promise<string> {
  // D-ID API 參數需根據官方文件設置
  const res = await axios.post('https://api.d-id.com/talks', {
    source_url: imageUrl,
    script: { type: 'audio', audio_url: audioUrl, input: text },
    driver_url: '', // 可選，嘴型動畫驅動
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  // 假設回傳 { result_url: '...' }
  return res.data.result_url;
} 