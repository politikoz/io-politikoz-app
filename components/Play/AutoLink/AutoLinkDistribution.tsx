"use client";

import React, { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { TicketType } from "@/types/AutoLinkConfigData";
import { TicketDistribution } from "./AutoLinkTypes";
import { useAutoLinkConfig } from "@/hooks/useAutoLinkConfig";

interface Props {
  ticketDistribution: TicketDistribution;
  setTicketDistribution: React.Dispatch<React.SetStateAction<TicketDistribution>>;
  entityId?: string;
  entityType: "party" | "politikoz" | "random";
}

const TICKET_TYPES: TicketType[] = ["BRIBER", "CORRUPT", "FRONTMAN", "LAUNDERER", "LOBBYIST"];

const AutoLinkDistribution: React.FC<Props> = ({
  ticketDistribution,
  setTicketDistribution,
  entityId,
  entityType,
}) => {
  const t = useTranslations("AutoLink.Distribution");
  const { data: config } = useAutoLinkConfig();

  // Set initial state from existing config
  useEffect(() => {
    if (entityType === 'random' && config?.politikoz?.random) {
      setTicketDistribution(config.politikoz.random);
    }
    else if (entityType === 'politikoz' && entityId && config?.politikoz?.[entityId]) {
      setTicketDistribution(config.politikoz[entityId]);
    }
    else if (entityType === 'party' && entityId && config?.party?.[entityId]) {
      setTicketDistribution(config.party[entityId]);
    }
  }, [config, entityType, entityId, setTicketDistribution]);

  // Calculate totals from other configurations (excluding current context)
  const otherConfigTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    
    TICKET_TYPES.forEach((ticketType) => {
      let total = 0;

      // Sum party distributions
      if (config?.party) {
        total += Object.values(config.party)
          .reduce((acc, distribution) => acc + (distribution[ticketType] || 0), 0);
      }

      // Sum politikoz distributions (excluding current context)
      if (config?.politikoz) {
        Object.entries(config.politikoz).forEach(([id, distribution]) => {
          if ((entityType === 'random' && id === '-1') || 
              (entityType === 'politikoz' && id === entityId) ||
              (entityType === 'party' && id === entityId)) {
            return;
          }
          total += distribution[ticketType] || 0;
        });
      }
      
      totals[ticketType] = total;
    });
    return totals;
  }, [config, entityType, entityId]);

  const handleChange = (ticketType: string, value: number) => {
    if (value < 0) return;

    const otherConfigTotal = otherConfigTotals[ticketType] || 0;
    const currentConfigValue = ticketDistribution[ticketType] || 0;
    const total = otherConfigTotal + currentConfigValue;
    const remaining = 1 - otherConfigTotal;
    
    if (value > remaining) return;

    setTicketDistribution((prev) => ({
      ...prev,
      [ticketType]: value,
    }));
  };

  return (
    <div className="mt-4">
      {TICKET_TYPES.map((type) => {
        const otherConfigTotal = otherConfigTotals[type] || 0;
        const currentValue = ticketDistribution[type] || 0;
        const remaining = 1 - otherConfigTotal;

        return (
          <div key={type} className="flex flex-col gap-3 mb-4">
            <label className="text-white font-semibold">
              {type}
            </label>
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-300 opacity-60"></div>
                {t("otherConfigs")}: {(otherConfigTotal * 100).toFixed(0)}%
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                {t("thisConfig")}: {(currentValue * 100).toFixed(0)}%
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                {t("available")}: {((1 - (otherConfigTotal + currentValue)) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleChange(type, Math.max(0, currentValue - 0.1))}
                className="bg-gray-700 px-2 py-1 text-white border border-white rounded"
                disabled={currentValue <= 0}
              >
                -
              </button>

              <div className="relative w-1/2 h-6 bg-gray-700 rounded overflow-hidden">
                {/* Other configs bar */}
                {otherConfigTotal > 0 && (
                  <div 
                    className="absolute h-full bg-emerald-300 opacity-60"
                    style={{ width: `${otherConfigTotal * 100}%` }}
                  />
                )}
                {/* Current value bar */}
                <div
                  className="absolute h-full bg-green-500"
                  style={{ 
                    width: `${currentValue * 100}%`,
                    left: `${otherConfigTotal * 100}%`
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max={remaining}
                  step="0.01"
                  value={currentValue}
                  onChange={(e) => handleChange(type, Number(e.target.value))}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <button
                onClick={() => handleChange(type, Math.min(remaining, currentValue + 0.1))}
                className="bg-gray-700 px-2 py-1 text-white border border-white rounded"
                disabled={currentValue >= remaining}
              >
                +
              </button>

              <span className="ml-2 text-yellow-300 text-sm">
                {((otherConfigTotal + currentValue) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AutoLinkDistribution;
