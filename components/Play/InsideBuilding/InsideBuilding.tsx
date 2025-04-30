"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const InsideBuilding: React.FC = () => {
  const t = useTranslations("InsideBuilding");

  return (
    <div className="relative w-full h-auto bg-[#43A4E7]"> {/* Fundo inicial adicionado */}
      <Image
        src="/images/insideBuilding.svg"
        alt="Inside Building"
        width={1600}
        height={1480}
        className="w-full h-auto object-contain block"
        priority // Prioriza o carregamento da imagem
      />
      <Link
        href="/hall"
        className="absolute top-[83.2%] w-[100%] h-[16%] ml-[2%] cursor-pointer flex items-start"
        aria-label="Clickable Area"
      >
        <span className="text-white text-[8px] font-pixel">{t("hall")}</span>
      </Link>
      <Link
        href="/office"
        className="absolute top-[66.5%] w-[100%] h-[17%] ml-[2%] cursor-pointer flex items-start"
        aria-label="Clickable Area"
      >
        <span className="text-white text-[8px] font-pixel">{t("office")}</span>
      </Link>
      <Link
        href="/laundry"
        className="absolute top-[50%] w-[100%] h-[15%] ml-[2%] cursor-pointer flex items-start"
        aria-label="Clickable Area"
      >
        <span className="text-white text-[8px] font-pixel">{t("laundry")}</span>
      </Link>
      <Link
        href="/party"
        className="absolute top-[33.3%] w-[100%] h-[15%] ml-[2%] cursor-pointer flex items-start"
        aria-label="Clickable Area"
      >
        <span className="text-white text-[8px] font-pixel">{t("party")}</span>
      </Link>
      <Link
        href="/arcade"
        className="absolute top-[17%] w-[100%] h-[15%] ml-[2%] cursor-pointer flex items-start"
        aria-label="Clickable Area"
      >
        <span className="text-white text-[8px] font-pixel">{t("arcade")}</span>
      </Link>
      <Link
        href="/news"
        className="absolute top-[0.6%] w-[100%] h-[15%] ml-[2%] cursor-pointer flex items-start"
        aria-label="Clickable Area"
      >
        <span className="text-white text-[8px] font-pixel">{t("news")}</span>
      </Link>
    </div>
  );
};

export default InsideBuilding;
