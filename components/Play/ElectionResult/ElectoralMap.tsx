"use client";

import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { usePartyStats } from "@/hooks/usePartyStats";
import { generateUniqueColor, validateAndFixColors } from "@/utils/colorUtils";
import { useRoleTotals } from "@/hooks/useRoleTotals";

const cellSize = 8;
const OTHERS_COLOR = '#008000'; // Green color for "Others"

// Define colors for pie chart segments
const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#7CFC00', '#FF7F50', '#DA70D6', '#20B2AA', '#B22222', '#4682B4'];

// Cores para os diferentes cargos
const ROLE_COLORS: Record<string, string> = {
  // Políticos (conforme as cores definidas em tabs)
   "PRESIDENT": "#6EAA5E",
  "SENATOR": "#977BD0",
  "MINISTER": "#88CEFA",
  "GOVERNOR": "#FFFBCC",
  "FEDERAL_DEPUTY": "#FF8281",
  "FEDERAL DEPUTY": "#FF8281", // Alias com espaço
  "FEDERALDEPUTY": "#FF8281",  // Alias sem separador
  "STATE_DEPUTY": "#FFD991",
  "STATE DEPUTY": "#FFD991",   // Alias com espaço
  "STATEDEPUTY": "#FFD991",    // Alias sem separador
  
  // Tickets (conforme as cores definidas em tabs)
  FRONTMAN: "#6EAA5E",        // Verde
  CORRUPT: "#977BD0",         // Roxo
  LOBBYIST: "#88CEFA",        // Azul claro
  LAUNDERER: "#FFFBCC",       // Amarelo claro
  BRIBER: "#FF8281",          // Vermelho
};

// Função para formatar os nomes dos papéis
const formatRoleName = (role: string): string => {
  if (!role) return '';
  return role.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

// Renderização personalizada de labels
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return percent > 0.05 ? (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="middle" 
      style={{ fontSize: '10px', fontWeight: 'bold', textShadow: '1px 1px 2px black' }}
    >
      {formatRoleName(name)}
    </text>
  ) : null;
};

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

// Defina constante de cargos de ticket uma vez só, para reutilizar
const TICKET_ROLES = ['BRIBER', 'LAUNDERER', 'LOBBYIST', 'CORRUPT', 'FRONTMAN'];

