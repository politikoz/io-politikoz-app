import React from "react";
import { useTranslations } from "next-intl";

interface TicketButtonsProps {
  selectedView: string;
  setSelectedView: (view: string) => void;
}

const ticketSections = [
  { labelKey: "myTickets", section: "profile" },
  { labelKey: "buyTickets", section: "buy" },
];

const TicketButtons: React.FC<TicketButtonsProps> = ({ selectedView, setSelectedView }) => {
  const t = useTranslations("TicketProfile");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-4">
      {ticketSections.map((option, index) => (
        <button
          key={index}
          onClick={() => setSelectedView(option.section)}
          className={`border-2 border-white px-4 py-2 bg-gray-800 text-white shadow-[4px_4px_0px_black] 
            hover:bg-gray-700 transition font-['Press_Start_2P'] text-sm ${
              selectedView === option.section ? "bg-yellow-500 text-black" : ""
            }`}
        >
          {t(option.labelKey)}
        </button>
      ))}
    </div>
  );
};

export default TicketButtons;
