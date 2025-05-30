import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface PolitikozTicketsProps {
  corrupt: number;
  lobbyist: number;
  launderer: number;
  briber: number;
  frontman: number;
}

export default function PolitikozTickets({
  corrupt,
  lobbyist,
  launderer,
  briber,
  frontman
}: PolitikozTicketsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("PolitikozProfile");

  // Set all ticket values to 0
  const ticketValues = {
    corrupt: 0,
    lobbyist: 0,
    launderer: 0,
    briber: 0,
    frontman: 0,
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="absolute -top-3 left-0">
        <div className="border-2 border-white bg-gray-800 shadow-[2px_2px_0px_black] px-3 py-0.5">
          <span className="text-white text-[8px] md:text-[10px] font-['Press_Start_2P'] tracking-widest">
            {t("ticketsForJuly")}
          </span>
        </div>
      </div>

      <div className="border-4 border-white bg-gray-800 shadow-[4px_4px_0px_black] p-4 flex flex-col items-center w-full md:p-5 gap-4">
        <div className="mb-6"></div>

        <div className="flex justify-center w-full gap-4 flex-wrap">
          {[
            { image: "/images/assets/frontman.png", label: "Frontman", value: ticketValues.frontman },
            { image: "/images/assets/corrupt.png", label: "Corrupt", value: ticketValues.corrupt },
            { image: "/images/assets/lobbyist.png", label: "Lobbyist", value: ticketValues.lobbyist },
            { image: "/images/assets/briber.png", label: "Briber", value: ticketValues.briber },
            { image: "/images/assets/launderer.png", label: "Launderer", value: ticketValues.launderer },            
          ].map((ticket, index) => (
            <div key={index} className="flex flex-col items-center w-[18%] min-w-[100px]">
              <div className="border-4 border-white bg-gray-300 w-[120px] h-[120px] md:w-[132px] md:h-[132px] shadow-[4px_4px_0px_black] flex items-center justify-center">
                <Image
                  src={ticket.image}
                  alt={ticket.label}
                  width={96}
                  height={96}
                  unoptimized={true}
                  className="object-cover w-[96px] h-[96px] md:w-[108px] md:h-[108px]"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <span className="text-[12px] md:text-[16px] mt-2 text-center leading-snug max-w-[90%] md:max-w-[80%] break-words whitespace-normal">
                {ticket.label}: {ticket.value}
              </span>
            </div>
          ))}
        </div>

        <button
          disabled
          className="mt-3 border-2 border-white px-6 py-2 bg-gray-600 text-white text-xs md:text-sm font-['Press_Start_2P'] shadow-[4px_4px_0px_black] w-1/2 opacity-50 cursor-not-allowed relative"
        >
          {t("linkTickets")}
          <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[8px] text-red-400">
            {t("comingSoon")}
          </span>
        </button>
      </div>

      {/* Remove or comment out the modal since it's not being used */}
      {/* {isModalOpen && <LinkTicketsModal onClose={() => setIsModalOpen(false)} />} */}
    </div>
  );
}
