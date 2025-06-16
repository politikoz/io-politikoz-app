import LastElectionLeaderboard from "./LastElectionLeaderboard";
import NextElectionCountdown from "./NextElectionCountdown";

interface ElectionDashboardProps {
  nextElection?: {
    date: string;
    totalPrize: number;
    tierId: number;
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
  
  // Verificar se o leaderboard existe e não está vazio
  const hasLeaderboard = lastElection?.leaderboard && lastElection.leaderboard.length > 0;

  return (
    <div
      className="relative w-full"
      style={{
        backgroundColor: "#2A1F18",
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
      <div className={`flex ${hasLeaderboard ? 'flex-col lg:flex-row justify-between' : 'justify-center'} items-start gap-6 mt-4`}>
        {/* Contador da próxima eleição */}
        <div className={`w-full ${hasLeaderboard ? 'lg:w-auto lg:ml-[10%]' : 'max-w-lg mx-auto'}`}>
          <NextElectionCountdown 
            date={nextElection?.date}
            totalPrize={nextElection?.totalPrize}
          />
        </div>

        {/* Tabela do último leaderboard - exibida apenas se houver dados */}
        {hasLeaderboard && (
          <div className="w-full lg:w-auto lg:mr-[10%]">
            <LastElectionLeaderboard 
              winners={lastElection.leaderboard}
              month={lastElection.month}
            />
          </div>
        )}
      </div>

      {/* Chão pisado */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: `${groundHeight}px`,
          background: "linear-gradient(to top, #2A1F18, #3F332C)",
          boxShadow: "inset 0px -4px 6px rgba(0, 0, 0, 0.3)",
        }}
      ></div>
    </div>
  );
}
