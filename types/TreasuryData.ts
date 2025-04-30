export interface TreasuryData {
  treasuryPot: {
    adaAmount: number;
    usdAmount: number;
  };
  treasuryHistory: {
    epoch: number;
    ada: number;
  }[];
}

export const INITIAL_TREASURY_DATA: TreasuryData = {
  treasuryPot: {
    adaAmount: 0,
    usdAmount: 0
  },
  treasuryHistory: Array.from({ length: 30 }, (_, i) => ({
    epoch: i,
    ada: 0
  }))
};