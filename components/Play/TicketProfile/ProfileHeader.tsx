import { useTranslations } from "next-intl";

interface ProfileHeaderProps {
  cargo: string;
}

// 🔹 Mock para simular valores vindos da API
const ticketStats: { [key: string]: { boostPercentage: number; adaReward: number } } = {
  frontman: { boostPercentage: 5, adaReward: 100 },
  corrupt: { boostPercentage: 7, adaReward: 150 },
  lobbyist: { boostPercentage: 4, adaReward: 80 },
  launderer: { boostPercentage: 3, adaReward: 120 },
  briber: { boostPercentage: 6, adaReward: 90 },
};

export default function ProfileHeader({ cargo }: ProfileHeaderProps) {
  const t = useTranslations("TicketProfile");

  const formattedCargo = cargo.toLowerCase().trim().replace(/\s+/g, "-");

  const stats = ticketStats[formattedCargo];
  const isDynamicTicket = !!stats;

  return (
    <div className="flex items-start mt-4 space-x-4">
      {/* Imagem */}
      <div className="w-[120px] h-[120px] border-4 border-white bg-gray-600 shadow-[6px_6px_0px_black] overflow-hidden">
        <img
          src={`/images/${formattedCargo}.png`}
          alt={cargo}
          className="w-full h-full object-cover"
          style={{ imageRendering: "pixelated" }}
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
