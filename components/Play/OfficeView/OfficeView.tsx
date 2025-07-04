"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import MyOffice from "@/components/Play/InsideBuilding/MyOffice";
import OfficeButtons from "@/components/Play/OfficeView/OfficeButtons";
import ElectionInfo from "@/components/Play/ElectionInfo/ElectionInfo";
import ElectionPrize from "@/components/Play/ElectionInfo/ElectionPrize";
import ElectionResultsView from "../ElectionResult/ElectionResultsView";
import TourManager from "../Tour/TourManager";
import { SwapContainer } from "../SwapAdaToKoz/SwapContainer";
import { useTour } from "@/contexts/TourContext";
import { useTranslations } from "next-intl";
import TicketProfileContainer from "../TicketProfile/TicketProfileContainer";
import { BuyTicketContainer } from "../BuyTicket/BuyTicketContainer";
import { MintContainer } from "./MintContainer";
import AuditView from "../Audit/AuditView";

export default function OfficeView() {
  const [selectedSection, setSelectedSection] = useState<null | string>(null);
  const [localTourActive, setLocalTourActive] = useState(false);
  const [tourSection, setTourSection] = useState<
    "officeConnected" | "officeNotConnected"
  >("officeNotConnected");
  const { isTourActive, deactivateTour } = useTour();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("OfficeView");

  // Handle section from URL parameter and clean up URL
  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setSelectedSection(section);
      // Clean up URL by using proper typed path
      router.replace(
        {
          pathname: "/office",
        },
        {
          scroll: false,
        }
      );
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (isTourActive) setLocalTourActive(true);
  }, [isTourActive]);

  useEffect(() => {
    // Só roda no client
    if (typeof window !== "undefined") {
      const connected = localStorage.getItem("connected");
      setTourSection(
        connected === "true" ? "officeConnected" : "officeNotConnected"
      );
    }
  }, []);

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
          {selectedSection === null || localTourActive ? (
            <>
              <MyOffice />
              <OfficeButtons onNavigate={handleSectionSelect} />
            </>
          ) : (
            <div className="w-full flex flex-col items-center p-4">
              <button
                onClick={() => setSelectedSection(null)}
                className="mb-4 border-2 border-white px-4 py-2 bg-gray-800 text-white shadow-[4px_4px_0px_black] hover:bg-gray-700 transition font-['Press_Start_2P']"
              >
                {t("backToOffice")}
              </button>
              {selectedSection === "my-tickets" && (
                <TicketProfileContainer
                  onAuthError={() => setSelectedSection(null)}
                />
              )}
              {selectedSection === "mint-tkoz" && <MintContainer />}
              {selectedSection === "prize-info" && <ElectionPrize />}
              {selectedSection === "wave-info" && <ElectionInfo />}
              {selectedSection === "election-results" && <ElectionResultsView />}
              {selectedSection === "buy-koz" && <SwapContainer />}
              {selectedSection === "buy-tickets" && <BuyTicketContainer />}
              {selectedSection === "audit" && <AuditView />}
            </div>
          )}
        </div>
      </div>

      {localTourActive && (selectedSection === null || selectedSection === "office") && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-transparent pointer-events-auto"></div>
          <div className="absolute bottom-32 sm:bottom-40 left-4 sm:left-10 pointer-events-auto">
            <TourManager
              section={tourSection}
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
