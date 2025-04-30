import { useTranslations } from "next-intl";
import React from "react";
import Image from "next/image"; // Importação do componente Image

const partners = [
  {
    name: "Cardano",
    logo: "/images/cardano.png",
    url: "https://cardano.org/",
  },
  {
    name: "Blockfrost",
    logo: "/images/blockfrost.png",
    url: "https://blockfrost.io/",
  },
  {
    name: "Koios",
    logo: "/images/koios.png",
    url: "https://www.koios.rest/",
  },
  {
    name: "Mesh",
    logo: "/images/mesh.png",
    url: "https://meshjs.dev/",
  },
];

const PoweredBy: React.FC = () => {
  const t = useTranslations("Common");
  const poweredBy = t("poweredBy");

  return (
    <div
      className="w-full bg-[#1c1c1c] text-white py-6 px-4 relative"
      style={{ boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.2)" }}
    >
      {/* Título */}
      <h2 className="text-center text-lg font-bold mb-4 font-pixel">{poweredBy}</h2>

      {/* Logotipos dos Parceiros */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center items-center">
        {partners.map((partner, index) => (
          <a
            key={index}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transform transition-transform hover:scale-105"
            aria-label={partner.name}
          >
            <Image
              src={partner.logo}
              alt={`${partner.name} logo`}
              width={112} // Largura fixa
              height={112} // Altura fixa
              className="object-contain" // Garante que a imagem seja redimensionada corretamente
              style={{ width: "auto", height: "auto" }} // Mantém a proporção
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default PoweredBy;
