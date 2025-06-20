export interface HomePageData {
  nextElection: {
    date: string;
    totalPrize: number;
  };
  tierProgress: {
    percentageCompleted: number;
    prizePerTier: number;
    status: 'COMPLETED' | 'IN_PROGRESS';
    estimatedExecutionDate: string;
    tierId: number;
  } | null;
}

export const INITIAL_HOMEPAGE_DATA: HomePageData = {
  nextElection: {
    date: '2024-12-31T23:59:59Z',
    totalPrize: 0
  },
  tierProgress: null
};