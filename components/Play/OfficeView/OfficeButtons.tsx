import {
  WalletIcon,
  TicketIcon,
  InformationCircleIcon,
  ChartBarSquareIcon,
  ChartPieIcon,
  CircleStackIcon,
  ArrowRightStartOnRectangleIcon
} from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

interface OfficeButtonsProps {
  onNavigate: (section: string) => void;
}

const OfficeButtons: React.FC<OfficeButtonsProps> = ({ onNavigate }) => {
  const t = useTranslations("OfficeView");

  const officeOptions = [
    { label: t("incomeOutcome"), icon: <WalletIcon />, section: "income-outcome" },
    { label: t("myTickets"), icon: <TicketIcon />, section: "my-tickets" },
    { label: t("prizeInfo"), icon: <ChartPieIcon />, section: "prize-info" },
    { label: t("waveInfo"), icon: <InformationCircleIcon />, section: "wave-info" },
    { label: t("electionResults"), icon: <ChartBarSquareIcon />, section: "election-results" },
    { label: t("buyKoz"), icon: <CircleStackIcon />, section: "buy-koz" },
    { label: t("exit"), icon: <ArrowRightStartOnRectangleIcon />, section: "exit" }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
      {officeOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => onNavigate(option.section)}
          className="w-44 h-20 flex flex-col items-center justify-center p-2 
                     bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black] 
                     hover:bg-gray-700 transition font-['Press_Start_2P']"
        >
          <div className="w-8 h-8 flex items-center justify-center text-white">
            {option.icon}
          </div>
          <span className="text-[10px] text-yellow-300 text-center leading-tight min-h-[32px] mt-1">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default OfficeButtons;
