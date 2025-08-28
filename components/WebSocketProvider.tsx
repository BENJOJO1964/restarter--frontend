import React, { createContext, useContext, useEffect, useRef } from 'react';
import { getWsUrl } from '../src/config/api';

const WSContext = createContext<WebSocket|null>(null);

export function useWS() {
  return useContext(WSContext);
}

export default function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const wsRef = useRef<WebSocket|null>(null);
  useEffect(() => {
    try {
      console.log('嘗試連接 WebSocket...');
      wsRef.current = new WebSocket(getWsUrl());
      
      wsRef.current.onopen = () => {
        console.log('WebSocket 連接成功');
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket 連接錯誤:', error);
      };
      
      wsRef.current.onclose = () => {
        console.log('WebSocket 連接關閉');
      };
      
      return () => wsRef.current?.close();
    } catch (error) {
      console.error('WebSocket 初始化錯誤:', error);
    }
  }, []);
  return <WSContext.Provider value={wsRef.current}>{children}</WSContext.Provider>;
}
