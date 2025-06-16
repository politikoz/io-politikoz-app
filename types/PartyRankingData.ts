export interface PartyRankingDTO {
  tierId: number;
  partyAcronym: string;
  totalWinners: number;
  percentage: number;
}

export interface TierRankingDTO {
  tierId: number;
  rankings: PartyRankingDTO[];
  kozBalance?: number; 
}

export interface PartyRankingResponse {
  rankings: TierRankingDTO[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}