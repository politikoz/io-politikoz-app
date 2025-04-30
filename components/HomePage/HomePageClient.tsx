"use client";

import Background from "./Building/Background";
import Building from "./Building/Building";
import Sidewalk from "./Building/Sidewalk";
import InfoSection from "./InfoSection/InfoSection";
import ElectionDashboard from "./ElectionDashboard/ElectionDashboard";
import JoinPolitikozPaths from "./JoinPolitikozPaths/JoinPolitikozPaths";
import PoweredBy from "./PoweredBy/PoweredBy";
import { useHomePageData } from "@/hooks/useHomePageData";

export default function HomePageClient() {

  // Dados da API da homepage
  const { data, error } = useHomePageData();

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

  return (
    <main className="relative w-full">
      <div className="relative w-full flex flex-col items-center">
        <div className="relative w-full h-[40vh] max-h-[800px] sm:h-[70vh]">
          <Background />
          <Building />
        </div>
        <div className="relative w-full h-[32px]">
          <Sidewalk />
        </div>
      </div>

      <InfoSection treasury={data.treasury} />
      <ElectionDashboard
        nextElection={data.nextElection}
        lastElection={data.lastElection}
      />
      <JoinPolitikozPaths />
      <PoweredBy />
    </main>
  );
}