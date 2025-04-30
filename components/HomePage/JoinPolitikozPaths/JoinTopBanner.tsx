import React from "react";
import { useTranslations } from "next-intl";

const JoinTopBanner: React.FC = () => {
  const t = useTranslations("JoinPolitikozPaths.topBanner");

  return (
    <div className="w-full bg-[#1c1c1c] shadow-lg text-white text-center py-4">
      <p className="text-base sm:text-sm md:text-lg lg:text-xl font-pixel tracking-wide">
        {t("text")}
      </p>
    </div>
  );
};

export default JoinTopBanner;
