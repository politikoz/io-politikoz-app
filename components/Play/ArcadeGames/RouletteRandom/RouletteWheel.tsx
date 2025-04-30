"use client";

import { useEffect, useState } from "react";

export default function RouletteWheel({
  resultNumber,
  spinning,
  duration,
}: {
  resultNumber: number | null;
  spinning: boolean;
  duration: number; // em segundos
}) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (spinning) {
      const segmentAngle = 360 / 10;
      const randomSpins = 6;
      const target = resultNumber ?? Math.floor(Math.random() * 10);
      const finalAngle = 360 * randomSpins - segmentAngle * target;

      setRotation(finalAngle);
    }
  }, [spinning, resultNumber]);

  return (
    <div className="relative w-64 h-64 mx-auto mt-4">
      {/* Ponteiro */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-yellow-400 z-20" />

      {/* Roleta */}
      <div
        className="relative w-full h-full rounded-full border-4 border-yellow-400 bg-gray-800 transition-transform ease-out"
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionDuration: `${duration}s`,
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (360 / 10) * i;
          return (
            <div
              key={i}
              className="absolute w-full h-full flex items-center justify-center"
              style={{
                transform: `rotate(${angle}deg)`,
              }}
            >
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gray-700 text-white font-bold flex items-center justify-center border border-white">
                {i}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
