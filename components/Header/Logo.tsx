import React from "react";
import Link from "next/link";

const LogoComponent: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Link
      href="/"
      className={`relative flex flex-col items-center font-['Press_Start_2P'] text-[16px] leading-none ${className}`}
      aria-label="Logo Politikoz.io"
    >
      {/* Texto POLITIKOZ com gradiente vertical */}
      <span className="bg-gradient-to-b from-white to-yellow-400 text-transparent bg-clip-text tracking-wider">
        POLITIKOZ
      </span>

      {/* Versão v1.4 - Menor e posicionado abaixo do "Z" */}
      <span className="text-[10px] text-white opacity-80 tracking-tight mt-[-2px]">
        v1.4
      </span>
    </Link>
  );
};

// Otimização com React.memo
export const Logo = React.memo(LogoComponent);
