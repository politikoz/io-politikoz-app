"use client";

import React, { useEffect, useState, useCallback } from "react";

interface TimerProps {
  unit: "days" | "hours" | "minutes" | "seconds";
  targetDate: string;
}

const Timer: React.FC<TimerProps> = ({ unit, targetDate }) => {
  const calculateTimeLeft = useCallback(() => {
    const nextElectionDate = new Date(targetDate);
    const difference = +nextElectionDate - +new Date();
    return difference > 0
      ? {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      : { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!timeLeft) {
    return (
      <span className="text-xl sm:text-lg md:text-base text-gray-500 font-bold">
        --
      </span>
    );
  }

  return (
    <span className="text-xl sm:text-lg md:text-base text-black font-bold">
      {String(timeLeft[unit]).padStart(2, "0")}
    </span>
  );
};

export default Timer;
