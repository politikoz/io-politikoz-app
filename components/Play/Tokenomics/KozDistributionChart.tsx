"use client";

import React from "react";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";
import { useTranslations } from "next-intl";
import { TokenDistributionData, formatTokenAmount } from "@/types/Tokenomics";

const COLORS = {
  blue: "#60A5FA",
  green: "#34D399",
  yellow: "#F59E0B",
  red: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
  teal: "#14B8A6",
  orange: "#F97316",
  indigo: "#6366F1",
  cyan: "#22D3EE",
  emerald: "#10B981",
  rose: "#FB7185"
};

const createDistributionData = (t: any) => ({
  initial: [
    { name: t("categories.politikozHolders"), value: 6_302_300, fill: COLORS.blue },
    { name: t("categories.liquidityForDex"), value: 3_620_000, fill: COLORS.green },
    { name: t("categories.muesliSwapDist"), value: 330_000, fill: COLORS.yellow },
    { name: t("categories.vyfiDist"), value: 250_000, fill: COLORS.red },
    { name: t("categories.dripDropz"), value: 125_394, fill: COLORS.purple },
    { name: t("categories.socialClaimTreasury"), value: 2_100_000, fill: COLORS.pink },
    { name: t("categories.coinMachine"), value: 2_100_000, fill: COLORS.teal },
    { name: t("categories.projectTreasury"), value: 1_260_000, fill: COLORS.orange },
    { name: t("categories.advisors"), value: 1_050_000, fill: COLORS.indigo },
    { name: t("categories.coreTeam"), value: 837_700, fill: COLORS.cyan },
    { name: t("categories.stakingRewards"), value: 3_024_606, fill: COLORS.emerald }
  ],
  current: [
    { name: t("categories.inCirculation"), value: 830_788, fill: COLORS.blue },
    { name: t("categories.stakingRewards"), value: 3_024_606, fill: COLORS.green },
    { name: t("categories.politikozHolderDrop"), value: 6_302_300, fill: COLORS.yellow },
    { name: t("categories.socialClaimTreasury"), value: 2_100_000, fill: COLORS.red },
    { name: t("categories.coinMachine"), value: 2_100_000, fill: COLORS.purple },
    { name: t("categories.projectTreasury"), value: 1_260_000, fill: COLORS.pink },
    { name: t("categories.coreTeam"), value: 837_700, fill: COLORS.teal },
    { name: t("categories.advisors"), value: 1_050_000, fill: COLORS.orange }
  ]
});

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 p-2 rounded border border-gray-700">
        <p className="text-white">{data.name}</p>
        <p className="text-yellow-300 font-bold">
          {formatTokenAmount(data.value)} KOZ
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.1) return null; // Don't show labels for small segments

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-xs"
    >
      {formatTokenAmount(value)}
    </text>
  );
};

export default function KozDistributionChart() {
  const t = useTranslations("Tokenomics");
  const distributionData = createDistributionData(t);

  // Calculate dynamic radius based on screen size
  const useResponsiveRadius = () => {
    const [radius, setRadius] = React.useState(200);

    React.useEffect(() => {
      const updateRadius = () => {
        const width = window.innerWidth;
        if (width < 640) { // sm
          setRadius(120);
        } else if (width < 768) { // md
          setRadius(150);
        } else if (width < 1024) { // lg
          setRadius(180);
        } else { // xl and above
          setRadius(200);
        }
      };

      updateRadius();
      window.addEventListener('resize', updateRadius);
      return () => window.removeEventListener('resize', updateRadius);
    }, []);

    return radius;
  };

  const radius = useResponsiveRadius();

  const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLegendProps = () => {
    if (windowWidth < 768) {
      return {
        layout: "horizontal" as const,
        align: "center" as const,
        verticalAlign: "bottom" as const,
        wrapperStyle: {
          paddingTop: '2rem',
          fontSize: '12px',
        }
      };
    }
    return {
      layout: "vertical" as const,
      align: "right" as const,
      verticalAlign: "middle" as const,
      wrapperStyle: {
        paddingLeft: '2rem',
        fontSize: '14px',
      }
    };
  };

  return (
    <div className="w-full bg-gray-900 border-4 border-yellow-500 p-4 sm:p-6 rounded-lg shadow-lg text-white">
      <div className="space-y-8 sm:space-y-12">
        <div className="h-[600px] sm:h-[700px] pt-8 sm:pt-8">
          <h4 className="text-base sm:text-lg text-center text-yellow-300 font-semibold mb-12 sm:mb-12">
            {t("initialAllocationLabel")}
          </h4>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={distributionData.initial}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="40%"
                outerRadius={radius}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {distributionData.initial.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                {...getLegendProps()}
                formatter={(value, entry: any) => (
                  <span className="text-white text-xs sm:text-sm">
                    {value} ({formatTokenAmount(entry.payload.value)})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[600px] sm:h-[700px] pt-8 sm:pt-8">
          <h4 className="text-base sm:text-lg text-center text-yellow-300 font-semibold mb-12 sm:mb-12">
            {t("currentAllocationLabel")}
          </h4>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={distributionData.current}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="40%"
                outerRadius={radius}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {distributionData.current.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                {...getLegendProps()}
                formatter={(value, entry: any) => (
                  <span className="text-white text-xs sm:text-sm">
                    {value} ({formatTokenAmount(entry.payload.value)})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
