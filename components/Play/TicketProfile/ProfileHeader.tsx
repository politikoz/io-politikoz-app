import { useTranslations } from "next-intl";
import { useGovernanceData } from "@/hooks/useGovernanceData";
import Image from "next/image";

interface ProfileHeaderProps {
  cargo: string;
}

export default function ProfileHeader({ cargo }: ProfileHeaderProps) {
  const t = useTranslations("TicketProfile");
  const { data: governanceData } = useGovernanceData();
  
  const formattedCargo = cargo.toLowerCase().trim().replace(/\s+/g, "-");
  const upperCargo = cargo.toUpperCase().trim().replace(/\s+/g, "_");

  // Calculate ADA reward based on distribution percentage and total pot
  const calculateAdaReward = () => {
    if (!governanceData) return 0;
    const distribution = governanceData.distribution[upperCargo] || 0;
    const totalAda = governanceData.potShare.totalAdaPerElection;
    return Math.round((distribution / 100) * totalAda);
  };

  // Get boost percentage from governance data
  const getBoostPercentage = () => {
    if (!governanceData) return 0;
    return (governanceData.ticketBoost[upperCargo] || 0) * 100;
  };

  const stats = {
    boostPercentage: getBoostPercentage(),
    adaReward: calculateAdaReward()
  };

  const isDynamicTicket = governanceData && (upperCargo in governanceData.ticketBoost);

  return (
    <div className="flex items-start mt-4 space-x-4">
      {/* Imagem */}
      <div className="w-[120px] h-[120px] border-4 border-white bg-gray-600 shadow-[6px_6px_0px_black] overflow-hidden">
        <Image
          src={`/images/assets/${formattedCargo}.png`}
          alt={cargo}
          width={120}
          height={120}
          className="w-full h-full object-cover"
          style={{ imageRendering: "pixelated" }}
          priority={true}
        />
      </div>

      {/* Nome e descrição */}
      <div className="flex flex-col">
        <h2 className="text-lg font-bold font-['Press_Start_2P'] text-yellow-300">{cargo}</h2>
        <p className="mt-1 text-xs sm:text-sm text-green-400 font-semibold max-w-[280px]">
          {isDynamicTicket
            ? t("dynamicTicket", {
                boostPercentage: stats.boostPercentage,
                adaReward: stats.adaReward,
              })
            : t(formattedCargo)}
        </p>
      </div>
    </div>
  );
}
