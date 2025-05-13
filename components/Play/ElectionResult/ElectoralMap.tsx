"use client";

import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { usePartyStats } from "@/hooks/usePartyStats";
import { generateUniqueColor, validateAndFixColors } from "@/utils/colorUtils";

const cellSize = 8;
const OTHERS_COLOR = '#008000'; // Green color for "Others"

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

const ElectoralMap: React.FC = () => {
  const [playerMap, setPlayerMap] = useState<string[][]>([]);
  const [colorMap, setColorMap] = useState<Map<string, string>>(new Map());
  const t = useTranslations("ElectionResult");
  const { data: statsData, isLoading } = usePartyStats();

  interface Player {
    name: string;
    percentage: number;
    color: string;
  }

  // Update distributeRegions to skip zero percentage players
  const distributeRegions = (players: Player[]) => {
    // Filter out zero percentage players for map distribution
    const activePlayers = players.filter(player => player.percentage > 0);
    
    let totalCells = irregularMap.flat().filter((cell) => cell === 1).length;
    let playerMap: string[][] = irregularMap.map((row) => row.map(() => ""));
    let playerCells: { [key: string]: number } = {};

    activePlayers.forEach((player) => {
      playerCells[player.name] = Math.round((player.percentage / 100) * totalCells);
    });

    let playerIndex = 0;

    for (let row = 0; row < irregularMap.length; row++) {
      for (let col = 0; col < irregularMap[row].length; col++) {
        if (irregularMap[row][col] === 1) {
          const currentPlayer = activePlayers[playerIndex];
          
          if (!currentPlayer) continue;

          if (playerCells[currentPlayer.name] === 0) {
            playerIndex++;
            if (playerIndex >= activePlayers.length) playerIndex = activePlayers.length - 1;
          }

          playerMap[row][col] = activePlayers[playerIndex].name;
          playerCells[activePlayers[playerIndex].name]--;
        }
      }
    }

    return playerMap;
  };

  useEffect(() => {
    if (statsData?.players) {
      const usedColors: string[] = [];
      const newColorMap = new Map<string, string>();

      statsData.players.forEach(player => {
        if (player.percentage === 0) {
          // Skip zero percentage players for the map coloring
          newColorMap.set(player.name, '#CCCCCC'); // Gray color for zero percentage
          return;
        }

        if (player.name === 'Others') {
          newColorMap.set(player.name, OTHERS_COLOR);
          usedColors.push(OTHERS_COLOR);
        } else if (player.name === 'You') {
          const validColor = validateAndFixColors([player.color], usedColors)[0];
          newColorMap.set(player.name, validColor);
          usedColors.push(validColor);
        } else if (player.name.toLowerCase().startsWith('stake')) {
          const uniqueColor = generateUniqueColor(usedColors);
          usedColors.push(uniqueColor);
          newColorMap.set(player.name, uniqueColor);
        } else {
          const validColor = validateAndFixColors([player.color], usedColors)[0];
          newColorMap.set(player.name, validColor);
          usedColors.push(validColor);
        }
      });

      setColorMap(newColorMap);
    }
  }, [statsData?.players]);

  useEffect(() => {
    if (statsData?.players) {
      setPlayerMap(distributeRegions(statsData.players));
    }
  }, [statsData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-screen mx-auto px-4 md:px-8 py-6" style={{ backgroundColor: "#816346" }}>
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
          <p className="text-2xl font-bold text-black text-center w-full mt-2">
            {statsData?.userEstimate || 0} ₳
          </p>
        </div>

        <div className="w-full flex justify-center relative"
          style={{
            backgroundColor: "#245f9b",
            padding: "10px",
            border: "3px solid #FFFFFF",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)"
          }}>
          <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black"></div>
          <svg
            viewBox={`0 0 ${irregularMap[0].length * cellSize} ${irregularMap.length * cellSize}`}
            className="w-full max-w-[800px] h-auto"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {irregularMap.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                if (cell === 0) return null;

                const baseX = colIndex * cellSize;
                const baseY = rowIndex * cellSize;
                const playerName = playerMap[rowIndex]?.[colIndex] || "";
                const playerColor = colorMap.get(playerName) || "#CCCCCC";
                const isYou = playerName === "You";

                return (
                  <g key={`${rowIndex}-${colIndex}`}>
                    <rect
                      x={baseX}
                      y={baseY}
                      width={cellSize}
                      height={cellSize}
                      fill={playerColor}
                      stroke="black"
                      strokeWidth="1"
                    />
                    {isYou && (
                      <>
                        <line 
                          x1={baseX + 1}
                          y1={baseY + 1}
                          x2={baseX + cellSize - 1}
                          y2={baseY + cellSize - 1}
                          stroke="#FFD700"
                          strokeWidth="1"
                        />
                        <line
                          x1={baseX + cellSize - 1}
                          y1={baseY + 1}
                          x2={baseX + 1}
                          y2={baseY + cellSize - 1}
                          stroke="#FFD700"
                          strokeWidth="1"
                        />
                      </>
                    )}
                  </g>
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
            {statsData?.players.map((player) => {
              const isYou = player.name === 'You';
              return (
                <div key={player.name} className="flex items-center justify-between w-full">
                  <div className="relative">
                    <div
                      className="w-4 h-4"
                      style={{ 
                        backgroundColor: colorMap.get(player.name) || player.color, 
                        marginRight: "6px" 
                      }}
                    />
                    {isYou && (
                      <svg
                        className="absolute top-0 left-0"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        style={{ pointerEvents: 'none' }}
                      >
                        <line 
                          x1="2" 
                          y1="2" 
                          x2="14" 
                          y2="14" 
                          stroke="#FFD700" 
                          strokeWidth="1"
                        />
                        <line 
                          x1="14" 
                          y1="2" 
                          x2="2" 
                          y2="14" 
                          stroke="#FFD700" 
                          strokeWidth="1"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center w-full">
                    <span className={`text-sm ${isYou ? 'font-bold' : ''} text-black`}>
                      {player.name}
                    </span>
                    <span
                      className="flex-grow text-sm text-black text-right"
                      style={{ display: "flex", justifyContent: "right", gap: "5px" }}
                    >
                      {"....."} {player.percentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectoralMap;
