"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ReleasePrisonerModal from "./ReleasePrisonerModal";

interface ReleasePrisonerButtonProps {
  prisonerName: string;
  onRelease: (releaseAll: boolean) => void;
  baseCostPerEpoch: number;
  imprisonmentEpochs: number;
  totalImprisoned: number;
}

export default function ReleasePrisonerButton({
  prisonerName,
  onRelease,
  baseCostPerEpoch,
  imprisonmentEpochs,
  totalImprisoned
}: ReleasePrisonerButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("PolitikozProfile");

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="border-2 border-white px-3 py-1 text-[10px] bg-red-600 text-white shadow-[4px_4px_0px_black] hover:bg-red-700 transition font-['Press_Start_2P']"
      >
        {t("release")}
      </button>

      <ReleasePrisonerModal
        isOpen={isModalOpen}
        prisonerName={prisonerName}
        baseCostPerEpoch={baseCostPerEpoch}
        imprisonmentEpochs={imprisonmentEpochs}
        totalImprisoned={totalImprisoned}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(releaseAll: boolean) => {
          onRelease(releaseAll);
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
