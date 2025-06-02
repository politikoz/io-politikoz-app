"use client";

import { useState } from "react";

interface PartyFlagProps {
  availableColors: string[];
  onRegenerate: () => void;
  selectedColor?: string;
  onColorSelect: (color: string) => void;
  readOnly?: boolean;
}

export default function PartyFlag({ availableColors, onRegenerate, selectedColor, onColorSelect, readOnly }: PartyFlagProps) {
  const [flagColor, setFlagColor] = useState(selectedColor || availableColors[0]);

  const getDarkerColor = (color: string, factor: number) => {
    const r = Math.max(0, Math.floor(parseInt(color.slice(1, 3), 16) * factor));
    const g = Math.max(0, Math.floor(parseInt(color.slice(3, 5), 16) * factor));
    const b = Math.max(0, Math.floor(parseInt(color.slice(5, 7), 16) * factor));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const flagShadowColor = getDarkerColor(flagColor, 0.8);
  const flagDeepShadowColor = getDarkerColor(flagColor, 0.6);

  const handleColorSelect = (color: string) => {
    setFlagColor(color);
    onColorSelect(color);
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

      {/* Somente exibe as opções de cor se não for somente leitura */}
      {!readOnly && availableColors.length > 0 && (
        <div className="mt-4 flex gap-2 p-2 bg-gray-800 rounded-md border-2 border-white shadow-[4px_4px_0px_black]">
          {availableColors.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-sm transition-transform hover:scale-110 ${
                selectedColor === color ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-800' : ''
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
