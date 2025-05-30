"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ReleasePrisonerModalContainer } from "./ReleasePrisonerModalContainer";

interface ReleasePrisonerButtonProps {
  prisonerName: string;
  onRelease: (releaseAll: boolean) => void;
  releaseCost: number;
  prisonEpochs: number;
  totalPrisoners: number;
  totalReleaseCost: number;
  assetNames: string[];
}

export default function ReleasePrisonerButton({
  prisonerName,
  onRelease,
  releaseCost,
  prisonEpochs,
  totalPrisoners,
  totalReleaseCost,
  assetNames
}: ReleasePrisonerButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("PolitikozProfile");

  const handleRelease = (releaseAll: boolean) => {
    onRelease(releaseAll);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="border-2 border-white px-3 py-1 text-[10px] bg-red-600 text-white shadow-[4px_4px_0px_black] hover:bg-red-700 transition font-['Press_Start_2P']"
      >
        {t("release")}
      </button>

      <ReleasePrisonerModalContainer
        isOpen={isModalOpen}
        prisonerName={prisonerName}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleRelease}
        releaseCost={releaseCost}
        prisonEpochs={prisonEpochs}
        totalPrisoners={totalPrisoners}
        totalReleaseCost={totalReleaseCost}
        assetNames={assetNames}
      />
    </>
  );
}
