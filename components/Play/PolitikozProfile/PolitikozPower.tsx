import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface PolitikozPowerProps {
  dirtyMoney: number;
  influence: number;
  cleanMoney: number;
  bribePower: number;
  scapegoats: number;
}

export default function PolitikozPower({
  dirtyMoney,
  influence,
  cleanMoney,
  bribePower,
  scapegoats,
}: PolitikozPowerProps) {
  const t = useTranslations("PolitikozProfile");

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="absolute -top-3 left-0">
        <div className="border-2 border-white bg-gray-800 shadow-[2px_2px_0px_black] px-3 py-0.5 ">
          <span className="text-white text-[8px] md:text-[10px] font-['Press_Start_2P'] tracking-widest">
            {t("power")}
          </span>
        </div>
      </div>

      <div className="border-4 border-white bg-gray-800 shadow-[4px_4px_0px_black] p-4 flex flex-col items-center w-full md:p-5">
        <div className="flex justify-between w-full mt-2 md:gap-2 gap-0">
          {[
            { image: "/images/icons8-corrupt-64.png", label: t("dirtyMoney"), value: dirtyMoney },
            { image: "/images/icons8-lobbyist-64.png", label: t("influence"), value: influence },
            { image: "/images/icons8-launderer-64.png", label: t("cleanMoney"), value: cleanMoney },
            { image: "/images/icons8-briber-64.png", label: t("bribePower"), value: bribePower },
            { image: "/images/icons8-frontMen-50.png", label: t("scapegoats"), value: scapegoats },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center w-[20%]">
              <div
                className="border-4 border-white bg-gray-300 w-[45px] h-[60px] md:w-[55px] md:h-[75px] 
                            shadow-[4px_4px_0px_black] flex flex-col items-center justify-center"
              >
                <Image
                  src={stat.image}
                  alt={stat.label}
                  width={35}
                  height={35}
                  unoptimized={true}
                  className="object-cover w-[35px] h-[35px] md:w-[45px] md:h-[45px]"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="mt-1 text-black text-[10px] md:text-[12px] font-['Press_Start_2P']">
                  {stat.value}
                </span>
              </div>
              <span className="text-[6px] md:text-[8px] mt-1 text-center leading-[8px] h-[16px] md:h-[18px] flex items-center justify-center font-['Press_Start_2P']">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
