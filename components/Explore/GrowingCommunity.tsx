"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FaTwitter, FaDiscord } from "react-icons/fa";
import { useTranslations } from "next-intl";

const COLORS = ["#FFD700", "#FF6347", "#43A4E7", "#7CFC00", "#9400D3"];

interface GrowingCommunityProps {
  holderDistribution: Array<{ name: string; value: number }>;
  totalHolders: number;
}

const GrowingCommunity: React.FC<GrowingCommunityProps> = ({ holderDistribution, totalHolders }) => {

  const t = useTranslations("Explore.GrowingCommunity");

  const twitterFollowers = 5200;
  const discordMembers = 1750;

  // Garantir que totalHolders tenha um valor padrão
  const safeTotalHolders = totalHolders || 0;

  return (
    <section
      className="w-full flex flex-wrap items-center justify-between gap-8 px-6 py-8 sm:gap-10 lg:gap-12 lg:px-16 text-white relative"
      style={{
        backgroundColor: "#1c1c1c",
        boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="relative flex-1 min-w-[300px] max-w-2xl p-4 sm:p-6 bg-[#2c2c2c] rounded-lg shadow-inner">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-pixel font-bold text-[#FFD700] mb-6">
          {t("title")}
        </h1>

        <p className="text-[#E6F7FF] text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
          <span className="font-bold text-[#FFD700]">
            {t("total", { total: safeTotalHolders.toLocaleString() })}
          </span>
        </p>

        <p className="text-[#E6F7FF] text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
          {t("social", {
            x: twitterFollowers.toLocaleString(),
            discord: discordMembers.toLocaleString(),
          })}
        </p>

        <div className="flex justify-center space-x-8">
          <a
            href="https://x.com/PolitikozNft"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#2F2F2F] hover:bg-blue-600 transition-colors"
            aria-label="X"
          >
            <FaTwitter size={20} className="text-white group-hover:text-white transition-colors" />
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#2F2F2F] hover:bg-indigo-600 transition-colors"
            aria-label="Discord"
          >
            <FaDiscord size={20} className="text-white group-hover:text-white transition-colors" />
          </a>
        </div>
      </div>

      <div className="flex-1 min-w-[300px] max-w-lg flex flex-col items-center gap-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#FFD700] font-pixel">
          {t("chartTitle")}
        </h2>

        <div className="relative w-full h-[300px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={holderDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fontSize={11}
                fill="#8884d8"
                paddingAngle={5}
                label={({ value }) => `${value} holders`}
              >
                {holderDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} holders (${((value / safeTotalHolders) * 100).toFixed(1)}%)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
            {holderDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span className="text-[10px] text-[#E6F7FF]">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowingCommunity;
