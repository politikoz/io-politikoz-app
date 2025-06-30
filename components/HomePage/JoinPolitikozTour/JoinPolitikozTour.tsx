import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useTour } from "@/contexts/TourContext";

const JoinPolitikozTour: React.FC = () => {
  const t = useTranslations("JoinPolitikozTour");
  const router = useRouter();
  const { activateTour } = useTour(); 

  const handleStartTour = () => {
    activateTour();
    router.push("/play");
    return;
  };

  return (
    <div className="bg-[#1c1c1c] p-5">
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <h2 className="text-2xl md:text-3xl font-pixel text-yellow-400 mb-4 text-center">
          {t("title")}
        </h2>
        
        <p className="text-white text-center max-w-lg mb-8 text-base">
          {t("description")}
        </p>

        <button
          onClick={handleStartTour}
          className="relative group mt-4 bg-green-600 hover:bg-green-700 
                   transform hover:scale-105 transition-all duration-200
                   font-pixel text-white px-10 py-4 rounded-lg
                   border-4 border-white shadow-[6px_6px_0px_black]
                   hover:rotate-1"
        >
          <span className="text-lg">{t("startTourButton")}</span>
          <div className="absolute -top-8 -right-3 bg-red-500 
                        rounded-full px-3 py-1 text-xs font-pixel
                        border-2 border-white animate-pulse
                        group-hover:animate-bounce">
            {t("rewardLabel")}
          </div>
        </button>

        <p className="text-xs text-gray-400 mt-3 italic">
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
};

export default JoinPolitikozTour;