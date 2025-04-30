import { 
  WalletIcon, 
  CalculatorIcon,
  BanknotesIcon,
  ArrowRightStartOnRectangleIcon 
} from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

interface LaundryButtonsProps {
  onNavigate: (section: string) => void;
}

const LaundryButtons: React.FC<LaundryButtonsProps> = ({ onNavigate }) => {
  const t = useTranslations("LaundryView");

  const laundryOptions = [  
    { label: t("stakeWithPlkoz"), icon: <WalletIcon />, section: "stake-plkoz" },
    { label: t("ticketCalculator"), icon: <CalculatorIcon />, section: "ticket-calculator" },
    { label: t("claimKoz"), icon: <BanknotesIcon />, section: "claim-koz" },  
    { label: t("exit"), icon: <ArrowRightStartOnRectangleIcon />, section: "exit" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
      {laundryOptions.map((option, index) => (
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

export default LaundryButtons;
