"use client";

import { useState } from "react";
import TourStep from "./TourStep";
import { tourSteps } from "./TourData";

interface TourManagerProps {
  section: keyof typeof tourSteps;
  onClose: () => void;
}

export default function TourManager({ section, onClose }: TourManagerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = tourSteps[section];

  if (!steps) return null;

  return (
    <div
      className="fixed bottom-[6rem] sm:bottom-12 left-4 sm:left-10 flex items-end gap-4 sm:gap-6 p-10 bg-black bg-opacity-50 z-50 max-w-[1270px] sm:max-w-[1560px] rounded-3xl overflow-hidden"
      style={{
        minHeight: "286px",
        boxShadow: "0 12px 48px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex-1 min-w-0">
        <TourStep
          message={steps[stepIndex].message}
          onNext={() => setStepIndex((prev) => prev + 1)}
          onPrevious={() => setStepIndex((prev) => prev - 1)}
          isFirst={stepIndex === 0}
          isLast={stepIndex === steps.length - 1}
          onClose={onClose}
          redirectTo={steps[stepIndex].redirectTo}
          stepIndex={stepIndex}           // NOVO
          totalSteps={steps.length}       // NOVO
        />
      </div>
    </div>
  );
}
