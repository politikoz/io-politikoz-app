"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PolitikozSearch from "./PolitikozSearch";
import AutoLinkDistribution from "./AutoLinkDistribution";
import { AutoLinkConfigData, TicketDistribution } from "./AutoLinkTypes";
import { useAutoLinkConfig } from "@/hooks/useAutoLinkConfig";

interface AutoLinkPolitikozModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSave: (config: AutoLinkConfigData) => void;
}

export default function AutoLinkPolitikozModal({ isOpen, closeModal, onSave }: AutoLinkPolitikozModalProps) {
  const [selectedPolitikoz, setSelectedPolitikoz] = useState<{ id: string }[]>([]);
  const [ticketDistribution, setTicketDistribution] = useState<TicketDistribution>({});
  const [isSaving, setIsSaving] = useState(false);
  const t = useTranslations("AutoLink.ModalPolitikoz");
  const { data: currentConfig } = useAutoLinkConfig(); // Move hook to component level

  if (!isOpen) return null;

  const saveConfig = async () => {
    if (selectedPolitikoz.length === 0 || Object.values(ticketDistribution).reduce((acc, p) => acc + p, 0) === 0) return;

    try {
      setIsSaving(true);
      const updatedConfig = { ...currentConfig }; // Use currentConfig from hook

      // Calculate distribution per Politikoz
      const distributionPerPolitikoz = Object.entries(ticketDistribution).reduce<Record<string, number>>((acc, [type, value]) => {
        acc[type] = value / selectedPolitikoz.length;
        return acc;
      }, {});

      // Update politikoz configurations
      selectedPolitikoz.forEach(politikoz => {
        const existingDistribution = currentConfig?.politikoz?.[politikoz.id] || {};
        
        // Merge existing and new distributions, summing values for same ticket types
        updatedConfig.politikoz = {
          ...updatedConfig.politikoz,
          [politikoz.id]: Object.entries(distributionPerPolitikoz).reduce<TicketDistribution>((acc, [ticketType, value]) => {
            acc[ticketType] = (existingDistribution[ticketType] || 0) + value;
            return acc;
          }, { ...existingDistribution })
        };
      });

      // Maintain other configurations
      updatedConfig.party = currentConfig?.party || null;
      updatedConfig.user = currentConfig?.user || null;

      await onSave(updatedConfig);
      setSelectedPolitikoz([]);
      setTicketDistribution({});
      closeModal();
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 border-4 border-black shadow-lg max-w-3xl w-full rounded-lg relative">
        <h2 className="text-xl font-bold text-yellow-300 mb-2">{t("title")}</h2>
        
        <p className="text-sm text-gray-400 mb-4">{t("description")}</p>

        <PolitikozSearch onSelectPolitikoz={(id) => setSelectedPolitikoz([...selectedPolitikoz, { id }])} />

        <div className="mt-4 p-3 bg-gray-800 border-2 border-gray-700 rounded min-h-[120px] max-h-[120px] overflow-y-auto">
          <h3 className="text-md font-bold text-yellow-300">{t("selectedTitle")}</h3>

          {selectedPolitikoz.length === 0 ? (
            <p className="text-gray-400 text-sm">{t("noneSelected")}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {selectedPolitikoz.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-white bg-gray-700 p-2 rounded w-auto">
                  <span className="text-sm">#{p.id.padStart(5, '0')}</span>
                  <button
                    onClick={() => setSelectedPolitikoz((prev) => prev.filter((item) => item.id !== p.id))}
                    className="text-xs bg-red-600 px-2 py-1 border border-white rounded hover:bg-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <AutoLinkDistribution
          entityType="politikoz"
          ticketDistribution={ticketDistribution}
          setTicketDistribution={setTicketDistribution}
        />

        <div className="flex justify-between mt-6">
          <button 
            onClick={closeModal} 
            className="bg-red-600 text-white px-4 py-2 border-2 border-white rounded hover:bg-red-700"
            disabled={isSaving}
          >
            {t("cancel")}
          </button>
          <button 
            onClick={saveConfig} 
            className="bg-green-600 text-white px-4 py-2 border-2 border-white rounded hover:bg-green-700 flex items-center gap-2" 
            disabled={
              selectedPolitikoz.length === 0 || // No politikoz selected
              isSaving // Already saving
            }
          >
            {isSaving && (
              <span className="animate-spin">⟳</span>
            )}
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}