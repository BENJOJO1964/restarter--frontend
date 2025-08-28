// 📜 Restarter™ Empire Rank System
export type Rank = {
  id: number;
  name_zh: string;
  name_en: string;
  icon: string;
  upgrade_cost: number; // number of lower-tier items to upgrade
};

export const RANKS: Rank[] = [
  { id: 1, name_zh: "書吏", name_en: "Scribe", icon: "📜", upgrade_cost: 10 },
  { id: 2, name_zh: "縣丞", name_en: "County Clerk", icon: "🪪", upgrade_cost: 10 },
  { id: 3, name_zh: "通判", name_en: "Overseer", icon: "🧾", upgrade_cost: 10 },
  { id: 4, name_zh: "巡撫", name_en: "Inspector", icon: "🛡️", upgrade_cost: 10 },
  { id: 5, name_zh: "尚書", name_en: "Minister", icon: "🏛️", upgrade_cost: 10 },
  { id: 6, name_zh: "太保", name_en: "Imperial Counselor", icon: "📯", upgrade_cost: 10 },
  { id: 7, name_zh: "宰相", name_en: "Chancellor", icon: "🏯", upgrade_cost: 10 },
  { id: 8, name_zh: "皇帝", name_en: "Emperor", icon: "🏰🫅", upgrade_cost: 0 },
];

export function getRankById(id: number): Rank | undefined {
  return RANKS.find((rank) => rank.id === id);
}

export function getNextRank(currentId: number): Rank | undefined {
  return RANKS.find((rank) => rank.id === currentId + 1);
}

export function isUpgrade(badges: number, currentRankId: number): boolean {
  const rank = getRankById(currentRankId);
  return !!rank && rank.upgrade_cost > 0 && badges >= rank.upgrade_cost;
} 