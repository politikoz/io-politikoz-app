import LastElectionLeaderboard from "./LastElectionLeaderboard";
import NextElectionCountdown from "./NextElectionCountdown";

interface ElectionDashboardProps {
  nextElection?: {
    date: string;
    totalPrize: number;
  };
  lastElection?: {
    leaderboard: Array<{
      place: string;
      user: string;
      prize: number;
    }>;
    month: string;
  };
}

export default function ElectionDashboard({ nextElection, lastElection }: ElectionDashboardProps) {
  const concreteHeight = 16;
  const chainHeight = 10;
  const groundHeight = 40;

  return (
    <div
      className="relative w-full"
      style={{
        backgroundColor: "#3A2920",
        paddingBottom: `${groundHeight}px`,
      }}
    >
      {/* Faixa de concreto superior */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: `${concreteHeight}px`,
          background: "linear-gradient(to bottom, #707070, #505050)",
          boxShadow: "inset 0px 4px 6px rgba(0, 0, 0, 0.3)",
        }}
      ></div>

      {/* Espaço para a corrente ou suporte */}
      <div style={{ height: `${chainHeight}px` }}></div>

      {/* Container principal dos componentes internos */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mt-4">
        {/* Contador da próxima eleição */}
        <div className="w-full lg:w-auto lg:ml-[10%]">
          <NextElectionCountdown 
            date={nextElection?.date}
            totalPrize={nextElection?.totalPrize}
          />
        </div>

        {/* Tabela do último leaderboard */}
        <div className="w-full lg:w-auto lg:mr-[10%]">
          <LastElectionLeaderboard 
            winners={lastElection?.leaderboard}
            month={lastElection?.month}
          />
        </div>
      </div>

      {/* Chão pisado */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: `${groundHeight}px`,
          background: "linear-gradient(to top, #3A2920, #4B3F36)",
          boxShadow: "inset 0px -4px 6px rgba(0, 0, 0, 0.3)",
        }}
      ></div>
    </div>
  );
}
