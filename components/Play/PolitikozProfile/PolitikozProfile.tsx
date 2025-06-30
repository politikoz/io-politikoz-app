"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ArrowPathRoundedSquareIcon,
  BackwardIcon,
  ForwardIcon,
  Squares2X2Icon,
  IdentificationIcon,
} from "@heroicons/react/24/solid";
import TabNavigation from "./TabNavigation";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import { tabs } from "./tabs";
import PolitikozSearch from "./PolitikozSearch";
import PolitikozGrid from "./PolitikozGrid";
import MarketListings from "./MarketListings";
import { useTranslations } from "next-intl";
import { usePolitikozData } from "@/hooks/usePolitikozData";
import { useTour } from "@/contexts/TourContext";
import TourManager from "@/components/Play/Tour/TourManager";

export default function PolitikozProfileView() {
  // 1. All useState hooks
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGridView, setIsGridView] = useState(false);
  const { isTourActive } = useTour();
  const [localTourActive, setLocalTourActive] = useState(false);
  const [tourSection, setTourSection] = useState<"myPolitikozConnected" | "myPolitikozNotConnected">("myPolitikozNotConnected");

  // 2. Translations and data fetching
  const t = useTranslations("PolitikozProfile");
  const { data: politikozList, isLoading } = usePolitikozData();

  // 3. All useMemo hooks - move these before the conditional return
  const selectedTab = tabs[selectedIndex];
  const filteredPolitikoz = useMemo(
    () => politikozList?.filter((p) => p.type === selectedTab.name) || [],
    [selectedTab, politikozList]
  );

  const totalImprisoned = useMemo(
    () => politikozList?.filter((p) => p.imprisoned).length || 0,
    [politikozList]
  );

  // Add a useMemo to get the IDs of the filtered Politikoz
  const filteredPolitikozIds = useMemo(
    () => filteredPolitikoz.map((p) => p.name || ""),
    [filteredPolitikoz]
  );

  // 4. useEffect hooks
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedIndex]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const connected = localStorage.getItem("connected");
      setTourSection(connected === "true" ? "myPolitikozConnected" : "myPolitikozNotConnected");
    }
  }, []);

  useEffect(() => {
    if (isTourActive) setLocalTourActive(true);
  }, [isTourActive]);

  // 5. Handler functions
  const handleSelectPolitikoz = useCallback(
    (name: string) => {
      const selectedPolitikoz = politikozList?.find(
        (p) => p.name.toLowerCase() === name.toLowerCase()
      );
      if (selectedPolitikoz) {
        const tabIndex = tabs.findIndex((tab) => tab.name === selectedPolitikoz.type);
        if (tabIndex !== -1 && politikozList) {
          setSelectedIndex(tabIndex);
          const filteredList = politikozList.filter((p) => p.type === selectedPolitikoz.type);
          const indexInFiltered = filteredList.findIndex((p) => p.name === selectedPolitikoz.name);
          setCurrentIndex(indexInFiltered);
          setIsGridView(false);
        }
      }
    },
    [politikozList]
  );

  const handleSelectFromGrid = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsGridView(false);
  }, []);

  // 6. Loading state check - after all hooks
  if (isLoading || !politikozList) {
    return (
      <div className="relative flex flex-col w-full max-w-6xl mx-auto border-4 border-black bg-gray-900 text-white p-2 shadow-[6px_6px_0px_black]">
        <div className="flex items-center justify-center h-[600px]">
          <div className="w-8 h-8 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // 7. Component render
  return (
    <div className="relative flex flex-col w-full max-w-6xl mx-auto border-4 border-black bg-gray-900 text-white p-2 shadow-[6px_6px_0px_black]">
      {/* Search and Grid View controls */}
      <div className="flex items-center justify-between w-full p-3 bg-gray-800 border-2 border-white shadow-md rounded-md">
        <PolitikozSearch politikozList={politikozList || []} onSelectPolitikoz={handleSelectPolitikoz} />
        <button
          onClick={() => setIsGridView(!isGridView)}
          className="p-2 bg-gray-700 border-2 border-white rounded-md shadow-md hover:bg-gray-600 transition"
        >
          {isGridView ? (
            <IdentificationIcon className="w-6 h-6 text-yellow-300" />
          ) : (
            <Squares2X2Icon className="w-6 h-6 text-gray-400 hover:text-yellow-300" />
          )}
        </button>
      </div>

      <div className="relative flex flex-col md:flex-row h-auto w-full">
        <TabNavigation selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
        <div className="flex-1 border-4 border-black bg-gray-800 p-2 shadow-[4px_4px_0px_black] flex flex-col relative">
          {isGridView ? (
            <PolitikozGrid
              politikozList={filteredPolitikoz}
              selectedTab={selectedTab.name}
              onSelectPolitikoz={handleSelectFromGrid}
            />
          ) : filteredPolitikoz.length > 0 ? (
            <>
              <ProfileHeader
                {...filteredPolitikoz[currentIndex]}
                onRelease={(releaseAll) => {
              
                }}
                totalImprisoned={totalImprisoned}
                politikozIds={filteredPolitikozIds}
                filteredPolitikoz={filteredPolitikoz}
              />
              <ProfileCard {...filteredPolitikoz[currentIndex]} />
              {/* Navigation buttons */}
              <div className="mt-auto flex justify-center w-full border-t-4 border-white pt-2 space-x-6">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentIndex === 0}
                  className={`border-2 border-white px-4 py-2 bg-black text-yellow-300 shadow-[4px_4px_0px_black] w-[40%] max-w-[160px] flex items-center justify-center 
                    ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <BackwardIcon className="w-5 h-5 mr-2" />
                  {t("previous")}
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % filteredPolitikoz.length)}
                  className="border-2 border-white px-4 py-2 bg-black text-yellow-300 shadow-[4px_4px_0px_black] w-[40%] max-w-[160px] flex items-center justify-center"
                >
                  {currentIndex === filteredPolitikoz.length - 1 ? (
                    <>
                      <ArrowPathRoundedSquareIcon className="w-5 h-5 mr-2" />
                      {t("restartList")}
                    </>
                  ) : (
                    <>
                      <ForwardIcon className="w-5 h-5 mr-2" />
                      {t("next")}
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center p-4">
              <p className="text-center text-gray-400 mb-8">{t("noPolitikozAvailable")}</p>
              <MarketListings cargo={selectedTab.name} />
            </div>
          )}
        </div>
      </div>

      {localTourActive && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-transparent pointer-events-auto"></div>
          <div className="absolute bottom-32 sm:bottom-40 left-4 sm:left-10 pointer-events-auto">
            <TourManager
              section={tourSection}
              onClose={() => setLocalTourActive(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
