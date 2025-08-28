import { useState } from 'react';
// TODO: 實作麥克風錄音控制
export function useMic() {
  const [active, setActive] = useState(false);
  const start = () => setActive(true);
  const stop = () => setActive(false);
  return { active, start, stop };
}
