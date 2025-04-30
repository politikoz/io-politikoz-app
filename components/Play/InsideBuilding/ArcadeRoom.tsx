
// components/Play/InsideBuilding/InsideBuilding.tsx

"use client";

import React from "react";
import Image from "next/image";

const Hall: React.FC = () => {
  return (
    <div className="relative w-full h-auto">
        <Image
        src="/images/ArcadeRoom.svg"
        alt="ArcadeRoom"
        width={1600} // Ajuste conforme a proporção do seu SVG
        height={1480} // Ajuste conforme a proporção do seu SVG
        className="w-full h-auto object-contain block"
        priority // Opcional: Use se a imagem for crítica para a página
        />
    </div>
  );
};

export default Hall;