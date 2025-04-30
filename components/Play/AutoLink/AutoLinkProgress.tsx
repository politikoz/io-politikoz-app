"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface Props {
  usedPercentage: number;
}

const AutoLinkProgress: React.FC<Props> = ({ usedPercentage }) => {
  const t = useTranslations("AutoLink.Progress");
  
  return (
    <div className="mt-1 mb-4">
      <h3 className="text-sm text-yellow-300 font-bold">{t("title")}</h3>
      <div className="relative w-full bg-gray-700 border border-white h-6">
        <div
          className="h-full bg-green-500"
          style={{ width: `${usedPercentage}%` }}
        ></div>
        <p className="absolute inset-0 flex items-center justify-center text-xs text-white">
          {usedPercentage.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default AutoLinkProgress;
