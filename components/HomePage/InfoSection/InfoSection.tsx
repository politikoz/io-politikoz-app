import React from "react";
import { useTranslations } from "next-intl";
import { formatTreasuryValue } from '@/utils/formatters';

interface InfoSectionProps {
  treasury?: {
    balance: number;
  };
}

const InfoSection: React.FC<InfoSectionProps> = ({ treasury }) => {
  const t = useTranslations("InfoSection");
  const treasuryValue = treasury?.balance ? formatTreasuryValue(treasury.balance) : '0K';

  // Keeping existing card data structure
  const cardData = [
    { 
      title: t("cardData.prizes.title", { amount: 350 }), 
      text: t("cardData.prizes.text"),
      gradient: "from-yellow-400 to-yellow-600"
    },
    { 
      title: t("cardData.freeEntries.title"), 
      text: t("cardData.freeEntries.text"),
      gradient: "from-green-400 to-green-600"
    },
    { 
      title: t("cardData.auditable.title"), 
      text: t("cardData.auditable.text"),
      gradient: "from-blue-400 to-blue-600"
    },
    { 
      title: t("cardData.treasury.title", { treasury: treasuryValue }), 
      text: t("cardData.treasury.text"),
      gradient: "from-purple-400 to-purple-600"
    },
  ];

  return (
    <section className="relative py-12 bg-gradient-to-b from-[#1c1c1c] to-[#2a2a2a]">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 -top-4 w-24 h-24 bg-yellow-500 opacity-5 rounded-full blur-xl"></div>
        <div className="absolute right-1/4 top-1/2 w-32 h-32 bg-blue-500 opacity-5 rounded-full blur-xl"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="relative group bg-[#2c2c2c] rounded-lg p-6 
                         transform hover:scale-105 transition-all duration-300
                         border-2 border-gray-800 hover:border-gray-700"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} 
                             opacity-0 group-hover:opacity-10 transition-opacity 
                             duration-300 rounded-lg`}
              ></div>

              <div className="relative flex flex-col items-center text-center h-full">
                <h3 className="text-lg xl:text-xl font-pixel text-white group-hover:text-yellow-400 
                             transition-colors duration-300 leading-tight mb-4 whitespace-pre-line">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 mt-auto">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://docs.politikoz.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-gray-400 
                     hover:text-white transition-colors duration-300 group"
          >
            <span>{t("learnMore")}</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
