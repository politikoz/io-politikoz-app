import { Tab, TabList, TabGroup } from "@headlessui/react";
import clsx from "clsx";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { tabs } from "./tabs";
import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useTicketData } from "@/hooks/useTicketData";

interface TabNavigationProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

export default function TabNavigation({ selectedIndex, setSelectedIndex }: TabNavigationProps) {
  const t = useTranslations("TicketProfile");
  const { data: tickets } = useTicketData();
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState("auto");

  const tabsWithCounts = tabs.map((tab) => {
    if (tab.name === "Auto Link") return { ...tab, ticketCount: null };

    let filteredTickets = [];

    if (!tickets) return { ...tab, ticketCount: 0 };

    if (tab.name === "On the Race") {
      filteredTickets = tickets.filter((ticket) => ticket.inElection);
    } else if (tab.name === "Next Race") {
      filteredTickets = tickets.filter((ticket) => ticket.nextElection && !ticket.inElection);
    } else {
      filteredTickets = tickets.filter(
        (ticket) => 
          ticket.type.toLowerCase() === tab.name.toLowerCase() && 
          !ticket.inElection && 
          !ticket.nextElection
      );
    }

    return { ...tab, ticketCount: filteredTickets.length };
  });

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    percent: number;
  }) => {
    if (percent === 0) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 0.75;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10px"
        fontFamily="Press Start 2P"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  useEffect(() => {
    if (tabContainerRef.current) {
      setPanelHeight(`${tabContainerRef.current.clientHeight}px`);
    }
  }, [tabContainerRef]);

  const translatableTabs = ["On the Race", "Next Race", "Auto Link"];

  return (
    <TabGroup
      vertical
      selectedIndex={selectedIndex}
      onChange={setSelectedIndex}
      className="w-full md:w-1/4"
    >
      <div ref={tabContainerRef} className="relative">
        <div className="absolute top-0 left-0 w-full h-3 bg-gray-700 border-t-4 border-black"></div>

        <TabList className="grid grid-cols-4 md:flex md:flex-col p-2 border-4 border-black bg-gray-700 shadow-[4px_4px_0px_black]">
          {tabsWithCounts.map((tab, index) => (
            <Tab key={index} as="div">
              {({ selected }) => (
                <button
                  onClick={() => setSelectedIndex(index)}
                  className={clsx(
                    "relative w-full h-16 md:h-[50px] p-2 text-center flex flex-col md:flex-row md:justify-between items-center transition-all border-4 rounded-t-md border-black font-['Press_Start_2P']",
                    selected
                      ? "text-black bg-gray-200 shadow-[6px_6px_0px_black]"
                      : "text-gray-900 shadow-[4px_4px_0px_black]"
                  )}
                  style={{
                    backgroundColor: tab.color,
                    borderBottom: selected ? "none" : "4px solid black",
                    borderRadius: selected ? "6px 6px 0 0" : "4px",
                  }}
                >
                  <span className="absolute top-2 text-center md:static text-[8px] md:text-xs leading-none">
                    {translatableTabs.includes(tab.name) ? t(tab.name) : tab.name}
                  </span>

                  {tab.name !== "Configuration" && tab.ticketCount !== null && (
                    <span className="absolute bottom-1 right-1 md:static md:ml-auto w-[32px] h-6 flex items-center justify-center bg-black text-yellow-300 text-[10px] font-bold border-2 border-white shadow-[2px_2px_0px_black]">
                      {tab.ticketCount}
                    </span>
                  )}
                </button>
              )}
            </Tab>
          ))}
        </TabList>

        <div className="hidden md:flex flex-col items-center bg-gray-700 border-4 border-black shadow-[4px_4px_0px_black] p-4 relative">
          <div className="absolute -top-0 left-0">
            <div className="border-2 border-white bg-gray-800 shadow-[2px_2px_0px_black] px-3 py-0.5">
              <span className="text-white text-[8px] md:text-[10px] font-['Press_Start_2P'] tracking-widest">
                {t("distribution")}
              </span>
            </div>
          </div>

          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={tabsWithCounts.filter((tab) => tab.name !== "Configuration")}
                dataKey="ticketCount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={30}
                fill="#8884d8"
                label={renderCustomLabel}
                labelLine={false}
                stroke="black"
                strokeWidth={2}
              >
                {tabsWithCounts
                  .filter((tab) => tab.name !== "Auto Link")
                  .map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={tabs.find((t) => t.name === entry.name)?.color || "#8884d8"}
                    />
                  ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </TabGroup>
  );
}
