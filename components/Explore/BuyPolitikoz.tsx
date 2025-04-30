"use client";

import React from "react";
import { useTranslations } from "next-intl";

const BuyPolitikoz: React.FC = () => {
  const t = useTranslations("Explore.BuyPolitikoz");

  return (
    <section className="w-full py-8 px-6 sm:px-10 lg:px-16 bg-[#4EA9E8] text-white text-center">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-pixel font-bold text-[#FFD700] mb-6">
        {t("title")}
      </h2>
      <a
        href="https://www.jpg.store/collection/politikoz?tab=items"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-yellow-300 transition-transform transform hover:scale-105"
        aria-label="Buy Politikoz NFTs on JPG.Store"
      >
        {t("cta")}
      </a>
    </section>
  );
};

export default BuyPolitikoz;
