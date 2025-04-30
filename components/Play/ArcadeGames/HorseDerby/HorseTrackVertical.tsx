"use client";

import React, { useRef, useEffect, useState } from "react";

const horseColors = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500",
  "bg-pink-500", "bg-orange-500", "bg-teal-500", "bg-lime-500", "bg-indigo-500"
];

const TRACK_HEIGHT = 2000;
const CAMERA_OFFSET = -200;

export default function HorseTrackVertical({
  horsePositions,
  selectedHorse,
  finishLine,
  horseSpeeds,
  winner,
}: {
  horsePositions: Record<number, number>;
  horseSpeeds: Record<number, number>;
  selectedHorse: number | null;
  finishLine: number;
  winner: number | null;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef(0);
  const [leaderTop, setLeaderTop] = useState(0);

  const getCircleHeight = () =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 24 : 40;

  useEffect(() => {
    if (!trackRef.current) return;

    const container = trackRef.current;
    let animationFrame: number;

    const updateScrollTarget = () => {
      const leader = Object.entries(horsePositions).reduce((prev, curr) =>
        curr[1] > prev[1] ? curr : prev
      );
      const leaderPos = leader[1];
      const circleHeight = getCircleHeight();
      const leaderTopPos = TRACK_HEIGHT - leaderPos - circleHeight;

      const maxScroll = TRACK_HEIGHT - container.clientHeight;
      scrollTargetRef.current = Math.max(
        0,
        Math.min(maxScroll, leaderTopPos + CAMERA_OFFSET)
      );

      setLeaderTop(leaderTopPos);
    };

    const animateScroll = () => {
      if (!container) return;
      const current = container.scrollTop;
      const target = scrollTargetRef.current;
      const newScroll = current + (target - current) * 0.07;

      container.scrollTop = newScroll;
      animationFrame = requestAnimationFrame(animateScroll);
    };

    updateScrollTarget();
    animateScroll();

    const interval = setInterval(updateScrollTarget, 200);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrame);
    };
  }, [horsePositions]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.scrollTo({
        top: TRACK_HEIGHT,
        behavior: "auto",
      });
    }
  }, []);

  return (
    <div
      ref={trackRef}
      className="relative h-[600px] w-full overflow-y-auto border-4 border-yellow-500 bg-green-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* Mensagem de resultado acima da linha de chegada */}
      {winner !== null && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 text-white text-lg md:text-xl font-bold bg-black/70 px-4 py-2 rounded border-2 border-yellow-400">
          {winner === selectedHorse ? "🎉 You Won!" : `🏇 Horse ${winner} Won!`}
        </div>
      )}

      {/* Linha de chegada */}
      <div
        className="absolute w-full h-2 bg-red-600 text-white text-center font-bold"
        style={{ top: 0 }}
      >
        🏁 Finish Line
      </div>

      {/* Linha de partida */}
      <div
        className="absolute w-full h-2 bg-white text-black text-center font-bold"
        style={{ top: `${TRACK_HEIGHT - 2}px` }}
      >
        🚦 Start Line
      </div>

      {/* Linha do líder */}
      <div
        className="absolute w-full border-t-4 border-dashed border-yellow-300 z-10"
        style={{ top: `${leaderTop}px` }}
      />

      {/* Listras visuais */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-[2px] bg-white opacity-10"
          style={{ top: `${i * 50}px` }}
        />
      ))}

      {/* Pistas */}
      <div className="flex">
        {Object.entries(horsePositions).map(([horse, pos]) => {
          const horseNumber = Number(horse);
          const isWinner = winner === horseNumber;

          return (
            <div
              key={horse}
              className="relative"
              style={{
                width: "10%",
                height: `${TRACK_HEIGHT}px`,
                borderLeft: "2px solid gray",
              }}
            >
              <div
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ bottom: `${pos}px` }}
              >
                <div
                  className={`w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center text-black font-bold border-2 border-white transition-transform duration-300 text-xs md:text-base ${
                    horseColors[horseNumber]
                  } ${isWinner ? "animate-pulse scale-110 ring-2 md:scale-125 md:ring-4 ring-yellow-400" : ""}`}
                >
                  {horse}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
