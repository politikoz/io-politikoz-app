"use client";

import { useEffect, useState } from "react";

const Background: React.FC = () => {
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    // Gerar alturas de forma determinística no cliente
    const generatedHeights = Array.from({ length: 20 }, () => Math.random() * 40 + 80);
    setHeights(generatedHeights);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full max-h-[800px] -z-10 flex flex-col">
      {/* Céu */}
      <div className="bg-[#43A4E7] flex-grow"></div>
      {/* Transição */}
      <div className="bg-[#4EA9E8] h-[10%]"></div>
      {/* Sombra */}
      <div className="bg-[#3E85BB] flex-grow relative flex items-end">
        {heights.map((height, i) => (
          <div
            key={i}
            className="bg-[#2C6791] flex-shrink-0 w-[5%]"
            style={{ height: `${height}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Background;
