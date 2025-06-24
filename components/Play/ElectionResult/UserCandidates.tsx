"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useUserCandidates } from "@/hooks/useUserCandidates";
import { ElectionGroup } from "@/types/UserCandidatesData";

const BASE_IMAGE_SIZE = 80;
const MOBILE_IMAGE_SIZE = 60;

const roleColors = [
  { name: 'president', color: '#6EAA5E' },
  { name: 'governor', color: '#FFFBCC' },
  { name: 'senator', color: '#977BD0' },
  { name: 'federal_deputy', color: '#FF8281' },
  { name: 'state_deputy', color: '#FFD991' },
  { name: 'mayor', color: '#DEB0F7' },
  { name: 'minister', color: '#88CEFA' },
  { name: 'councilor', color: '#C0C0C0' },
  { name: 'frontman', color: '#C0C0C0' },
  { name: 'corrupt', color: '#6EAA5E' },
  { name: 'lobbyist', color: '#977BD0' },
  { name: 'briber', color: '#88CEFA' },
  { name: 'launderer', color: '#FFFBCC' }
] as const;

export default function UserCandidates() {
  const t = useTranslations("ElectionResult");
  const { data: response, isLoading, error } = useUserCandidates();
  const [isMobile, setIsMobile] = useState(false);
  const [candidatesIndices, setCandidatesIndices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const changeCandidate = (role: string, direction: "next" | "back") => {
    setCandidatesIndices((prevIndices) => {
      const currentIndex = prevIndices[role] || 0;
      const roleGroup = response?.data?.find((item: ElectionGroup) => item.role === role);
      const maxIndex = roleGroup?.candidates?.length || 1;

      let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= maxIndex) newIndex = 0;
      if (newIndex < 0) newIndex = maxIndex - 1;

      return { ...prevIndices, [role]: newIndex };
    });
  };

  const getBackgroundColor = (role: string) => {
    const normalizedRole = role.toLowerCase();
    const roleColor = roleColors.find(t => t.name === normalizedRole);
    return roleColor?.color || "#FF8281"; // fallback color
  };

  const imageSize = isMobile ? MOBILE_IMAGE_SIZE : BASE_IMAGE_SIZE;
  const adjustedImageSize = imageSize * 1.5;

  if (isLoading) return <div className="text-white text-center">Loading...</div>;
  if (error) {
    return <div className="text-red-500 text-center">{t("errorLoading")}</div>;
  }
  

  if (!response?.data || response.data.length === 0) {
    return <p className="text-white text-center">{t("noData")}</p>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-900 p-2 md:p-4 border-2 border-white shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-2 md:mb-4">
        <h2 className="text-xl md:text-2xl text-yellow-300 font-bold text-center">
          {t("title")}
        </h2>

        <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mt-2 md:mt-0">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 border border-white"></div>
            <span className="text-white text-sm">{t("legendWinning")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 border border-white"></div>
            <span className="text-white text-sm">{t("legendLosing")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500 text-xl">▲</span>
            <span className="text-white text-sm">{t("legendPositionsToVictory")}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:space-y-8">
        {response.data
          .slice()
          .sort((a, b) => {
            const aIndex = roleColors.findIndex(r => r.name.toUpperCase() === a.role);
            const bIndex = roleColors.findIndex(r => r.name.toUpperCase() === b.role);
            
            // If role not found in roleColors, put it at the end
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            
            return aIndex - bIndex;
          })
          .map((election: ElectionGroup) => {
          const currentCandidateIndex = candidatesIndices[election.role] || 0;
          const currentGroup = election.candidates[currentCandidateIndex];

          if (!currentGroup) return null;

          return (
            <div key={election.role} className="w-full flex flex-col items-center space-y-2">
              <h3 className="text-white font-semibold text-xs md:text-lg text-center w-full">
                {election.role} - {t("candidateLabel", {
                  index: currentCandidateIndex + 1,
                  total: election.candidates.length
                })}
              </h3>

              <div 
                className="relative flex flex-col items-center w-full p-2 md:p-4"
                style={{
                  minHeight: isMobile ? "180px" : "220px",
                  background: getBackgroundColor(election.role)
                }}
              >
                <div className={`flex justify-center items-end ${isMobile ? 'space-x-2' : 'space-x-4'} w-full overflow-x-auto`}>
                  {currentGroup.map((candidate) => (
                    <div key={candidate.place} 
                      className={`flex flex-col items-center ${
                        isMobile ? 'w-20 min-w-[5rem]' : 'w-24 md:w-32'
                      } relative`}
                    >
                      <div className="flex items-center space-x-1">
                        <div className={`${
                          isMobile ? 'text-sm' : 'text-lg md:text-xl'
                        } font-bold text-black`}
                        style={{ fontFamily: "'Press Start 2P', cursive" }}>
                          {candidate.place}TH
                        </div>
                        {candidate.user && candidate.positionsToWin > 0 && (
                          <div className={`
                            ${isMobile ? 'text-xs px-1.5' : 'text-sm px-2'} 
                            font-bold 
                            bg-gradient-to-r from-purple-900 to-purple-800
                            rounded-sm
                            py-1 
                            flex 
                            items-center 
                            space-x-1
                            shadow-lg
                            border-2 border-purple-400
                            animate-pulse
                          `}>
                            <span className="text-purple-200">▲</span>
                            <span className="text-purple-200">{candidate.positionsToWin}</span>
                          </div>
                        )}
                      </div>

                      <div className="relative flex items-end" 
                        style={{ height: `${adjustedImageSize + (isMobile ? 10 : 20)}px` }}
                      >
                        <img
                          src={`/images/assets/${candidate.image}.png`}
                          alt={candidate.name}
                          className={`rounded-md transition-all duration-300 ${
                            candidate.user ? (candidate.winningPosition
                              ? "border-2 md:border-4 ring-2 md:ring-4 border-green-500 ring-green-600 shadow-xl"
                              : "border-2 md:border-4 ring-2 md:ring-4 border-red-500 ring-red-600 shadow-xl")
                            : ""
                          }`}
                          style={{
                            width: `${adjustedImageSize}px`,
                            height: `${adjustedImageSize}px`,
                            objectFit: "contain",
                            maxWidth: "100%",
                            maxHeight: "100%"
                          }}
                        />
                      </div>
                      
                      <div className={`
                        ${isMobile ? 'text-xs' : 'text-sm md:text-base'} 
                        font-bold 
                        text-white 
                        mt-1 
                        md:mt-2
                        bg-gradient-to-b from-slate-900 to-slate-800
                        px-2
                        py-0.5
                        rounded-sm
                        border border-slate-600
                      `}>
                        {candidate.name}
                      </div>
                      <div className={`
                        ${isMobile ? 'text-[10px] px-1.5 py-0.5' : 'text-xs md:text-sm px-2 py-1'} 
                        bg-gradient-to-r from-indigo-900 to-indigo-800
                        rounded-sm
                        text-indigo-200
                        font-bold
                        shadow-md
                      `}>
                        {t("candidateVotes")}: {candidate.votes}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`flex justify-center ${isMobile ? 'mt-2' : 'mt-4'} space-x-2 md:space-x-4`}>
                  <button
                    className={`bg-gray-700 text-white font-bold 
                      ${isMobile ? 'py-1 px-2 text-sm' : 'py-2 px-4'} rounded
                      ${currentCandidateIndex === 0 || election.candidates.length <= 1
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-600'}`}
                    onClick={() => changeCandidate(election.role, "back")}
                    disabled={currentCandidateIndex === 0 || election.candidates.length <= 1}
                  >
                    {t("btnBack")}
                  </button>
                  <button
                    className={`bg-blue-500 text-white font-bold 
                      ${isMobile ? 'py-1 px-2 text-sm' : 'py-2 px-4'} rounded
                      ${currentCandidateIndex === election.candidates.length - 1 || election.candidates.length <= 1
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-blue-700'}`}
                    onClick={() => changeCandidate(election.role, "next")}
                    disabled={currentCandidateIndex === election.candidates.length - 1 || election.candidates.length <= 1}
                  >
                    {t("btnNext")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
