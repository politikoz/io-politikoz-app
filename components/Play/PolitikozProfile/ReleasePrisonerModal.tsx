"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useWalletContext } from "@/contexts/WalletContext";

interface ReleasePrisonerModalProps {
  isOpen: boolean;
  prisonerName: string;
  onClose: () => void;
  onConfirm: (releaseAll: boolean) => void;
  releaseCost: number;
  prisonEpochs: number;
  totalPrisoners: number;
  totalReleaseCost: number;
  assetNames: string[]; // Add this prop to receive all prisoner asset names
}

export default function ReleasePrisonerModal({
  isOpen,
  prisonerName,
  onClose,
  onConfirm,
  releaseCost,
  prisonEpochs,
  totalPrisoners,
  totalReleaseCost,
  assetNames,
}: ReleasePrisonerModalProps) {
  const t = useTranslations("PolitikozProfile");
  const [releaseAll, setReleaseAll] = useState(false);
  const { handleReleasePrisoner } = useWalletContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset error when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    setError(null);
    setIsProcessing(false);
    onClose();
  };

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const result = await handleReleasePrisoner(
        releaseAll ? totalReleaseCost : releaseCost,
        releaseAll ? assetNames : [prisonerName]
      );

      if (result.success) {
        onConfirm(releaseAll);
        handleClose();
      } else {
        // Map error codes to translations
        switch (result.error) {
          case "insufficientFunds":
            setError(t("insufficientFunds"));
            break;
          case "transactionDeclined":
            setError(t("transactionDeclined"));
            break;
          case "walletNotConnected":
            setError(t("walletNotConnected"));
            break;
          default:
            setError(t("transactionFailed"));
        }
      }
    } catch (error) {
      setError(t("transactionFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-80" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="border-4 border-white bg-gray-900 p-6 shadow-[6px_6px_0px_black] w-80 text-center">
          <DialogTitle className="text-red-400 font-['Press_Start_2P'] text-sm mb-4">
            {t("releaseTitle")}
          </DialogTitle>

          {error && (
            <div className="mt-2 p-2 bg-red-600 text-white text-xs rounded mb-4">
              {error}
            </div>
          )}

          <p className="text-white text-xs mb-4">
            {releaseAll ? (
              <>
                {t("releaseConfirmAllStart")} {totalPrisoners}{" "}
                {t("prisonersFromTab")} {t("releaseConfirmMiddle")}{" "}
                <span className="text-green-400">{totalReleaseCost} KOZ</span>?
              </>
            ) : (
              <>
                {t("releaseConfirmStart")}{" "}
                <span className="text-yellow-300">{prisonerName}</span>{" "}
                {t("releaseConfirmMiddle")}{" "}
                <span className="text-green-400">{releaseCost} KOZ</span>?
              </>
            )}
          </p>

          {totalPrisoners > 1 && (
            <div className="flex items-center justify-center mt-3 mb-4">
              <input
                type="checkbox"
                checked={releaseAll}
                onChange={() => setReleaseAll(!releaseAll)}
                className="w-4 h-4 border-2 border-white bg-gray-800 focus:ring-0 focus:outline-none cursor-pointer"
              />
              <label className="ml-2 text-xs text-white font-['Press_Start_2P'] cursor-pointer">
                {t("releaseAllInTab")}
              </label>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="border-2 border-white px-4 py-1 bg-black text-white shadow-[4px_4px_0px_black] hover:bg-gray-800 disabled:opacity-50"
            >
              {t("keepImprisoned")}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="border-2 border-white px-4 py-1 bg-green-600 text-white shadow-[4px_4px_0px_black] hover:bg-green-700 disabled:opacity-50"
            >
              {isProcessing ? t("processing") : t("confirmBribe")}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
