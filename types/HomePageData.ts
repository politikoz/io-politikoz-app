export interface HomePageData {
  treasury: {
    balance: number;
  };
  nextElection: {
    date: string;
    totalPrize: number;
    tierId: number;
  };
  lastElection: {
    leaderboard: Array<{
      place: string;
      user: string;
      prize: number;
    }>;
    month: string;
  };
}

export const INITIAL_HOMEPAGE_DATA: HomePageData = {
  treasury: {
    balance: 0
  },
  nextElection: {
    date: '2024-12-31T23:59:59Z',
    totalPrize: 0,
    tierId: 0
  },
  lastElection: {
    leaderboard: Array(3).fill({
      place: '-',
      user: '--------',
      prize: 0
    }),
    month: ''
  }
};