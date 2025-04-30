import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Tab,
  TabGroup,
  TabList,
  TabPanels,
  TabPanel,
} from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface LinkTicketsModalProps {
  onClose: () => void;
}

export default function LinkTicketsModal({ onClose }: LinkTicketsModalProps) {
  const t = useTranslations("PolitikozProfile");

  const ticketTypes = [
    { name: "Frontman", image: "/images/frontman.png", description: t("frontmenDesc") },
    { name: "Corrupt", image: "/images/corrupt.png", description: t("corruptDesc") },
    { name: "Lobbyist", image: "/images/lobbyist.png", description: t("lobbyistDesc") },
    { name: "Briber", image: "/images/briber.png", description: t("briberDesc") },
    { name: "Launderer", image: "/images/launderer.png", description: t("laundererDesc") },    
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantities, setQuantities] = useState(new Array(ticketTypes.length).fill(0));

  const handleIncrease = () => {
    setQuantities((prev) => {
      const newQuantities = [...prev];
      newQuantities[selectedIndex] += 1;
      return newQuantities;
    });
  };

  const handleDecrease = () => {
    setQuantities((prev) => {
      const newQuantities = [...prev];
      if (newQuantities[selectedIndex] > 0) newQuantities[selectedIndex] -= 1;
      return newQuantities;
    });
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <DialogPanel className="relative z-10 border-4 border-white bg-gray-900 text-white p-6 shadow-[6px_6px_0px_black] max-w-md w-full">
        <DialogTitle className="text-center text-lg font-['Press_Start_2P'] mb-4">
          {t("addTickets")}
        </DialogTitle>

        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <TabList className="grid grid-cols-3 gap-1 mb-2">
            {ticketTypes.slice(0, 3).map((ticket, index) => (
              <Tab key={index} as="div">
                {({ selected }) => (
                  <button
                    className={clsx(
                      "text-xs font-['Press_Start_2P'] px-2 py-1 border-2 border-white transition-all w-full",
                      selected ? "bg-yellow-400 text-black" : "bg-black text-white"
                    )}
                  >
                    {ticket.name}
                  </button>
                )}
              </Tab>
            ))}
          </TabList>

          <TabList className="grid grid-cols-2 gap-1">
            {ticketTypes.slice(3, 5).map((ticket, index) => (
              <Tab key={index + 3} as="div">
                {({ selected }) => (
                  <button
                    className={clsx(
                      "text-xs font-['Press_Start_2P'] px-2 py-1 border-2 border-white transition-all w-full",
                      selected ? "bg-yellow-400 text-black" : "bg-black text-white"
                    )}
                  >
                    {ticket.name}
                  </button>
                )}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {ticketTypes.map((ticket, index) => (
              <TabPanel key={index} className="flex flex-col items-center mt-4">
                <div className="border-4 border-white bg-black p-2 shadow-[4px_4px_0px_black]">
                  <Image src={ticket.image} alt={ticket.name} width={100} height={100} />
                </div>

                <div className="flex items-center mt-4">
                  <button
                    onClick={handleDecrease}
                    className="border-2 border-white px-3 py-1 bg-black text-white text-lg shadow-[4px_4px_0px_black]"
                  >
                    -
                  </button>
                  <span className="mx-4 text-lg font-bold">{quantities[index]}</span>
                  <button
                    onClick={handleIncrease}
                    className="border-2 border-white px-3 py-1 bg-black text-white text-lg shadow-[4px_4px_0px_black]"
                  >
                    +
                  </button>
                </div>

                <p className="text-center text-sm text-gray-300 mt-4 px-4">{ticket.description}</p>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>

        <button
          onClick={onClose}
          className="w-full mt-6 border-2 border-white px-4 py-2 bg-red-600 text-white text-sm font-['Press_Start_2P'] shadow-[4px_4px_0px_black]"
        >
          {t("close")}
        </button>
      </DialogPanel>
    </Dialog>
  );
}
