"use client";

import { useTranslations } from "next-intl";
import { PartyInfoDTO } from "@/types/CreatePartyData";
import { ReferralRanking } from "@/types/PartyInfoData";
import PartyFlag from "./PartyFlag";
import React, { useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { TrophyIcon } from "@heroicons/react/24/solid";
import { usePartyRankings } from "@/hooks/usePartyRankings";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface PartyInfoProps {
  party: PartyInfoDTO;
  referralRanking: ReferralRanking[];
}

const ReferralRewardCard = ({ 
  amount, 
  label, 
  recipient 
}: { 
  amount: string | number; // Updated type to accept number
  label: string;
  recipient: string;
}) => (
  <div className="flex flex-col items-center justify-center bg-gray-700 p-2 rounded-md">
    <span className="text-yellow-300 text-xs mb-1 font-['Press_Start_2P']">{recipient}</span>    
    <span className="text-yellow-300 text-sm font-['Press_Start_2P']">
      {typeof amount === 'string' ? amount : formatTokenAmount(amount)}
    </span>
    <span className="text-white text-xs font-['Press_Start_2P']">{label}</span>
  </div>
);

// Helper function to format party type for display
const formatPartyType = (type: string): string => {
  if (!type) return '';
  
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

// Função auxiliar para formatar o valor KOZ - sem decimais
const formatTokenAmount = (amount: number): string => {
  // Arredonda para cima para garantir valores inteiros
  const roundedAmount = Math.ceil(amount);
  
  if (roundedAmount >= 1000000) {
    return Math.ceil(roundedAmount / 10000) / 100 + 'M';
  } else if (roundedAmount >= 1000) {
    return Math.ceil(roundedAmount / 10) / 100 + 'K';
  } else {
    return roundedAmount.toString();
  }
};

export default function PartyInfo({ party, referralRanking }: PartyInfoProps) {
  const t = useTranslations("PartyView.info");
  const [copied, setCopied] = useState(false);
  // Estado para controlar qual season está sendo visualizada
  const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0);
  
  // Usar o hook para obter os rankings
  const { rankings, isLoading } = usePartyRankings();
  
  // Ordenar as temporadas por tierId em ordem decrescente (mais recente primeiro)
  const sortedRankings = [...rankings].sort((a, b) => b.tierId - a.tierId);
  
  // Obter a temporada atual com base no índice
  const currentSeason = sortedRankings[currentSeasonIndex];
  
  // Verificar se há temporadas para navegar
  const hasMultipleSeasons = sortedRankings.length > 1;
  
  // Navegar para a temporada anterior
  const goToPreviousSeason = () => {
    if (currentSeasonIndex < sortedRankings.length - 1) {
      setCurrentSeasonIndex(currentSeasonIndex + 1);
    }
  };
  
  // Navegar para a próxima temporada
  const goToNextSeason = () => {
    if (currentSeasonIndex > 0) {
      setCurrentSeasonIndex(currentSeasonIndex - 1);
    }
  };

  const getMockRankings = (): ReferralRanking[] => [
    { partyAcronym: t("you"), kozAmount: 0, position: 1, isPartyReferral: true },
  ];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(party.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
     setCopied(false);
    }
  };

  const getRankingsToShow = (rankings: ReferralRanking[]): ReferralRanking[] => {
    if (!rankings.length) return getMockRankings();

    // Find party position (the one with isPartyReferral: true)
    const partyRanking = rankings.find(rank => rank.isPartyReferral);
    
    if (!partyRanking) {
      // If no party referral found, follow previous logic
      const topRankings = rankings.slice(0, 4);
      const partyPosition = rankings.length + 1;
      const newPartyRanking: ReferralRanking = {
        partyAcronym: t("you"),
        kozAmount: 0,
        position: partyPosition,
        isPartyReferral: true
      };
      return [...topRankings, newPartyRanking];
    }

    // Always show top 3
    const top3 = rankings.filter(r => r.position <= 3);
    
    // If party is in top 3, get next 2 positions after top 3
    if (partyRanking.position <= 3) {
      const afterTop3 = rankings
        .filter(r => r.position > 3 && r.position <= 5)
        .slice(0, 2);
      return [...top3, ...afterTop3];
    }

    // For parties below top 3:
    // Show top 3 + position before party + party position
    const positionBeforeParty = rankings.find(r => r.position === partyRanking.position - 1);
    const finalRankings = [
      ...top3,
      ...(positionBeforeParty ? [positionBeforeParty] : []),
      partyRanking
    ];

    return finalRankings.slice(0, 5).sort((a, b) => a.position - b.position);
  };

  const rankingsToShow = getRankingsToShow(referralRanking);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black]">
      <div className="flex justify-center mb-4">
        <PartyFlag 
          availableColors={[party.flagColor]}
          onRegenerate={() => {}}
          selectedColor={party.flagColor}
          onColorSelect={() => {}}
          readOnly
        />
      </div>

      <div className="flex flex-col space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-300 font-['Press_Start_2P']">
            {party.acronym}
          </h2>
          <p className="text-white mt-2 font-['Press_Start_2P'] text-sm">
            {party.name}
          </p>
          {party.partyType && (
            <div className="mt-2 inline-block bg-gray-800 px-3 py-1 rounded-full">
              <p className="text-gray-300 text-xs font-['Press_Start_2P']">
                {party.partyType ? formatPartyType(party.partyType) : t("unknownType", { defaultValue: "Unknown Type" })}
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-md border-2 border-white">
          <h3 className="text-yellow-300 text-sm font-bold mb-2 font-['Press_Start_2P']">
            {t("referralCode")}
          </h3>
          <p className="text-white text-xs mb-4 text-center leading-relaxed font-['Press_Start_2P']">
            {t("referralCodeDescription")}
          </p>
          <div className="flex items-center justify-between bg-gray-700 p-2 rounded">
            <span className="text-white font-mono text-lg">
              {party.referralCode}
            </span>
            <button
              onClick={handleCopyCode}
              className={`p-2 rounded-md transition-colors ml-4 ${
                copied ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title={copied ? t("copied") : t("copyCode")}
            >
              <ClipboardDocumentIcon className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <ReferralRewardCard 
              amount="5x" 
              label={t("youGet")} 
              recipient={t("youReceive")} 
            />
            <ReferralRewardCard 
              amount="5x" 
              label={t("theyGet")} 
              recipient={t("theyReceive")} 
            />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-md border-2 border-white mt-4">
          <h3 className="text-yellow-300 text-sm font-bold mb-2 font-['Press_Start_2P'] text-center">
            {t("referralRanking")}
          </h3>
          <p className="text-white text-xs mb-4 text-center leading-relaxed font-['Press_Start_2P']">
            {t("rankingDescription")}
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <ReferralRewardCard amount={14000} label="KOZ" recipient="1st" />
            <ReferralRewardCard amount={7000} label="KOZ" recipient="2nd" />
            <ReferralRewardCard amount={3000} label="KOZ" recipient="3rd" />
          </div>

          <div className="space-y-2">
            {rankingsToShow.map((rank, index) => {
              const previousRank = index > 0 ? rankingsToShow[index - 1] : null;
              const hasSkippedPositions = previousRank && (rank.position - previousRank.position > 1);

              return (
                <React.Fragment key={`rank-${index}-${rank.position}`}>
                  {hasSkippedPositions && (
                    <div className="flex items-center justify-center py-1">
                      <div className="text-yellow-500 text-xs opacity-50 font-['Press_Start_2P']">
                        • • •
                      </div>
                    </div>
                  )}
                  <div 
                    className={`flex items-center justify-between p-2 rounded ${
                      rank.isPartyReferral ? 'bg-yellow-900' : 'bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-yellow-300 font-mono w-8">
                        #{rank.position}
                      </span>
                      <span className={`text-white font-mono ml-2 ${!rank.isPartyReferral ? 'opacity-50' : ''}`}>
                        {rank.partyAcronym}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white font-mono opacity-50 w-24 text-right">
                        {formatTokenAmount(rank.kozAmount)} KOZ
                      </span>
                      <div className="w-7 flex justify-center">
                        {rank.position <= 3 && (
                          <TrophyIcon 
                            className={`w-5 h-5 ${rank.isPartyReferral ? '' : 'opacity-30'} ${
                              rank.position === 1 ? 'text-yellow-400' :
                              rank.position === 2 ? 'text-gray-400' :
                              'text-yellow-700'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Adicionar esta nova seção após o bloco de referral ranking */}
        <div className="bg-gray-800 p-4 rounded-md border-2 border-white mt-4">
          <h3 className="text-yellow-300 text-sm font-bold mb-2 font-['Press_Start_2P'] text-center">
            {t("partyRanking", { defaultValue: "Party Performance" })}
          </h3>
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="w-6 h-6 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : sortedRankings.length === 0 ? (
            <p className="text-white text-xs text-center leading-relaxed font-['Press_Start_2P']">
              {t("noRankingsAvailable", { defaultValue: "No rankings available yet" })}
            </p>
          ) : (
            <>
              {/* Exibir informação sobre o tesouro KOZ (sempre mostrar) */}
              <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-600 rounded-md">
                <h4 className="text-yellow-300 text-xs font-bold mb-2 font-['Press_Start_2P'] text-center">
                  {t("treasuryPool")}
                </h4>
                
                <div className="flex justify-center items-center gap-2 mb-2">
                  <span className="text-white text-sm font-mono font-bold">
                    {formatTokenAmount(currentSeason?.kozBalance || 0)} KOZ
                  </span>
                </div>           
                
                <p className="mt-2 text-xs text-center text-yellow-200">
                  {t("distributionMethod")}
                </p>
                
                {currentSeasonIndex === 0 && (
                  <div className="mt-3 text-xs text-gray-300 text-center">
                    <i>{t("treasuryNote")}</i>
                  </div>
                )}
              </div>

              {/* Navegação entre temporadas */}
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => {
                    if (currentSeasonIndex < sortedRankings.length - 1) {
                      setCurrentSeasonIndex(currentSeasonIndex + 1);
                    }
                  }}
                  className={`p-1 rounded-full ${hasMultipleSeasons && currentSeasonIndex < sortedRankings.length - 1 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-900 text-gray-700 cursor-not-allowed'}`}
                  disabled={!hasMultipleSeasons || currentSeasonIndex >= sortedRankings.length - 1}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                
                <div className="text-white text-xs font-['Press_Start_2P']">
                  {t("season", { seasonNumber: String(currentSeason?.tierId || 0).padStart(2, '0') })}
                </div>
                
                <button 
                  onClick={() => {
                    if (currentSeasonIndex > 0) {
                      setCurrentSeasonIndex(currentSeasonIndex - 1);
                    }
                  }}
                  className={`p-1 rounded-full ${hasMultipleSeasons && currentSeasonIndex > 0
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-900 text-gray-700 cursor-not-allowed'}`}
                  disabled={!hasMultipleSeasons || currentSeasonIndex <= 0}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* Tabela de rankings - com coluna Elected próxima a Party */}
              <div className="space-y-2">
                {/* Cabeçalhos da tabela com distribuição de espaço ajustada */}
                <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 mb-1 font-['Press_Start_2P']">
                  <div className="col-span-1 text-center">{t("rankColumn")}</div>
                  <div className="col-span-3 pl-1">{t("partyColumn")}</div>
                  <div className="col-span-2 text-right pr-1">{t("winnersColumn")}</div>
                  <div className="col-span-3 text-right pr-1">{t("percentageColumn")}</div>
                  <div className="col-span-3 text-right pr-1">{t("rewardColumn")}</div>
                </div>
                
                {/* Linhas de dados */}
                {currentSeason?.rankings.sort((a, b) => b.totalWinners - a.totalWinners).map((ranking, index) => {
                  const isCurrentParty = ranking.partyAcronym === party.acronym;
                  
                  // Calcular a recompensa para cada partido com base na porcentagem
                  // e arredondar para cima para garantir valor inteiro
                  const partyReward = currentSeason?.kozBalance
                    ? Math.ceil((ranking.percentage / 100) * currentSeason.kozBalance)
                    : 0;
                  
                  return (
                    <div 
                      key={`party-rank-${ranking.partyAcronym}`}
                      className={`grid grid-cols-12 gap-2 p-2 rounded items-center ${
                        isCurrentParty ? 'bg-yellow-900' : 'bg-gray-700'
                      }`}
                    >
                      <div className="col-span-1 text-yellow-300 font-mono text-center">
                        {index + 1}
                      </div>
                      <div className={`col-span-3 font-mono pl-1 ${isCurrentParty ? 'text-white font-bold' : 'text-white opacity-70'} truncate`}>
                        {ranking.partyAcronym}
                      </div>
                      <div className="col-span-2 text-right text-white font-mono pr-1">
                        {ranking.totalWinners}
                      </div>
                      <div className="col-span-3 text-right text-yellow-300 font-mono pr-1">
                        {ranking.percentage.toFixed(1)}%
                      </div>
                      <div className="col-span-3 text-right text-green-300 font-mono pr-1">
                        {formatTokenAmount(partyReward)}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <p className="text-white text-xs mt-4 text-center leading-relaxed font-['Press_Start_2P']">
                {currentSeasonIndex === 0 && (
                  <span className="block mt-1 text-yellow-200">
                    {t("currentSeasonNote")}
                  </span>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}