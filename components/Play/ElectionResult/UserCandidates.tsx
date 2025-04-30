"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface Candidate {
  place: number;
  name: string;
  votes: number;
  isUser: boolean;
  isWinningPosition: boolean;
  positionsToWin: number;
}

interface ElectionData {
  role: string;
  candidates: Candidate[][];
}

interface UserCandidatesProps {
  data: ElectionData[];
}

const BASE_IMAGE_SIZE = 80;
const IMAGE_SIZE = BASE_IMAGE_SIZE * 1.5;

export default function UserCandidates({ data }: UserCandidatesProps) {
  const t = useTranslations("ElectionResult");
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
      const maxIndex = data.find((item) => item.role === role)?.candidates.length || 1;

      let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

      if (newIndex >= maxIndex) newIndex = 0;
      if (newIndex < 0) newIndex = maxIndex - 1;

      return { ...prevIndices, [role]: newIndex };
    });
  };

  if (!data || data.length === 0) {
    return <p className="text-white text-center">{t("noData")}</p>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-900 p-4 border-2 border-white shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
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

      <div className="flex flex-col space-y-8">
        {data.map((election) => {
          const currentCandidateIndex = candidatesIndices[election.role] || 0;
          const currentCandidate = election.candidates[currentCandidateIndex];

          return (
            <div key={election.role} className="w-full flex flex-col items-center space-y-2">
              <h3 className="text-white font-semibold text-sm md:text-lg text-center w-full">
                {election.role} - {t("candidateLabel", {
                  index: currentCandidateIndex + 1,
                  total: election.candidates.length
                })}
              </h3>

              <div
                className="relative flex flex-col items-center w-full p-4"
                style={{
                  minHeight: "220px",
                  background: election.role === "President"
                    ? "#6EAA5E"
                    : election.role === "State Deputy"
                    ? "#FFD991"
                    : "#FF8281"
                }}
              >
                <div className="flex justify-center items-end space-x-4 w-full">
                  {currentCandidate.map((candidate) => {
                    const imagePath = `/images/assets/${candidate.name.replace("#", "")}.png`;

                    let borderColor = "";
                    if (candidate.isUser) {
                      borderColor = candidate.isWinningPosition
                        ? "border-green-500 ring-green-600"
                        : "border-red-500 ring-red-600";
                    }

                    return (
                      <div key={candidate.place} className="flex flex-col items-center w-24 md:w-32 relative">
                        <div className="flex items-center space-x-1">
                          <div
                            className="text-lg md:text-xl font-bold text-black"
                            style={{ fontFamily: "'Press Start 2P', cursive" }}
                          >
                            {candidate.place}TH
                          </div>

                          {candidate.isUser && candidate.positionsToWin > 0 && (
                            <div className="text-green-500 font-bold text-sm">
                              ▲ {candidate.positionsToWin}
                            </div>
                          )}
                        </div>

                        <div className="relative flex items-end" style={{ height: `${IMAGE_SIZE + 20}px` }}>
                          <img
                            src={imagePath}
                            alt={candidate.name}
                            className={`rounded-md transition-all duration-300 ${
                              borderColor ? `border-4 ring-4 shadow-xl ${borderColor}` : ""
                            }`}
                            style={{
                              width: `${IMAGE_SIZE}px`,
                              height: `${IMAGE_SIZE}px`,
                              objectFit: "contain",
                              maxWidth: "100%",
                              maxHeight: "100%"
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="w-full flex justify-center space-x-4 bg-gray-100 text-black text-center border border-gray-300 p-2 mt-0">
                  {currentCandidate.map((candidate) => (
                    <div key={candidate.place} className="flex flex-col items-center w-24 md:w-32">
                      <div className="text-sm md:text-base font-bold">{candidate.name}</div>
                      <div className="text-xs md:text-sm text-gray-600">{t("candidateVotes")}</div>
                      <div className="text-sm md:text-base font-bold">{candidate.votes}</div>
                    </div>
                  ))}
                </div>

                {election.candidates.length > 1 && (
                  <div className="flex justify-center mt-2 space-x-4">
                    <button
                      className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => changeCandidate(election.role, "back")}
                    >
                      {t("btnBack")}
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => changeCandidate(election.role, "next")}
                    >
                      {t("btnNext")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
