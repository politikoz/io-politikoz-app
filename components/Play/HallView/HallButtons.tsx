import {
  InformationCircleIcon,
  PrinterIcon,
  ArrowRightStartOnRectangleIcon,
  BanknotesIcon,
  AtSymbolIcon
} from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

interface HallButtons {
  onNavigate: (section: string) => void;
}

const HallButtons: React.FC<HallButtons> = ({ onNavigate }) => {
  const t = useTranslations("HallView");

  // 🔹 Configuração dos botões do menu do escritório com traduções
  const HallOptions = [
    { label: t("tour"), icon: <InformationCircleIcon />, section: "tour-politikoz" },
    { label: t("tokenomics"), icon: <PrinterIcon />, section: "tokenomics-koz" },
    { label: t("treasury"), icon: <BanknotesIcon />, section: "treasury-pot" },
    { label: t("team"), icon: <AtSymbolIcon />, section: "team" },
    { label: t("exit"), icon: <ArrowRightStartOnRectangleIcon />, section: "exit" }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
      {HallOptions.map((option, index) => (
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

export default HallButtons;
