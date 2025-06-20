import NextElectionCountdown from "./NextElectionCountdown";
import CurrentSeasonPromo from "./CurrentSeasonPromo";

interface ElectionDashboardProps {
  nextElection?: {
    date: string;
    totalPrize: number;
  };
  tierProgress: {
    percentageCompleted: number;
    prizePerTier: number;
    status: 'COMPLETED' | 'IN_PROGRESS';
    estimatedExecutionDate: string;
    tierId: number;
  } | null;
}

function DashboardPlaceholder() {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mt-4 animate-pulse">
      <div className="w-full lg:w-auto lg:ml-[10%]">
        <div className="bg-gray-800/50 h-[280px] w-[600px] rounded-lg" />
      </div>
      <div className="w-full lg:w-auto lg:mr-[10%]">
        <div className="bg-gray-800/50 h-[280px] w-[440px] rounded-lg" />
      </div>
    </div>
  );
}

export default function ElectionDashboard({ 
  nextElection, 
  tierProgress
}: ElectionDashboardProps) {
  const concreteHeight = 16;
  const chainHeight = 10;
  const groundHeight = 40;

  const isLoading = !nextElection || tierProgress === null;

  return (
    <div className="relative w-full" style={{ backgroundColor: "#2A1F18", paddingBottom: `${groundHeight}px` }}>
      {/* Concrete strip */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: `${concreteHeight}px`,
          background: "linear-gradient(to bottom, #707070, #505050)",
          boxShadow: "inset 0px 4px 6px rgba(0, 0, 0, 0.3)",
        }}
      ></div>

      <div style={{ height: `${chainHeight}px` }}></div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mt-4">
        <div className="w-full lg:w-auto lg:ml-[10%]">
          <NextElectionCountdown 
            date={nextElection?.date}
            totalPrize={nextElection?.totalPrize}
          />
        </div>

        <div className="w-full lg:w-auto lg:mr-[10%]">          
          <CurrentSeasonPromo 
            tierProgress={tierProgress}
            isLoading={!nextElection || !tierProgress}
            nextElectionDate={tierProgress?.estimatedExecutionDate ?? nextElection?.date}
          />       
        </div>
      </div>

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
