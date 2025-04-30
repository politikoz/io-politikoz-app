"use client";

import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";

const cellSize = 8;

const irregularMap = 

[
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],    
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0],        
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0],   
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0],   
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0],  
    [0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],  
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],      
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],      
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],   
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],   
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],   
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],   
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],   
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],   
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],   
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],   

]; 
const players = [
  { name: "PSDT", percentage: 30, color: "#FF5733" },
  { name: "You", percentage: 20, color: "#33FFF5" },
  { name: "PTDB", percentage: 10, color: "#5733FF" },
  { name: "PMDB", percentage: 10, color: "#FFD700" },
  { name: "SOMOS", percentage: 10, color: "#FF33A8" },
  { name: "Others", percentage: 20, color: "#B0FF33" }
];

const distributeRegions = () => {
  let totalCells = irregularMap.flat().filter((cell) => cell === 1).length;
  let playerMap: string[][] = irregularMap.map((row) => row.map(() => ""));
  let playerCells: { [key: string]: number } = {};

  players.forEach((player) => {
    playerCells[player.name] = Math.round((player.percentage / 100) * totalCells);
  });

  let playerIndex = 0;

  for (let row = 0; row < irregularMap.length; row++) {
    for (let col = 0; col < irregularMap[row].length; col++) {
      if (irregularMap[row][col] === 1) {
        const currentPlayer = players[playerIndex];

        if (playerCells[currentPlayer.name] === 0) {
          playerIndex++;
          if (playerIndex >= players.length) playerIndex = players.length - 1;
        }

        playerMap[row][col] = players[playerIndex].name;
        playerCells[players[playerIndex].name]--;
      }
    }
  }

  return playerMap;
};

const ElectoralMap: React.FC = () => {
  const [playerMap, setPlayerMap] = useState<string[][]>([]);
  const t = useTranslations("ElectionResult");

  useEffect(() => {
    setPlayerMap(distributeRegions());
  }, []);

  return (
    <div
      className="w-full max-w-screen mx-auto px-4 md:px-8 py-6"
      style={{ backgroundColor: "#816346" }}
    >
      <div className="flex flex-col md:flex-row items-center md:justify-center space-y-4 md:space-y-0 md:space-x-6 w-full">
        <div
          className="w-full md:w-[250px] flex flex-col items-center md:items-start p-4 shadow-md relative self-center"
          style={{
            border: "3px solid #FFFFFF",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)"
          }}
        >
          <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black"></div>
          <h3 className="text-lg font-semibold text-black text-center w-full">
            {t("earningsEstimate")}
          </h3>
          <p className="text-2xl font-bold text-black text-center w-full mt-2">80 ₳</p>
        </div>

        <div
          className="w-full flex justify-center relative"
          style={{
            backgroundColor: "#245f9b",
            padding: "10px",
            border: "3px solid #FFFFFF",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)"
          }}
        >
          <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black"></div>
          <svg
            viewBox={`0 0 ${irregularMap[0].length * cellSize} ${irregularMap.length * cellSize}`}
            className="w-full max-w-[800px] h-auto"
          >
            {irregularMap.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                if (cell === 0) return null;

                const baseX = colIndex * cellSize;
                const baseY = rowIndex * cellSize;
                const playerName = playerMap[rowIndex]?.[colIndex] || "";
                const playerColor = players.find((p) => p.name === playerName)?.color || "#CCCCCC";

                return (
                  <rect
                    key={`${rowIndex}-${colIndex}`}
                    x={baseX}
                    y={baseY}
                    width={cellSize}
                    height={cellSize}
                    fill={playerColor}
                    stroke="black"
                    strokeWidth="1"
                  />
                );
              })
            )}
          </svg>
        </div>

        <div
          className="w-full md:w-[300px] flex flex-col md:items-start p-4 shadow-md relative self-center"
          style={{
            border: "3px solid #FFFFFF",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)"
          }}
        >
          <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black"></div>
          <h3 className="text-md font-semibold text-black text-center md:text-left mb-2">{t("legend")}</h3>
          <div className="flex flex-col">
            {players.map((player) => (
              <div key={player.name} className="flex items-center justify-between w-full">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: player.color, marginRight: "6px" }}
                ></div>
                <div className="flex items-center w-full">
                  <span className="text-sm text-black">{player.name}</span>
                  <span
                    className="flex-grow text-sm text-black text-right"
                    style={{ display: "flex", justifyContent: "right", gap: "5px" }}
                  >
                    {"...................."} {player.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectoralMap;
