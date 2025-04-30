import React from "react";
import JoinTopBanner from "./JoinTopBanner";
import EngageAndEarnCard from "./Cards/EngageAndEarnCard";
import StakeAndWinCard from "./Cards/StakeAndWinCard";
import BuyAPolitikozCard from "./Cards/BuyAPolitikozCard";
import BuyKozCard from "./Cards/BuyKozCard";

const JoinPolitikozPaths: React.FC = () => {
  return (
    <div className="bg-[#1c1c1c] p-5">
      {/* Banner */}
      <JoinTopBanner />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EngageAndEarnCard />
        <StakeAndWinCard />
        <BuyAPolitikozCard />
        <BuyKozCard />
      </div>
    </div>
  );
};

export default JoinPolitikozPaths;
