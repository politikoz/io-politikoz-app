"use client";

import { useTranslations } from "next-intl";
import { PartyInfoDTO } from "@/types/CreatePartyData";
import { ReferralRanking } from "@/types/PartyInfoData";
import PartyFlag from "./PartyFlag";
import { useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { TrophyIcon } from "@heroicons/react/24/solid";

interface PartyInfoProps {
  party: PartyInfoDTO;
  referralRanking: ReferralRanking[];
}

const ReferralRewardCard = ({ icon, amount, label }: { icon: string; amount: string; label: string }) => (
  <div className="flex flex-col items-center justify-center bg-gray-700 p-2 rounded-md">
    <span className="text-sm font-['Press_Start_2P']">{icon}</span>
    <span className="text-yellow-300 text-sm font-['Press_Start_2P']">{amount}</span>
    <span className="text-white text-xs font-['Press_Start_2P']">{label}</span>
  </div>
);

export default function PartyInfo({ party, referralRanking }: PartyInfoProps) {
  const t = useTranslations("PartyView.info");
  const [copied, setCopied] = useState(false);

  const getMockRankings = (): ReferralRanking[] => [
    { partyAcronym: t("you"), count: 0, position: 1, isPartyReferral: true },
    { partyAcronym: "----", count: 0, position: 2, isPartyReferral: false },
    { partyAcronym: "----", count: 0, position: 3, isPartyReferral: false },
    { partyAcronym: "----", count: 0, position: 4, isPartyReferral: false },
    { partyAcronym: "----", count: 0, position: 5, isPartyReferral: false }
  ];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(party.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getRankingsToShow = (rankings: ReferralRanking[]): ReferralRanking[] => {
    if (!rankings.length) return getMockRankings();

    const partyRanking = rankings.find(r => r.isPartyReferral);
    if (!partyRanking) return rankings.slice(0, 5);

    const position = partyRanking.position;
    const isFirst = position === 1;
    const isLast = position === rankings.length;

    if (isFirst) return rankings.slice(0, 5);
    if (isLast) {
      const startIndex = Math.max(0, rankings.length - 3);
      return [
        ...rankings.slice(0, 3),
        ...rankings.slice(startIndex)
      ];
    }

    const startIndex = Math.max(0, position - 3);
    const endIndex = Math.min(rankings.length, position + 2);
    return [
      ...rankings.slice(0, 3),
      ...rankings.slice(startIndex, endIndex)
    ];
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
            <ReferralRewardCard icon="🎁" amount="5x" label={t("youGet")} />
            <ReferralRewardCard icon="🤝" amount="5x" label={t("theyGet")} />
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
            <ReferralRewardCard icon="🥇" amount="5000" label="KOZ" />
            <ReferralRewardCard icon="🥈" amount="2500" label="KOZ" />
            <ReferralRewardCard icon="🥉" amount="1250" label="KOZ" />
          </div>
          <div className="space-y-2">
            {rankingsToShow.map((rank, index) => (
              <div 
                key={`${rank.partyAcronym}-${index}`}
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
                  <span className="text-white font-mono opacity-50">
                    {rank.count}
                  </span>
                  {rank.position <= 3 && (
                    <TrophyIcon 
                      className={`w-5 h-5 ml-2 ${rank.isPartyReferral ? '' : 'opacity-30'} ${
                        rank.position === 1 ? 'text-yellow-400' :
                        rank.position === 2 ? 'text-gray-400' :
                        'text-yellow-700'
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}