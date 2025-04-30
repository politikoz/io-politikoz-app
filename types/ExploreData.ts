export interface ExploreData {
  holdersDistribution: {
    single: number;
    twoToFour: number;
    fiveToNine: number;
    tenToTwentyFour: number;
    twentyFivePlus: number;
  };
  trades: Array<{
    buyerAddress: string;
    collectionName: string;
    hash: string;
    image: string;
    market: string;
    name: string;
    policy: string;
    price: number;
    sellerAddress: string;
    time: number;
  }>;
  listings: Array<{
    image: string;
    market: string;
    name: string;
    price: number;
    time: number;
  }>;
  stats: {
    listings: number;
    owners: number;
    price: number;
    sales: number;
    supply: number;
    topOffer: number;
    volume: number;
  };
}

export const INITIAL_EXPLORE_DATA: ExploreData = {
  holdersDistribution: {
    single: 0,
    twoToFour: 0,
    fiveToNine: 0,
    tenToTwentyFour: 0,
    twentyFivePlus: 0,
  },
  trades: [],
  listings: [],
  stats: {
    listings: 0,
    owners: 0,
    price: 0,
    sales: 0,
    supply: 0,
    topOffer: 0,
    volume: 0,
  },
};