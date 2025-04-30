import { useState } from "react";
import Image from "next/image";
import { BackwardIcon, ForwardIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

interface Politikoz {
  name: string;
  luckyNumber: number;
  type: string;
  isImprisoned?: boolean;
}

interface PolitikozGridProps {
  politikozList: Politikoz[];
  selectedTab: string;
  onSelectPolitikoz: (index: number) => void;
}

export default function PolitikozGrid({ politikozList, selectedTab, onSelectPolitikoz }: PolitikozGridProps) {
  const t = useTranslations("PolitikozProfile");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 18;

  const filteredPolitikoz = politikozList.filter((p) => p.type === selectedTab);
  const paginatedPolitikoz = filteredPolitikoz.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handleNextPage = () => {
    if ((currentPage + 1) * pageSize < filteredPolitikoz.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full min-h-[400px]">
      <div className="flex flex-col w-full">
        {filteredPolitikoz.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 min-h-[300px]">
              {paginatedPolitikoz.map((p, index) => (
                <div
                  key={index}
                  className="border-2 border-white p-2 bg-gray-800 shadow-md flex flex-col items-center cursor-pointer hover:bg-gray-700 transition h-fit"
                  onClick={() => onSelectPolitikoz(index + currentPage * pageSize)}
                >
                  <div className="relative w-[100px] h-[100px]">
                    <Image
                      src={`/images/assets/${p.name.replace("#", "")}.png`}
                      alt={p.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                    {p.isImprisoned && (
                      <div className="absolute inset-0 flex justify-between">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-[4px] h-full bg-black"></div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex items-center text-[10px] font-['Press_Start_2P']">
                    <span className="text-white">{p.name}</span>
                    <span className="text-green-400">{p.luckyNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-grow items-center justify-center min-h-[300px]">
            <p className="text-center text-gray-400">{t("noPolitikoz")}</p>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center border-t-4 border-white pt-2 space-x-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`border-2 border-white px-4 py-2 bg-black text-yellow-300 shadow-[4px_4px_0px_black] w-[40%] max-w-[160px] flex items-center justify-center 
            ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <BackwardIcon className="w-5 h-5 mr-2" />
          {t("previous")}
        </button>

        <button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * pageSize >= filteredPolitikoz.length}
          className={`border-2 border-white px-4 py-2 bg-black text-yellow-300 shadow-[4px_4px_0px_black] w-[40%] max-w-[160px] flex items-center justify-center
            ${(currentPage + 1) * pageSize >= filteredPolitikoz.length ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <ForwardIcon className="w-5 h-5 mr-2" />
          {t("next")}
        </button>
      </div>
    </div>
  );
}