const ElectoralMap: React.FC = () => {
  const [playerMap, setPlayerMap] = useState<string[][]>([]);
  const [colorMap, setColorMap] = useState<Map<string, string>>(new Map());
  const t = useTranslations("ElectionResult");
  const { data: statsData, isLoading: isStatsLoading } = usePartyStats();
  const { data: roleTotals = [], isLoading: isRoleTotalsLoading } = useRoleTotals();

  // Preparar dados para o gráfico usando diretamente os dados da API
  const chartData = roleTotals.map((item, index) => ({
    name: item.role,
    value: item.total,
    // Usar o índice para atribuir cores consistentemente
    color: COLORS[index % COLORS.length]
  }));

  // Ordenar os dados por valor para que os mais importantes apareçam primeiro
  // Função auxiliar para normalizar os nomes dos cargos para comparação
  const normalizeRoleName = (role: string): string => {
    return role.toUpperCase().replace(/[_\s-]/g, '');
  };

  const sortedChartData = Object.keys(ROLE_COLORS).map(roleKey => {
    // Encontrar o item correspondente nos dados da API usando normalização
    const normalizedRoleKey = normalizeRoleName(roleKey);
    const matchingItem = chartData.find(item => 
      normalizeRoleName(item.name) === normalizedRoleKey
    );
    
    // Log para depuração (pode remover depois)
    console.log(`Comparando: ${roleKey} (${normalizedRoleKey}) com resultados da API`, 
      matchingItem ? `Encontrado: ${matchingItem.name} com valor ${matchingItem.value}` : 'Não encontrado');
    
    // Se encontrou, usar seus valores; caso contrário, criar um item com valor zero
    return matchingItem || {
      name: roleKey,
      value: 0,
      color: ROLE_COLORS[roleKey]
    };
  });

  // Usar os dados ordenados para a legenda
  const legendData = sortedChartData;

  // Tooltip customizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-gray-800 p-2 border-2 border-gray-700 shadow-lg rounded-md">
          <p className="font-['Press_Start_2P'] text-xs text-white">{formatRoleName(data.name)}</p>
          <p className="font-['Press_Start_2P'] text-xs text-yellow-300">
            {data.value} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

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

  const isLoading = isStatsLoading || isRoleTotalsLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center h-[400px]">
      <div className="w-10 h-10 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="w-full max-w-screen mx-auto px-4 md:px-8 py-6" style={{ backgroundColor: "#816346" }}>
      {/* Container principal */}
      <div className="w-full flex flex-col justify-center relative"
        style={{
          backgroundColor: "#245f9b",
          padding: "10px",
          border: "3px solid #FFFFFF",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)"
        }}>
        <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black"></div>
        
        {/* Duas colunas lado a lado */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Coluna Esquerda: Mapa Eleitoral (50%) */}
          <div className="w-full md:w-1/2">
            <h3 className="text-md font-semibold text-white text-center mb-3">
              {t("map", { defaultValue: "Electoral Map" })}
            </h3>
            <svg
              viewBox={`0 0 ${irregularMap[0].length * cellSize} ${irregularMap.length * cellSize}`}
              className="w-full h-auto mx-auto border-2 border-white bg-gray-800 rounded-md p-1"
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
          
          {/* Coluna Direita: Earnings Estimate e Legend (50%) */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {/* Earnings Estimate Box */}
            <div
              className="flex flex-col items-center p-3 shadow-md relative"
              style={{
                border: "2px solid #FFFFFF",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.15)"
              }}
            >
              <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black"></div>
              <h3 className="text-lg font-semibold text-white text-center w-full">
                {t("earningsEstimate")}
              </h3>
              <p className="text-2xl font-bold text-yellow-300 text-center w-full mt-1">
                {statsData?.userEstimate || 0} ₳
              </p>
            </div>

            {/* Legend Box */}
            <div
              className="flex flex-col items-start flex-grow p-3 shadow-md relative overflow-auto"
              style={{
                border: "2px solid #FFFFFF",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                maxHeight: "calc(100% - 100px)"
              }}
            >
              <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black"></div>
              <h3 className="text-md font-semibold text-white text-center w-full mb-2">{t("legend")}</h3>
              <div className="flex flex-col w-full">
                {statsData?.players.map((player) => {
                  const isYou = player.name === 'You';
                  return (
                    <div key={player.name} className="flex items-center justify-between w-full mb-1 p-1 rounded hover:bg-gray-800">
                      <div className="relative flex items-center">
                        <div
                          className="w-4 h-4 mr-2"
                          style={{ 
                            backgroundColor: colorMap.get(player.name) || player.color
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
                        <span className={`text-sm ${isYou ? 'font-bold' : ''} text-white truncate max-w-[100px]`}>
                          {player.name}
                        </span>
                      </div>
                      <span className="text-sm text-yellow-300 ml-auto">
                        {player.percentage.toFixed(2)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Linha inferior que ocupa toda a largura: Distribuição de candidatos por papel */}
        <div className="mt-6 border-t-2 border-white pt-4">
          <h3 className="text-md font-semibold text-white text-center mb-3">
            {t("roleDistribution", { defaultValue: "Candidate Role Distribution" })}
          </h3>
          
          {/* Lista de papéis */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mx-auto max-w-5xl">
            {sortedChartData.map((role, index) => {
              const roleName = role.name.toUpperCase();
              const isTicketRole = TICKET_ROLES.includes(roleName);
              
              // Obter a cor correta do mapa ROLE_COLORS
              const roleColor = ROLE_COLORS[roleName] || "#CCCCCC";
              
              return (
                <div 
                  key={index}
                  className={`flex items-center text-xs ${isTicketRole ? 'bg-gray-700' : 'bg-gray-800'} 
                    px-2 py-1 rounded border ${isTicketRole ? 'border-yellow-700' : 'border-gray-700'} ${
                    role.value === 0 ? 'opacity-60' : ''
                  }`}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: roleColor }}
                  ></div>
                  <span className={`${isTicketRole ? 'text-yellow-200' : 'text-gray-200'} truncate`}>
                    {formatRoleName(role.name)}
                  </span>
                  <span className="ml-auto text-yellow-300">{role.value}</span>
                </div>
              );
            })}
          </div>
          
          {/* Totais */}
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between text-center text-white text-sm mx-auto max-w-3xl px-2">
            <div>
              {(() => {
                // Calcular o total de candidatos (excluindo tickets)
                const candidatesTotal = chartData
                  .filter(item => {
                    const normalizedRole = normalizeRoleName(item.name);
                    return !TICKET_ROLES.some(ticketRole => normalizeRoleName(ticketRole) === normalizedRole);
                  })
                  .reduce((sum, item) => sum + item.value, 0);
    
                return t("totalCandidates", { 
                  count: candidatesTotal,
                  defaultValue: "Total Candidates: {count}"
                });
              })()}
            </div>
            
            <div className="mt-2 sm:mt-0 text-yellow-300">
              {(() => {
                // Calcular o total de tickets
                const ticketTotal = chartData
                  .filter(item => {
                    const normalizedRole = normalizeRoleName(item.name);
                    return TICKET_ROLES.some(ticketRole => normalizeRoleName(ticketRole) === normalizedRole);
                  })
                  .reduce((sum, item) => sum + item.value, 0);

                return t("totalTickets", { 
                  count: ticketTotal,
                  defaultValue: "Total Tickets: {count}"
                });
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectoralMap;
