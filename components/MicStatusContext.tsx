import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MicStatusContextType {
  isMicOn: boolean;
  setMicOn: (isOn: boolean) => void;
}

const MicStatusContext = createContext<MicStatusContextType | undefined>(undefined);

export const MicStatusProvider = ({ children }: { children: ReactNode }) => {
  const [isMicOn, setMicOn] = useState(false);
  return (
    <MicStatusContext.Provider value={{ isMicOn, setMicOn }}>
      {children}
    </MicStatusContext.Provider>
  );
};

export const useMicStatus = () => {
  const context = useContext(MicStatusContext);
  if (context === undefined) {
    throw new Error('useMicStatus must be used within a MicStatusProvider');
  }
  return context;
}; 