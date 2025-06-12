import React from "react";
import { useTranslations } from "next-intl";
import Timer from "@/utils/Timer";

interface NextElectionCountdownProps {
  date?: string;
  totalPrize?: number;
}

const NextElectionCountdown: React.FC<NextElectionCountdownProps> = ({ 
  date = "2025-01-25T15:00:00Z",
  totalPrize = 0 
}) => {
  const t = useTranslations("NextElectionCountdown");

  return (
    <div className="flex flex-col items-center font-pixel text-yellow-400">
      <div className="flex justify-between gap-2 mb-8 w-full max-w-[600px]">
        {["days", "hours", "minutes", "seconds"].map((unit, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center bg-[#A0A0A0] border-4 border-[#707070] rounded shadow-pixel w-28 h-16 sm:w-24 sm:h-14 md:w-20 md:h-12"
          >
            <div className="absolute top-[-28px] sm:top-[-24px] md:top-[-20px] flex flex-col items-center">
              <div className="w-[2px] h-6 sm:h-5 md:h-4 bg-gray-500"></div>
              <div className="w-4 h-1 bg-gray-500 rounded-full"></div>
            </div>
            <Timer 
              unit={unit as "days" | "hours" | "minutes" | "seconds"} 
              targetDate={date}
            />
            <span className="text-xs sm:text-[10px] md:text-[8px] text-gray-800">
              {t(unit).toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* Imagens */}
      <div className="flex justify-between w-full max-w-[600px] mt-4">
        {/* Imagem da esquerda */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 464 672"
          width="150"
          height="200"
          preserveAspectRatio="xMidYMid meet"
          style={{ imageRendering: "pixelated" }}
        >
          <image
            x="0"
            y="0"
            width="464"
            height="672"
            xlinkHref="/images/prisionerFemale.svg"
          />
          <foreignObject x="55" y="350" width="360" height="200">
            <div
              style={{
                color: "#000000",
                fontSize: "44px",
                textAlign: "center",
                fontWeight: "bold",
                lineHeight: "1.2",
              }}
              dangerouslySetInnerHTML={{ __html: t.raw("electionSignText") }}
            ></div>
          </foreignObject>
        </svg>

        {/* Imagem da direita */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 464 672"
          width="150"
          height="200"
          preserveAspectRatio="xMidYMid meet"
          style={{ imageRendering: "pixelated" }}
        >
          <image
            x="0"
            y="0"
            width="464"
            height="672"
            xlinkHref="/images/prisionerMale.svg"
          />
          <foreignObject x="45" y="350" width="360" height="200">
            <div
              style={{
                color: "#000000",
                fontSize: "44px",
                textAlign: "center",
                fontWeight: "bold",
                lineHeight: "1.2",
              }}
              dangerouslySetInnerHTML={{
                __html: t("prizesSignText", { ADA: totalPrize }),
              }}
            ></div>
          </foreignObject>
        </svg>
      </div>
    </div>
  );
};

export default NextElectionCountdown;
