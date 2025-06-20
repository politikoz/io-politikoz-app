"use client";

import { useRouter } from "next/navigation";
import Background from "./Building/Background";
import Building from "./Building/Building";
import Sidewalk from "./Building/Sidewalk";
import InfoSection from "./InfoSection/InfoSection";
import ElectionDashboard from "./ElectionDashboard/ElectionDashboard";
import PoweredBy from "./PoweredBy/PoweredBy";
import { useHomePageData } from "@/hooks/useHomePageData";
import JoinPolitikozTour from "./JoinPolitikozTour/JoinPolitikozTour";

export default function HomePageClient() {
  const router = useRouter();
  const { data, error } = useHomePageData();

  if (error) {
    router.push('/maintenance');
    return null;
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

      <InfoSection />
      <ElectionDashboard
        nextElection={data.nextElection}
        tierProgress={data.tierProgress}
      />
      
      <JoinPolitikozTour />
      <PoweredBy />
    </main>
  );
}