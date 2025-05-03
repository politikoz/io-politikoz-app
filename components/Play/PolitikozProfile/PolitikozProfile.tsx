"use client";

import { useState, useMemo, useEffect } from "react";
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
import { useTranslations } from "next-intl";
import { usePolitikozData } from "@/hooks/usePolitikozData";

export default function PolitikozProfileView() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGridView, setIsGridView] = useState(false);
  const t = useTranslations("PolitikozProfile");
  const { data: politikozList = [], error } = usePolitikozData();

  const selectedTab = tabs[selectedIndex];
  const filteredPolitikoz = useMemo(
    () => politikozList.filter((p) => p.type === selectedTab.name),
    [selectedTab, politikozList]
  );

  const totalImprisoned = useMemo(
    () => politikozList.filter(p => p.imprisoned).length,
    [politikozList]
  );

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedIndex]);

  const handleSelectPolitikoz = (name: string) => {
    const selectedPolitikoz = politikozList.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (selectedPolitikoz) {
      const tabIndex = tabs.findIndex((tab) => tab.name === selectedPolitikoz.type);
      if (tabIndex !== -1) {
        setSelectedIndex(tabIndex);
        const filteredList = politikozList.filter((p) => p.type === selectedPolitikoz.type);
        const indexInFiltered = filteredList.findIndex((p) => p.name === selectedPolitikoz.name);
        setCurrentIndex(indexInFiltered);
        setIsGridView(false);
      }
    }
  };

  const handleSelectFromGrid = (index: number) => {
    setCurrentIndex(index);
    setIsGridView(false);
  };

  return (
    <div className="relative flex flex-col w-full max-w-6xl mx-auto border-4 border-black bg-gray-900 text-white p-2 shadow-[6px_6px_0px_black]">
      <div className="flex items-center justify-between w-full p-3 bg-gray-800 border-2 border-white shadow-md rounded-md">
        <PolitikozSearch politikozList={politikozList} onSelectPolitikoz={handleSelectPolitikoz} />
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
                  // Implement release logic here
                  console.log('Release prisoner', releaseAll);
                }}
                handleLuckyChange={(newLucky) => {
                  // Implement lucky number change logic here
                  console.log('Change lucky number to', newLucky);
                }}
                totalImprisoned={totalImprisoned}
              />
              <ProfileCard {...filteredPolitikoz[currentIndex]} />
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
            <p className="text-center text-gray-400">{t("noPolitikozAvailable")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
