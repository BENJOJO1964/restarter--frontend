import { useState } from 'react';
// TODO: 實作音訊/文字流管理
export function useStream() {
  const [data, setData] = useState<any>(null);
  return { data, setData };
}
