"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import MyLaundry from "@/components/Play/InsideBuilding/MyLaundry";
import LaundryButtons from "@/components/Play/LaundryView/LaundryButtons";
import TourManager from "../Tour/TourManager";
import TicketPolicyView from "../TicketPolicy/TicketPolicyView";
import ClaimKozPage from "../ClaimKoz/ClaimKozPage";
import { useTour } from "@/contexts/TourContext";
import { useTranslations } from "next-intl";
import { StakeContainer } from "@/components/Play/Stake/StakeContainer";
import { useSearchParams } from "next/navigation";

export default function LaundryView() {
  const [selectedSection, setSelectedSection] = useState<null | string>(null);
  const [localTourActive, setLocalTourActive] = useState(false);
  const { isTourActive, deactivateTour } = useTour();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("LaundryView");

  // Handle section from URL parameter and clean up URL
  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setSelectedSection(section);
      // Clean up URL by using proper typed path
      router.replace({
        pathname: "/laundry",
      }, { 
        scroll: false 
      });
    }
  }, [searchParams, router]);

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
              <MyLaundry />
              <LaundryButtons 
                onNavigate={(section) => setSelectedSection(section)} 
              />
            </>
          ) : (
            <div className="w-full flex flex-col items-center p-4">
              <button
                onClick={() => setSelectedSection(null)}
                className="mb-4 border-2 border-white px-4 py-2 bg-gray-800 text-white shadow-[4px_4px_0px_black] hover:bg-gray-700 transition font-['Press_Start_2P']"
              >
                {t("backToLaundry")}
              </button>
              {selectedSection === "ticket-calculator" && <TicketPolicyView />}
              {selectedSection === "claim-koz" && <ClaimKozPage />}
              {selectedSection === "stake-plkoz" && <StakeContainer />}
            </div>
          )}
        </div>
      </div>

      {localTourActive && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-transparent pointer-events-auto"></div>
          <div className="absolute bottom-32 sm:bottom-40 left-4 sm:left-10 pointer-events-auto">
            <TourManager
              section="laundry"
              onClose={() => {
                setLocalTourActive(false);
                deactivateTour();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
