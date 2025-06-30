"use client";

import { useRouter } from "@/i18n/routing";
import type { AppPath } from "@/i18n/routing";
import { useTour } from "@/contexts/TourContext";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

export interface TourStepData {
  message: string | ((t: (key: string) => string) => ReactNode);
  redirectTo?: AppPath;
  keepTourActive?: boolean;
}

interface TourStepProps {
  message: string | ((t: (key: string) => string) => ReactNode);
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  onClose: () => void;
  redirectTo?: AppPath;
  stepIndex: number;
  totalSteps: number;
  keepTourActive?: boolean;
}

export default function TourStep({
  message,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  onClose,
  redirectTo,
  stepIndex,
  totalSteps,
  keepTourActive,
}: TourStepProps) {
  const router = useRouter();
  const { deactivateTour } = useTour();
  const t = useTranslations();

  const handleFinish = () => {
    if (redirectTo) {
      router.push(redirectTo);
      onClose();
      return;
    }
    if (!keepTourActive) {
      deactivateTour();
      onClose();
    }
  };

  const handleSkip = () => {
    deactivateTour();
    onClose();
  };

  return (
    <div className="relative bg-gray-900 text-white border-4 border-yellow-400 p-4 sm:p-8 w-[90vw] sm:w-[520px] min-h-[220px] sm:min-h-[260px] max-h-[420px] sm:max-h-[520px] shadow-[4px_4px_0px_black] font-['Press_Start_2P'] text-[12px] sm:text-[15px] flex flex-col justify-between leading-snug overflow-hidden">
      {/* Top: Progress + Skip */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-yellow-300 text-xs sm:text-sm font-bold">
          {stepIndex + 1}/{totalSteps}
        </span>
        <button
          onClick={handleSkip}
          className="text-white text-[12px] bg-red-600 px-3 py-1 border border-white shadow-[2px_2px_0px_black] hover:bg-red-700 transition"
        >
          Skip
        </button>
      </div>
      {/* Conteúdo */}
      <div className="flex-1 pr-1 flex items-center">
        {typeof message === "function"
          ? message(t)
          : typeof message === "string"
          ? t(message)
          : message}
      </div>
      {/* Rodapé */}
      <div className="flex justify-between mt-3">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={`border-2 border-white px-3 py-1 ${
            isFirst
              ? "bg-gray-700 opacity-50 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          ← Back
        </button>
        {isLast ? (
          <button
            onClick={handleFinish}
            className="border-2 border-white px-3 py-1 bg-blue-600 hover:bg-blue-700"
          >
            {redirectTo ? "Continue →" : "Finish"}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="border-2 border-white px-3 py-1 bg-green-600 hover:bg-green-700"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
