"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useTour } from "@/contexts/TourContext";
import TourManager from "../Tour/TourManager";

const InsideBuilding: React.FC = () => {
  const t = useTranslations("InsideBuilding");
  const [localTourActive, setLocalTourActive] = useState(false);
  const { isTourActive } = useTour();

  useEffect(() => {
    if (isTourActive) {
      setLocalTourActive(true);
    }
  }, [isTourActive]);

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
      {/* <Link
        href="/arcade"
        className="absolute top-[17%] w-[100%] h-[15%] ml-[2%] cursor-pointer flex items-start"
        aria-label="Clickable Area"
      >
        <span className="text-white text-[8px] font-pixel">{t("arcade")}</span>
      </Link> */}
      <div
        className="absolute top-[17%] w-[100%] h-[15%] ml-[2%] flex items-start cursor-not-allowed"
        aria-label="Coming Soon"
      >
        <span className="text-white text-[8px] font-pixel">{t("arcade")}</span>
      </div>
      <Link
        href="/news"
        className="absolute top-[0.6%] w-[100%] h-[15%] ml-[2%] cursor-pointer flex items-start"
        aria-label="Clickable Area"
      >
        <span className="text-white text-[8px] font-pixel">{t("news")}</span>
      </Link>

      {/* Tour overlay */}
      {localTourActive && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-transparent pointer-events-auto"></div>
          <div className="absolute bottom-32 sm:bottom-40 left-4 sm:left-10 pointer-events-auto">
            <TourManager
              section="welcome"
              onClose={() => {
                setLocalTourActive(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InsideBuilding;
