import { useTranslations } from "next-intl";
import React from "react";

interface Winner {
  place: string;
  user: string;
  prize: number;
}

interface LastElectionLeaderboardProps {
  winners?: Winner[];
  month?: string;
}

const LastElectionLeaderboard: React.FC<LastElectionLeaderboardProps> = ({ 
  winners = [], 
  month 
}) => {
  const displayedWinners = winners.slice(0, 3);
  const remainingWinners = winners.slice(3);
  const remainingPrizeSum = remainingWinners.reduce(
    (sum, winner) => sum + winner.prize,
    0
  );
  const remainingWinnersCount = remainingWinners.length;

  const tLeaderboard = useTranslations("LastElectionLeaderboard");
  const tCommon = useTranslations("Common");

  const leaderboardLabel = tLeaderboard("leaderboard");
  const electionOfLabel = tLeaderboard("electionOf");
  const monthLabel = month ? tCommon(`months.${month.toLowerCase()}`) : '';
  const placeLabel = tLeaderboard("place");
  const userLabel = tLeaderboard("user");
  const prizeLabel = tLeaderboard("prize");
  const otherWinnersLabel = tLeaderboard("otherWinners", { remainingWinnersCount });

  return (
    <div className="relative flex flex-col items-center bg-[#4B3F36] border-4 border-[#2C2924] shadow-pixel w-full sm:w-[500px] max-w-[500px] h-auto p-4 text-[#FFD700]">
      {/* Corrente pendurada */}
      <div className="absolute top-[-28px] flex flex-col items-center hidden sm:flex">
        <div className="w-[2px] h-6 bg-gray-500"></div>
        <div className="w-6 h-1 bg-gray-500 rounded-full"></div>
      </div>

      {/* Título e Subtítulo */}
      <h3
        className="text-[#FFE600] font-pixel mb-2 text-center whitespace-nowrap overflow-hidden"
        style={{
          fontSize: `clamp(12px, calc(24px - ${
            leaderboardLabel.length * 0.5
          }px), 20px)`, // Reduz o tamanho da fonte dinamicamente conforme o texto aumenta
          lineHeight: "1.2",
          maxWidth: "100%",
        }}
      >
        {leaderboardLabel}
      </h3>
      <p className="text-sm font-pixel text-[#C0A080] mb-4 text-center">{`${electionOfLabel} ${monthLabel}`}</p>

      {/* Lista de vencedores */}
      <div className="w-full">
        {/* Cabeçalho */}
        <div className="flex justify-between text-sm border-b border-[#FFD700] pb-2">
          <span className="font-bold font-pixel text-[#FFE600]">{placeLabel}</span>
          <span className="font-bold font-pixel text-[#FFE600]">{userLabel}</span>
          <span className="font-bold font-pixel text-[#FFE600]">{prizeLabel}</span>
        </div>

        {displayedWinners.map((winner, index) => (
          <div
            key={index}
            className="flex justify-between text-sm py-2 border-b border-[#6C5C4F] text-white"
          >
            <span>{winner.place}</span>
            <span>{winner.user}</span>
            <span>{winner.prize} ADA</span>
          </div>
        ))}

        {/* Outros vencedores */}
        <div className="flex justify-between text-sm py-2 text-[#FFD700]">
          <span>{otherWinnersLabel}</span>
          <span>--</span>
          <span>{remainingPrizeSum} ADA</span>
        </div>
      </div>
    </div>
  );
};

export default LastElectionLeaderboard;
