"use client";

import { useRouter } from "@/i18n/routing";
import type { AppPath } from "@/i18n/routing";
import { useTour } from "@/contexts/TourContext";

interface TourStepProps {
  message: string;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  onClose: () => void;
  redirectTo?: AppPath;
}

export default function TourStep({
  message,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  onClose,
  redirectTo,
}: TourStepProps) {
  const router = useRouter();
  const { deactivateTour } = useTour();

  const handleFinish = () => {
    if (redirectTo) {
      router.push(redirectTo); // Tour continuará na próxima página
    } else {
      deactivateTour(); // Finaliza tour global
      onClose(); // Fecha tour local
    }
  };

  const handleSkip = () => {
    deactivateTour(); // Aborta tour global
    onClose(); // Fecha tour local
  };

  return (
    <div className="relative bg-gray-900 text-white border-4 border-yellow-400 p-3 sm:p-4 w-[260px] sm:w-[300px] min-h-[180px] max-h-[200px] shadow-[4px_4px_0px_black] font-['Press_Start_2P'] text-[10px] sm:text-[12px] flex flex-col justify-between leading-snug overflow-hidden">
      
      {/* 🔹 Topo: Skip à direita */}
      <div className="flex justify-end mb-2">
        <button
          onClick={handleSkip}
          className="text-white text-[10px] bg-red-600 px-2 py-1 border border-white shadow-[2px_2px_0px_black] hover:bg-red-700 transition"
        >
          Skip
        </button>
      </div>

      {/* 🔹 Conteúdo com scroll se necessário */}
      <div className="flex-1 overflow-y-auto pr-1">
        <p>{message}</p>
      </div>

      {/* 🔹 Rodapé: Back e Next/Finish sempre visíveis */}
      <div className="flex justify-between mt-3">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={`border-2 border-white px-2 py-1 ${
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
            className="border-2 border-white px-2 py-1 bg-blue-600 hover:bg-blue-700"
          >
            {redirectTo ? "Continue →" : "Finish"}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="border-2 border-white px-2 py-1 bg-green-600 hover:bg-green-700"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
