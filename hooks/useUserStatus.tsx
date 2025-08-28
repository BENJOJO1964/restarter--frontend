import React, { useState, useContext, createContext, ReactNode } from 'react';
import { getRankById, getNextRank, isUpgrade } from '../utils/rank';

interface UserStatusContextType {
  badges: number;
  rankId: number;
  rank: ReturnType<typeof getRankById>;
  nextRank: ReturnType<typeof getNextRank>;
  promotion: boolean;
  addBadge: () => boolean;
  setBadges: React.Dispatch<React.SetStateAction<number>>;
  setRankId: React.Dispatch<React.SetStateAction<number>>;
}

const UserStatusContext = createContext<UserStatusContextType | undefined>(undefined);

export function UserStatusProvider({ children }: { children: ReactNode }) {
  const [badges, setBadges] = useState<number>(parseInt(localStorage.getItem('badges')||'0', 10));
  const [rankId, setRankId] = useState<number>(parseInt(localStorage.getItem('rankId')||'1', 10));
  const [promotion, setPromotion] = useState(false);

  function addBadge() {
    let newBadges = badges + 1;
    let newRankId = rankId;
    let promoted = false;
    if (isUpgrade(newBadges, rankId)) {
      newRankId = rankId + 1;
      newBadges = 0;
      promoted = true;
      setPromotion(true);
      setTimeout(()=>setPromotion(false), 3000);
    }
    setBadges(newBadges);
    setRankId(newRankId);
    localStorage.setItem('badges', String(newBadges));
    localStorage.setItem('rankId', String(newRankId));
    return promoted;
  }

  const rank = getRankById(rankId);
  const nextRank = getNextRank(rankId);

  return (
    <UserStatusContext.Provider value={{ badges, rankId, rank, nextRank, promotion, addBadge, setBadges, setRankId }}>
      {children}
    </UserStatusContext.Provider>
  );
}

export function useUserStatus() {
  const ctx = useContext(UserStatusContext);
  if (!ctx) throw new Error('useUserStatus must be used within a UserStatusProvider');
  return ctx;
} 