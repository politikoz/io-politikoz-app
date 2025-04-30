"use client";

import { useTranslations } from "next-intl";
import ElectionRoadmap from "./ElectionRoadmap";
import WaveDrawResults from "./WaveDrawResults";

export default function ElectionInfo() {
  const t = useTranslations("ElectionInfo");

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black]">
      <h1 className="text-center text-lg font-bold text-yellow-400 mb-6">{t("title")}</h1>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col space-y-6">
          <ElectionRoadmap />
          <WaveDrawResults />
        </div>
      </div>
    </div>
  );
}
