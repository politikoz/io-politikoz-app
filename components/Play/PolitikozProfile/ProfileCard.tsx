import { useState } from "react";
import clsx from "clsx";
import History from "./History";
import PolitikozPower from "./PolitikozPower";
import PolitikozTickets from "./PolitikozTickets";
import { useTranslations } from "next-intl";

interface ProfileCardProps {
  historico: string[];
  dirtyMoney: number;
  influence: number;
  cleanMoney: number;
  bribePower: number;
  scapegoats: number;
}

export default function ProfileCard({
  historico,
  dirtyMoney,
  influence,
  cleanMoney,
  bribePower,
  scapegoats,
}: ProfileCardProps) {
  const [activeTab, setActiveTab] = useState<"details" | "tickets">("details");
  const t = useTranslations("PolitikozProfile");

  return (
    <div className="relative flex flex-col w-full mt-12 border-4 border-dark bg-gray-800 shadow-[4px_4px_0px_black] p-4 flex-grow">
      <div className="absolute -top-9 -left-1 flex space-x-1">
        {[
          { name: t("details"), key: "details" },
          { name: t("tickets"), key: "tickets" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={clsx(
              "border-4 border-white text-white text-[10px] md:text-sm font-['Press_Start_2P'] px-4 py-1 shadow-[4px_4px_0px_black]",
              activeTab === tab.key
                ? "bg-gray-900 text-yellow-300"
                : "bg-gray-700 hover:bg-gray-600"
            )}
            onClick={() => setActiveTab(tab.key as "details" | "tickets")}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="flex-1 mt-4">
        {activeTab === "details" ? (
          <>
            <PolitikozPower
              dirtyMoney={dirtyMoney}
              influence={influence}
              cleanMoney={cleanMoney}
              bribePower={bribePower}
              scapegoats={scapegoats}
            />
            <div className="mt-4"></div>
            <History history={historico} />
          </>
        ) : (
          <PolitikozTickets corrupt={5} lobbyist={3} launderer={7} briber={2} frontman={4} />
        )}
      </div>
    </div>
  );
}
