"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ExploreIntroProps {
  floorPrice: number;
}

const ExploreIntro: React.FC<ExploreIntroProps> = ({ floorPrice }) => {
  const t = useTranslations("Explore.ExploreIntro");

  return (
    <section className="w-full flex flex-wrap items-center justify-between gap-8 px-6 py-8 sm:gap-10 lg:gap-12 bg-[#43A4E7] text-white">
      <div className="relative flex-1 min-w-[300px] max-w-2xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-pixel font-bold text-[#FFD700] mb-6">
          {t("title")}
        </h1>
        <p className="text-[#E6F7FF] text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
          {t("text1")}
        </p>
        <p className="text-[#E6F7FF] text-sm sm:text-base lg:text-lg leading-relaxed mb-6">
          {t("text2")}
        </p>
        <p className="text-lg sm:text-xl font-bold text-[#FFFAE0] mb-6">
          {t("floor", { price: `${floorPrice} ADA` })}
        </p>
        <a
          href="https://www.jpg.store/collection/politikoz?tab=items"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-yellow-300 transition-transform transform hover:scale-105"
          aria-label="Buy Politikoz NFTs on JPG.Store"
        >
          {t("cta")}
        </a>
      </div>

      <div className="hidden sm:grid flex-1 grid-cols-3 gap-6 max-w-md">
        {["06690", "08301", "06691", "08342", "09164", "06874"].map((id) => (
          <Image
            key={id}
            src={`/images/assets/${id}.png`}
            alt={`Politikoz NFT #${id}`}
            width={90}
            height={120}
            className="w-full h-full object-cover"
            style={{ imageRendering: "pixelated" }}
          />
        ))}
      </div>
    </section>
  );
};

export default ExploreIntro;
