"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import Hall from "@/components/Play/InsideBuilding/Hall";
import HallButtons from "@/components/Play/HallView/HallButtons";
import TourManager from "../Tour/TourManager";
import TokenomicsPage from "../Tokenomics/TokenomicsPage";
import TreasuryPage from "../Treasury/TreasuryPage";
import TeamPage from "../Team/TeamPage";
import { useTour } from "@/contexts/TourContext";
import { useTranslations } from "next-intl";

export default function HallView() {
  const [selectedSection, setSelectedSection] = useState<null | string>(null);
  const [localTourActive, setLocalTourActive] = useState(false);
  const router = useRouter();
  const { isTourActive, activateTour, deactivateTour } = useTour();
  const t = useTranslations("HallView");

  useEffect(() => {
    if (isTourActive) {
      setLocalTourActive(true);
    }
  }, [isTourActive]);

  const handleSectionSelect = (section: string) => {
    if (section === "exit") {
      router.replace("/play");
      return;
    }
    if (section === "tour-politikoz") {
      activateTour();
      router.push("/hall");
      return;
    }
    setSelectedSection(section);
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-[#816346] relative">
      <div className="flex-1 w-full overflow-y-auto">
        <div className="w-full mx-auto px-0 lg:px-[120px] max-w-full lg:max-w-[1800px] flex flex-col items-center">
          {(selectedSection === null || localTourActive) ? (
            <>
              <Hall />
              <HallButtons onNavigate={handleSectionSelect} />
            </>
          ) : (
            <div className="w-full flex flex-col items-center p-4">
              <button
                onClick={() => setSelectedSection(null)}
                className="mb-4 border-2 border-white px-4 py-2 bg-gray-800 text-white shadow-[4px_4px_0px_black] hover:bg-gray-700 transition font-['Press_Start_2P']"
              >
                {t("backToHall")}
              </button>

              {selectedSection === "tokenomics-koz" && <TokenomicsPage />}
              {selectedSection === "treasury-pot" && <TreasuryPage />}
              {selectedSection === "team" && <TeamPage />}
            </div>
          )}
        </div>
      </div>

      {localTourActive && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-transparent pointer-events-auto"></div>
          <div className="absolute bottom-32 sm:bottom-40 left-4 sm:left-10 pointer-events-auto">
            <TourManager
              section="welcome"
              onClose={() => {
                setLocalTourActive(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
