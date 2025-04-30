import React from "react";
import { useTranslations } from "next-intl";

const StakeAndWinCard: React.FC = () => {
  const t = useTranslations("JoinPolitikozPaths.stakeAndWin");

  const cardData = {
    header: t("header"),
    title: t("title"),
    description: t("description"),
    steps: [
      { title: t("step1Title"), text: t("step1Text") },
      { title: t("step2Title"), text: t("step2Text") },
      { title: t("step3Title"), text: t("step3Text") },
    ],
    button: t("button"),
  };

  return (
    <div className="p-4 bg-dark text-white rounded-lg shadow-lg flex flex-col h-full">
      <div
        className="text-center bg-green-500 text-black py-2 font-pixel text-[10px] leading-tight flex items-center justify-center"
        style={{ height: "2.5rem" }}
      >
        {cardData.header}
      </div>

      <div className="flex flex-col items-center mt-4">
        <h2 className="font-pixel text-lg leading-snug h-[3.5rem] flex items-center text-center justify-center">
          {cardData.title}
        </h2>
        <p className="text-sm mt-2 leading-relaxed text-gray-300 h-[4.5rem] flex items-center text-justify justify-center">
          {cardData.description}
        </p>
      </div>

      <ul className="mt-6 flex-1 space-y-4 flex flex-col justify-between">
        {cardData.steps.map((step, index) => (
          <li key={index} className="flex flex-col">
            <strong className="text-yellow-400 text-base h-[2rem] flex items-center">
              {index + 1}. {step.title}
            </strong>
            <p className="text-gray-300 text-sm mt-1 ml-5 h-[1.5rem] flex items-center">
              {step.text}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <button className="w-full bg-black text-white text-sm py-2 font-pixel rounded-lg hover:bg-yellow-500">
          {cardData.button}
        </button>
      </div>
    </div>
  );
};

export default StakeAndWinCard;
