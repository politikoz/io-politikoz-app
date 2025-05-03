import { Tab, TabList, TabGroup } from "@headlessui/react";
import clsx from "clsx";
import { tabs } from "./tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePolitikozData } from "@/hooks/usePolitikozData";

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return percent > 0 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '10px' }}>
      {name}
    </text>
  ) : null;
};

const formatTabName = (name: string) => {
  return name.replace('_', ' ');
};

interface TabNavigationProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

export default function TabNavigation({ selectedIndex, setSelectedIndex }: TabNavigationProps) {
  const { data: politikozList = [] } = usePolitikozData();
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState("auto");
  const t = useTranslations("PolitikozProfile");

  const tabsWithCounts = tabs.map((tab) => ({
    ...tab,
    politikozCount: politikozList.filter((p) => p.type === tab.name).length,
  }));

  useEffect(() => {
    if (tabContainerRef.current) {
      setPanelHeight(`${tabContainerRef.current.clientHeight}px`);
    }
  }, [tabContainerRef]);

  return (
    <TabGroup vertical selectedIndex={selectedIndex} onChange={setSelectedIndex} className="w-full md:w-1/4">
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
                    {formatTabName(tab.name)}
                  </span>

                  <span className="absolute bottom-1 right-1 md:static md:ml-auto w-[32px] h-6 flex items-center justify-center bg-black text-yellow-300 text-[10px] font-bold border-2 border-white shadow-[2px_2px_0px_black]">
                    {tab.politikozCount}
                  </span>
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
                data={tabsWithCounts}
                dataKey="politikozCount"
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
                {tabsWithCounts.map((entry, index) => (
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
