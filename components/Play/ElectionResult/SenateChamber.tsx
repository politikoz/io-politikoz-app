"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { winnersData } from "./winnersData";

const chairRows = [8, 6, 4, 2];

export default function SenateChamber() {
  const t = useTranslations("ElectionResult");
  let winnerIndex = 0;

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-900">
      <h2 className="text-lg font-bold text-center text-yellow-400 mb-6">
        {t("senateTitle")}
      </h2>

      <div className="flex flex-col items-center space-y-4">
        {chairRows.map((chairs, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-2">
            {Array.from({ length: chairs }).map((_, chairIndex) => {
              const winner = winnersData[winnerIndex];
              winnerIndex++;

              return (
                <div
                  key={chairIndex}
                  className="w-12 h-12 md:w-16 md:h-16 bg-gray-700 border-4 border-gray-600 rounded-md flex items-center justify-center"
                  style={{ imageRendering: "pixelated" }}
                >
                  {winner ? (
                    <img
                      src={`/images/assets/${winner.name.replace("#", "")}.png`}
                      alt={winner.name}
                      className="w-full h-full rounded-md"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
