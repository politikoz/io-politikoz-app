"use client";

import { useState } from "react";
import TourStep from "./TourStep";
import PolitikozGuide from "./PolitikozGuide";
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
    <div className="fixed bottom-[16rem] sm:bottom-36 left-4 sm:left-10 flex items-end gap-3 sm:gap-4 p-3 sm:p-4 bg-black bg-opacity-50 z-50">
      <PolitikozGuide name="#02575" />
      <TourStep
        message={steps[stepIndex].message}
        onNext={() => setStepIndex((prev) => prev + 1)}
        onPrevious={() => setStepIndex((prev) => prev - 1)}
        isFirst={stepIndex === 0}
        isLast={stepIndex === steps.length - 1}
        onClose={onClose}
        redirectTo={steps[stepIndex].redirectTo}
      />
    </div>
  );
}
