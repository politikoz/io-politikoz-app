import React from "react";
import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage, totalPages }) => {
  const t = useTranslations("TicketProfile");

  return (
    <div className="w-full flex justify-center border-t-4 border-white mt-4 pt-2 space-x-6">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        className="border-2 border-white px-3 py-2 bg-black text-yellow-300 shadow-[4px_4px_0px_black] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("previous")}
      </button>
      <button
        disabled={totalPages <= 1 || currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className="border-2 border-white px-3 py-2 bg-black text-yellow-300 shadow-[4px_4px_0px_black] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("next")}
      </button>
    </div>
  );
};

export default Pagination;
