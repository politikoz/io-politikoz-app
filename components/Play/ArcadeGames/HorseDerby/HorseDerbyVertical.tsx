"use client";

import { useEffect, useState } from "react";
import HorseTrackVertical from "./HorseTrackVertical";
import RaceHistoryCards from "./RaceHistoryCards";
import RaceHeader from "./RaceHeader";

const horses = Array.from({ length: 10 }, (_, i) => i);
const BASE_SPEED = 70;
const SPEED_INCREMENT = 5;
const TRACK_HEIGHT = 2000;
const FINISH_LINE = TRACK_HEIGHT - 20;

export default function HorseDerbyVertical() {
  const [selectedHorse, setSelectedHorse] = useState<number | null>(null);
  const [raceStarted, setRaceStarted] = useState(false);
  const [horsePositions, setHorsePositions] = useState<Record<number, number>>(
    () => horses.reduce((acc, h) => ({ ...acc, [h]: 0 }), {})
  );
  const [horseSpeeds, setHorseSpeeds] = useState<Record<number, number>>(
    () => horses.reduce((acc, h) => ({ ...acc, [h]: BASE_SPEED }), {})
  );
  const [winner, setWinner] = useState<number | null>(null);
  const [raceHistory, setRaceHistory] = useState<
    { block: number; horses: number[]; time: string }[]
  >([]);

  useEffect(() => {
    if (!raceStarted) return;

    const interval = setInterval(() => {
      const boosted = new Set<number>();
      while (boosted.size < 4) {
        boosted.add(Math.floor(Math.random() * 10));
      }

      const boostedArray = Array.from(boosted);
      setHorseSpeeds((prev) => {
        const updated = { ...prev };
        boostedArray.forEach((h) => {
          updated[h] += SPEED_INCREMENT;
        });
        return updated;
      });

      setRaceHistory((prev) => [
        {
          block: (prev[0]?.block || 1000) + 1,
          horses: boostedArray,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, [raceStarted]);

  useEffect(() => {
    if (!raceStarted) return;

    const interval = setInterval(() => {
      setHorsePositions((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          const i = parseInt(key);
          updated[i] += horseSpeeds[i] / 10;
        });

        const reached = Object.entries(updated).find(([_, pos]) => pos >= FINISH_LINE);
        if (reached) {
          setWinner(Number(reached[0]));
          setRaceStarted(false);
          clearInterval(interval);
        }

        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [raceStarted, horseSpeeds]);

  const startRace = () => {
    setHorsePositions(horses.reduce((acc, h) => ({ ...acc, [h]: 0 }), {}));
    setHorseSpeeds(horses.reduce((acc, h) => ({ ...acc, [h]: BASE_SPEED }), {}));
    setWinner(null);
    setRaceHistory([]);
    setRaceStarted(true);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[1000px] mx-auto bg-gray-900 text-white border-4 border-yellow-500 p-4 shadow-lg relative h-screen md:h-auto">
      <RaceHeader />

      <h2 className="text-lg font-bold text-yellow-300 text-center mb-2">
        Horse Derby (Vertical View)
      </h2>

      {/* Conteúdo adaptado para caber tudo no mobile */}
      <div className="flex flex-col w-full h-full md:h-auto">
        {/* Pista com altura limitada apenas em mobile */}
        <div className="flex-shrink-0 min-h-0 max-h-[calc(100vh-400px)] md:max-h-none overflow-hidden">
          <HorseTrackVertical
            horsePositions={horsePositions}
            horseSpeeds={horseSpeeds}
            selectedHorse={selectedHorse}
            finishLine={FINISH_LINE}
            winner={winner}
          />
        </div>

        {/* Speed */}
        <div className="w-full px-1 mt-2">
          <div className="text-center text-yellow-300 text-xs md:text-sm font-semibold">
            Speed
          </div>
          <div className="grid grid-cols-10 gap-[2px] text-center text-white text-sm font-mono mt-1">
            {horses.map((horse) => (
              <div key={horse}>{horseSpeeds[horse]}</div>
            ))}
          </div>

          {/* Heat bar visual da velocidade */}
          <div className="grid grid-cols-10 gap-[2px] w-full h-2 mt-2 px-1">
            {horses.map((horse) => {
              const speed = horseSpeeds[horse];
              let color = "bg-green-500";

              if (speed >= 100) color = "bg-red-700";
              else if (speed >= 95) color = "bg-red-500";
              else if (speed >= 90) color = "bg-orange-500";
              else if (speed >= 85) color = "bg-amber-400";
              else if (speed >= 80) color = "bg-yellow-400";
              else if (speed >= 75) color = "bg-lime-500";

              return <div key={horse} className={`w-full h-full ${color} rounded-sm`} />;
            })}
          </div>

        </div>

        {/* Botões */}
        <div className="grid grid-cols-10 gap-[2px] mt-2 w-full px-1">
          {horses.map((horse) => (
            <button
              key={horse}
              className={`w-full h-10 md:h-12 text-xs md:text-base font-bold border-2 rounded ${
                selectedHorse === horse
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-700 text-white"
              }`}
              onClick={() => setSelectedHorse(horse)}
              disabled={raceStarted}
            >
              {horse}
            </button>
          ))}
        </div>

        {/* Botão Start */}
        <div className="mt-3 flex justify-center">
          <button
            onClick={startRace}
            className={`px-6 py-2 font-bold bg-green-500 text-black rounded shadow-md transition ${
              raceStarted || selectedHorse === null
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-600"
            }`}
            disabled={raceStarted || selectedHorse === null}
          >
            Start Race
          </button>
        </div>
      </div>

      {/* Histórico separado */}
      <div className="overflow-y-auto max-h-[35vh] w-full mt-4">
        <RaceHistoryCards history={raceHistory} selectedHorse={selectedHorse} />
      </div>
    </div>
  );
}
