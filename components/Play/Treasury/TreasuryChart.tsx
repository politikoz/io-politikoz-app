"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslations } from "next-intl";

interface TreasuryHistoryData {
  epoch: number;
  ada: number;
}

export default function TreasuryChart({ data }: { data: TreasuryHistoryData[] }) {
  const t = useTranslations("Treasury");

  return (
    <div className="bg-gray-900 border-4 border-yellow-500 p-6 rounded-lg shadow-lg text-white w-full">
      <h3 className="text-lg font-bold text-yellow-300 mb-2">{t("growthTitle")}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis 
            dataKey="epoch" 
            stroke="#ccc"
            label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            stroke="#ccc"
            label={{ value: 'ADA', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toLocaleString()} ADA`, 'Balance']}
            labelFormatter={(epoch) => `Epoch ${epoch}`}
          />
          <Line 
            type="monotone" 
            dataKey="ada" 
            stroke="#00e676" 
            strokeWidth={2} 
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
