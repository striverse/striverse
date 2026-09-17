export interface TokenData {
  id: number;
  title: string;
  value: number;
  color: string;
  gradient: string;
}

export const tokenomicsData: TokenData[] = [
  {
    id: 1,
    title: "Presale",
    value: 40,
    color: "#06B6D4",
    gradient: "from-cyan-400 to-cyan-600",
  },
  {
    id: 2,
    title: "Liquidity",
    value: 20,
    color: "#8B5CF6",
    gradient: "from-violet-400 to-violet-600",
  },
  {
    id: 3,
    title: "Staking",
    value: 15,
    color: "#EC4899",
    gradient: "from-pink-400 to-pink-600",
  },
  {
    id: 4,
    title: "Team",
    value: 10,
    color: "#F59E0B",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: 5,
    title: "Marketing",
    value: 10,
    color: "#22C55E",
    gradient: "from-green-400 to-green-600",
  },
  {
    id: 6,
    title: "Reserve",
    value: 5,
    color: "#3B82F6",
    gradient: "from-blue-400 to-blue-600",
  },
];