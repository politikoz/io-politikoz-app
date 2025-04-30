"use client";

import { createContext, useContext, useState } from "react";

interface TourContextType {
  isTourActive: boolean;
  activateTour: () => void;
  deactivateTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTourActive, setIsTourActive] = useState(false);

  const activateTour = () => setIsTourActive(true);
  const deactivateTour = () => setIsTourActive(false);

  return (
    <TourContext.Provider value={{ isTourActive, activateTour, deactivateTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) throw new Error("useTour must be used within a TourProvider");
  return context;
};
