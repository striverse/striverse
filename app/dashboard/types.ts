export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;

  walletAddress?: string;

  wallet: {
    totalPurchasedUSDT: number;
    totalPurchasedSTV: number;
    lockedSTV: number;
    unlockedSTV: number;
    purchaseCount: number;
  };
}