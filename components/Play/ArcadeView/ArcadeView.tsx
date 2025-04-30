"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import ArcadeRoom from "@/components/Play/InsideBuilding/ArcadeRoom";
import ArcadeButtons from "@/components/Play/ArcadeView/ArcadeButtons";
import TourManager from "../Tour/TourManager";
import TicketPolicyView from "../TicketPolicy/TicketPolicyView";
import ClaimKozPage from "../ClaimKoz/ClaimKozPage";
import { useTour } from "@/contexts/TourContext";

export default function ArcadeView() {
  const [selectedSection, setSelectedSection] = useState<null | string>(null);
  const [localTourActive, setLocalTourActive] = useState(false);
  const { isTourActive, deactivateTour } = useTour();
  const router = useRouter();

  useEffect(() => {
    if (isTourActive) setLocalTourActive(true);
  }, [isTourActive]);

  useEffect(() => {
    if (selectedSection === "exit") {
      router.push("/play");
    }
  }, [selectedSection, router]);

  if (selectedSection === "exit") return null;

  return (
    <div className="flex flex-col flex-1 w-full bg-[#816346] relative">
      <div className="flex-1 w-full overflow-y-auto">
        <div className="w-full mx-auto px-0 lg:px-[120px] max-w-full lg:max-w-[1800px] flex flex-col items-center">
          {(selectedSection === null || localTourActive) ? (
            <>
              <ArcadeRoom />
              <ArcadeButtons onNavigate={setSelectedSection} />
            </>
          ) : (
            <div className="w-full flex flex-col items-center p-4">
              <button
                onClick={() => setSelectedSection(null)}
                className="mb-4 border-2 border-white px-4 py-2 bg-gray-800 text-white shadow-[4px_4px_0px_black] hover:bg-gray-700 transition font-['Press_Start_2P']"
              >
                ← Back to Laundry
              </button>
              {selectedSection === "ticket-calculator" && <TicketPolicyView />}
              {selectedSection === "claim-koz" && <ClaimKozPage />}
            </div>
          )}
        </div>
      </div>

      {localTourActive && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-transparent pointer-events-auto"></div>
          <div className="absolute bottom-32 sm:bottom-40 left-4 sm:left-10 pointer-events-auto">
            <TourManager section="arcade" onClose={() => {
              setLocalTourActive(false);
              deactivateTour();
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
