"use client";

import { useExploreData } from "@/hooks/useExploreData";
import ExploreIntro from "@/components/Explore/ExploreIntro";
import GrowingCommunity from "@/components/Explore/GrowingCommunity";
import Trades from "@/components/Explore/Trades";
import BuyPolitikoz from "@/components/Explore/BuyPolitikoz";
import ActiveListing from "@/components/Explore/ActiveListing";

export default function ExploreClient() {
  const { data, error } = useExploreData();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const trades = data.trades.map((trade) => ({
    buyerAddress: trade.buyerAddress,
    sellerAddress: trade.sellerAddress,
    market: trade.market,
    name: trade.name.replace("Politikoz", "").trim(), // Remove "Politikoz" do nome
    price: trade.price,
  }));

  const listings = data.listings.map((listing) => ({
    market: listing.market,
    name: listing.name.replace("Politikoz", "").trim(),
    price: listing.price,
  }));

  return (
    <main className="relative w-full">
      <ExploreIntro floorPrice={data.stats.price} />
      <GrowingCommunity
        holderDistribution={[
          { name: "1 Politikoz", value: data.holdersDistribution.single },
          { name: "2-4 Politikoz", value: data.holdersDistribution.twoToFour },
          { name: "5-9 Politikoz", value: data.holdersDistribution.fiveToNine },
          { name: "10-24 Politikoz", value: data.holdersDistribution.tenToTwentyFour },
          { name: "25+ Politikoz", value: data.holdersDistribution.twentyFivePlus },
        ]}
        totalHolders={data.stats.owners}
      />
      <Trades trades={trades} />
      <BuyPolitikoz />
      <ActiveListing listings={listings} />
    </main>
  );
}