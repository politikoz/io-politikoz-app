"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ReleasePrisonerModalProps {
  isOpen: boolean;
  prisonerName: string;
  onClose: () => void;
  onConfirm: (releaseAll: boolean) => void;
  baseCostPerEpoch: number;
  imprisonmentEpochs: number;
  totalImprisoned: number;
}

export default function ReleasePrisonerModal({
  isOpen,
  prisonerName,
  onClose,
  onConfirm,
  baseCostPerEpoch,
  imprisonmentEpochs,
  totalImprisoned,
}: ReleasePrisonerModalProps) {
  const t = useTranslations("PolitikozProfile");
  const [releaseAll, setReleaseAll] = useState(false);

  const individualCost = baseCostPerEpoch * imprisonmentEpochs;
  const totalCost = individualCost * totalImprisoned;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-80" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="border-4 border-white bg-gray-900 p-6 shadow-[6px_6px_0px_black] w-80 text-center">
          <DialogTitle className="text-red-400 font-['Press_Start_2P'] text-sm mb-4">
            {t("releaseTitle")}
          </DialogTitle>

          <p className="text-white text-xs mb-4">
            {releaseAll ? (
              <>
                {t("releaseConfirmAllStart")}{" "}
                <span className="text-yellow-300">{totalImprisoned}</span>{" "}
                {t("releaseConfirmAllMiddle")}{" "}
                <span className="text-green-400">{totalCost} KOZ</span>?
              </>
            ) : (
              <>
                {t("releaseConfirmStart")}{" "}
                <span className="text-yellow-300">{prisonerName}</span>{" "}
                {t("releaseConfirmMiddle")}{" "}
                <span className="text-green-400">{individualCost} KOZ</span>?
              </>
            )}
          </p>

          <div className="flex items-center justify-center mb-4">
            <input
              id="release-all"
              type="checkbox"
              checked={releaseAll}
              onChange={() => setReleaseAll(!releaseAll)}
              className="w-4 h-4 border-2 border-white bg-gray-800 focus:ring-0 focus:outline-none cursor-pointer"
            />
            <label
              htmlFor="release-all"
              className="ml-2 text-xs text-white font-['Press_Start_2P'] cursor-pointer"
            >
              {t("releaseAllCheckbox")}
            </label>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="border-2 border-white px-4 py-1 bg-black text-white shadow-[4px_4px_0px_black] hover:bg-gray-800"
            >
              {t("keepImprisoned")}
            </button>
            <button
              onClick={() => onConfirm(releaseAll)}
              className="border-2 border-white px-4 py-1 bg-green-600 text-white shadow-[4px_4px_0px_black] hover:bg-green-700"
            >
              {t("confirmBribe")}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
