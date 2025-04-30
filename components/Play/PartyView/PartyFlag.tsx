"use client";

import { useState } from "react";
import { colorsPalette } from "./colorsPaleta";
import { useTranslations } from "next-intl";

export default function PartyFlag({ onRegenerate }: { onRegenerate: () => void }) {
  const t = useTranslations("PartyView.flag");
  // 🔹 Gera uma cor aleatória para a bandeira
  const getRandomColor = () => {
    return colorsPalette[Math.floor(Math.random() * colorsPalette.length)];
  };

  const [flagColor, setFlagColor] = useState(getRandomColor());

  // 🔹 Gera tons mais escuros para as sombras da bandeira
  const getDarkerColor = (color: string, factor: number) => {
    const r = Math.max(0, Math.floor(parseInt(color.slice(1, 3), 16) * factor));
    const g = Math.max(0, Math.floor(parseInt(color.slice(3, 5), 16) * factor));
    const b = Math.max(0, Math.floor(parseInt(color.slice(5, 7), 16) * factor));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const flagShadowColor = getDarkerColor(flagColor, 0.8); // Segunda parte (leve sombra)
  const flagDeepShadowColor = getDarkerColor(flagColor, 0.6); // Terceira parte (sombra mais forte)

  // 🔹 Regenera a bandeira com uma nova cor
  const regenerateFlag = () => {
    setFlagColor(getRandomColor());
    onRegenerate();
  };

  return (
    <div className="flex flex-col items-center">
      {/* 🔹 Bandeira Pixel Art */}
      <div className="relative flex items-start bg-white p-2">
        {/* 🔹 Mastro ajustado */}
        <div className="flex flex-col">
          <div className="w-[6px] h-[6px] bg-[#0B0A0A]"></div> {/* 1 pixel preto */}
          <div className="w-[6px] h-[6px]" style={{ backgroundColor: flagColor }}></div> {/* 1 pixel da bandeira */}
          <div className="w-[6px] h-[30px] bg-[#0B0A0A]"></div> {/* 5 pixels pretos */}
          <div className="w-[6px] h-[6px]" style={{ backgroundColor: flagColor }}></div> {/* 1 pixel da bandeira */}
          <div className="w-[6px] h-[48px] bg-[#0B0A0A]"></div> {/* 8 pixels pretos */}
        </div>

        {/* 🔹 Bandeira principal */}
        <div className="flex flex-col z-10">
          {/* 🔹 Primeira linha com 8 pixels */}
          <div className="flex">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-[6px] h-[6px]" style={{ backgroundColor: flagColor }}></div>
            ))}
          </div>
          {/* 🔹 Linhas seguintes com 9 pixels */}
          {[...Array(8)].map((_, row) => (
            <div key={row} className="flex">
              {[...Array(9)].map((_, col) => (
                <div key={col} className="w-[6px] h-[6px]" style={{ backgroundColor: flagColor }}></div>
              ))}
            </div>
          ))}
        </div>

        {/* 🔹 Segunda parte da bandeira (com leve sombra) */}
        <div className="flex flex-col mt-[18px]">
          {[...Array(6)].map((_, row) => (
            <div key={row} className="flex">
              {[...Array(3)].map((_, col) => (
                <div key={col} className="w-[6px] h-[6px]" style={{ backgroundColor: flagShadowColor }}></div>
              ))}
            </div>
          ))}
          {/* 🔹 Penúltima linha com 4 pixels */}
          <div className="flex">
            {[...Array(3)].map((_, col) => (
              <div key={col} className="w-[6px] h-[6px]" style={{ backgroundColor: flagShadowColor }}></div>
            ))}
          </div>
          {/* 🔹 Última linha com 3 pixels */}
          <div className="flex ml-[6px]">
            {[...Array(2)].map((_, col) => (
              <div key={col} className="w-[6px] h-[6px]" style={{ backgroundColor: flagShadowColor }}></div>
            ))}
          </div>
        </div>

        {/* 🔹 Terceira parte da bandeira (com sombra mais forte) */}
        <div className="flex flex-col mt-[42px]">
          {/* 🔹 Primeira linha com 2 pixels */}
          <div className="flex">
            {[...Array(2)].map((_, col) => (
              <div key={col} className="w-[6px] h-[6px]" style={{ backgroundColor: flagDeepShadowColor }}></div>
            ))}
          </div>
          {/* 🔹 Segunda e terceira linha com +2 pixels à direita */}
          {[...Array(2)].map((_, row) => (
            <div key={row} className="flex">
              {[...Array(4)].map((_, col) => (
                <div key={col} className="w-[6px] h-[6px]" style={{ backgroundColor: flagDeepShadowColor }}></div>
              ))}
            </div>
          ))}
          {/* 🔹 Quarta linha com +1 pixel à direita */}
          <div className="flex">
            {[...Array(3)].map((_, col) => (
              <div key={col} className="w-[6px] h-[6px]" style={{ backgroundColor: flagDeepShadowColor }}></div>
            ))}
          </div>
        </div>        
      </div>

      {/* 🔹 Botão para regenerar a bandeira */}
      <button
        onClick={regenerateFlag}
        className="mt-2 border-2 border-white px-3 py-1 bg-blue-600 text-white shadow-[4px_4px_0px_black] hover:bg-blue-700 transition font-['Press_Start_2P']"
      >
        {t("tryAgain")}
      </button>
    </div>
  );
}
