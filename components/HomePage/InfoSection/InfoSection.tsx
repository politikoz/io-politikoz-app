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

  // Dados dos cartões com placeholders traduzidos
  const cardData = [
    { 
      title: t("cardData.prizes.title", { amount: 350 }), 
      text: t("cardData.prizes.text") 
    },
    { 
      title: t("cardData.freeEntries.title"), 
      text: t("cardData.freeEntries.text") 
    },
    { 
      title: t("cardData.auditable.title"), 
      text: t("cardData.auditable.text") 
    },
    { 
      title: t("cardData.treasury.title", { treasury: treasuryValue }), 
      text: t("cardData.treasury.text") 
    },
  ];

  return (
    <section
      className="info-section pt-6 pb-6 px-4"
      style={{
        background: "linear-gradient(to bottom, #3b3b3b, #505050)",
        boxShadow: "inset 0px 4px 6px rgba(0, 0, 0, 0.5)", // Efeito de profundidade
      }}
    >
      <div className="container mx-auto">
        {/* Grade Responsiva */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="bg-[#3b3b3b] border-4 border-[#2c2c2c] shadow-pixel text-white px-4 py-6 rounded-md flex flex-col items-center text-center"
            >
              {/* Ajuste no tamanho da fonte para caber em duas linhas */}
              <h3 className="text-xs lg:text-lg xl:text-[1rem] font-pixel mb-3 leading-tight max-w-[180px]">
                {card.title}
              </h3>
              {/* Texto do subtítulo posicionado no rodapé */}
              <p className="text-xs sm:text-sm lg:text-base font-sans mt-auto pb-4">
                {card.text}
              </p>
            </div>
          ))}
        </div>

        {/* Link para aprender mais */}
        <div className="text-center mt-6">
          <a
            href="https://docs.politikoz.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold underline hover:text-[#ff2200]"
          >
            {t("learnMore")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
