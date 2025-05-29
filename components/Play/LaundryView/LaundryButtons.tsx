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
    { label: t("stakeWithPlkoz"), icon: <WalletIcon />, section: "stake-plkoz", disabled: false },
    { label: t("ticketCalculator"), icon: <CalculatorIcon />, section: "ticket-calculator", disabled: false },
    { label: t("claimKoz"), icon: <BanknotesIcon />, section: "claim-koz", disabled: true },  
    { label: t("exit"), icon: <ArrowRightStartOnRectangleIcon />, section: "exit", disabled: false },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
      {laundryOptions.map((option, index) => {
        const isDisabled = option.disabled && option.section !== "exit";

        return (
          <button
            key={index}
            onClick={() => !isDisabled && onNavigate(option.section)}
            disabled={isDisabled}
            className={`w-44 h-20 flex flex-col items-center justify-center p-2 
                       bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black] 
                       hover:bg-gray-700 transition font-['Press_Start_2P']
                       ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="w-8 h-8 flex items-center justify-center text-white">
              {option.icon}
            </div>
            <div className="flex flex-col items-center mt-1 min-h-[32px] justify-center">
              <span className="text-[10px] text-yellow-300 text-center leading-tight">
                {option.label}
              </span>
              {isDisabled && (
                <span className="text-[8px] text-red-400 text-center leading-tight mt-1">
                  {t("comingSoon")}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default LaundryButtons;
