
import { 
  WalletIcon, 
  CalculatorIcon,
  BanknotesIcon,
  ArrowRightStartOnRectangleIcon 
} from "@heroicons/react/24/solid";

interface ArcadeButtonsProps {
  onNavigate: (section: string) => void;
}

// 🔹 Configuração dos botões do menu do escritório
const arcadeOptions = [  
  { label: "Stake with PLKOZ", icon: <WalletIcon />, section: "stake-plkoz" },
  { label: "Ticket Calculator", icon: <CalculatorIcon />, section: "ticket-calculator" },
  { label: "Claim KOZ", icon: <BanknotesIcon />, section: "claim-koz" },  
  { label: "Exit", icon: <ArrowRightStartOnRectangleIcon />, section: "exit" },
];

const ArcadeButtons: React.FC<ArcadeButtonsProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
      {arcadeOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => onNavigate(option.section)}
          className="w-44 h-20 flex flex-col items-center justify-center p-2 
                     bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black] 
                     hover:bg-gray-700 transition font-['Press_Start_2P']"
        >
          {/* 🔹 Ícone fixo no topo com tamanho padronizado */}
          <div className="w-8 h-8 flex items-center justify-center text-white">
            {option.icon}
          </div>

          {/* 🔹 Label centralizado e alinhado com altura fixa */}
          <span className="text-[10px] text-yellow-300 text-center leading-tight min-h-[32px] mt-1">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ArcadeButtons;
