import { useTranslations } from "next-intl";
import React from "react";
import Image from "next/image";

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
    <div className="w-full bg-[#1c1c1c] text-white py-6 px-4 relative">
      {/* Título */}
      <h2 className="text-left text-[12px] mb-4">{poweredBy}</h2>

      {/* Logotipos dos Parceiros - com tamanho reduzido */}
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
              width={80}
              height={80}
              className="object-contain max-h-16 w-auto"
              style={{ maxWidth: "80px", height: "auto" }}
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default PoweredBy;
