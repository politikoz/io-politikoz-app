"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import MyParty from "@/components/Play/InsideBuilding/MyParty";
import TourManager from "../Tour/TourManager";
import CreateParty from "./CreateParty";
import PartyButtons from "@/components/Play/PartyView/PartyButtons";
import GovernanceSettings from "../GovernanceSettings/GovernanceSettings";
import { useTour } from "@/contexts/TourContext";
import { useTranslations } from "next-intl";
import PolitikozProfileContainer from "../PolitikozProfile/PolitikozProfileContainer";

export default function PartyView() {
  const [selectedSection, setSelectedSection] = useState<null | string>(null);
  const [localTourActive, setLocalTourActive] = useState(false);
  const { isTourActive, deactivateTour } = useTour();
  const router = useRouter();
  const t = useTranslations("PartyView");

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
    setSelectedSection(section);
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-[#816346] relative">
      <div className="flex-1 w-full overflow-y-auto">
        <div className="w-full mx-auto px-0 lg:px-[120px] max-w-full lg:max-w-[1800px] flex flex-col items-center">
          {(selectedSection === null || localTourActive) ? (
            <>
              <MyParty />
              <PartyButtons onNavigate={handleSectionSelect} />
            </>
          ) : (
            <div className="w-full flex flex-col items-center p-4">
              <button
                onClick={() => setSelectedSection(null)}
                className="mb-4 border-2 border-white px-4 py-2 bg-gray-800 text-white shadow-[4px_4px_0px_black] hover:bg-gray-700 transition font-['Press_Start_2P']"
              >
                {t("backToParty")}
              </button>

              {selectedSection === "my-party" && <CreateParty />}
              {selectedSection === "my-politikoz" && <PolitikozProfileContainer />}
              {selectedSection === "governance-settings" && <GovernanceSettings />}
            </div>
          )}
        </div>
      </div>

      {localTourActive && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-transparent pointer-events-auto"></div>
          <div className="absolute bottom-32 sm:bottom-40 left-4 sm:left-10 pointer-events-auto">
            <TourManager section="party" onClose={() => {
              setLocalTourActive(false);
              deactivateTour();
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
