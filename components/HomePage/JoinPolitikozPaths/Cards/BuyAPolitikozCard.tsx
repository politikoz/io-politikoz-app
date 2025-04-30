import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const BuyAPolitikozCard: React.FC = () => {
  const t = useTranslations("JoinPolitikozPaths.buyPolitikoz");

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
      {/* Header */}
      <div
        className="text-center bg-yellow-400 text-black py-2 font-pixel text-[10px] leading-tight flex items-center justify-center"
        style={{ height: "2.5rem" }}
      >
        {cardData.header}
      </div>

      {/* Title and Description */}
      <div className="flex flex-col items-center mt-4">
        <h2 className="font-pixel text-lg leading-snug text-center h-[3.5rem] flex items-center justify-center">
          {cardData.title}
        </h2>
        <p className="text-sm mt-2 leading-relaxed text-justify text-gray-300 h-[4.5rem] flex items-center justify-center">
          {cardData.description}
        </p>
      </div>

      {/* Steps */}
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

      {/* Button */}
      <div className="mt-6">
        <Link
          href="/auth" // Define a rota de redirecionamento
          className="w-full block text-center bg-black text-white text-sm py-2 font-pixel rounded-lg hover:bg-yellow-500"
        >
          {cardData.button}
        </Link>
      </div>
    </div>
  );
};

export default BuyAPolitikozCard;
