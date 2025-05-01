"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import AutoLinkDistribution from "./AutoLinkDistribution";
import { AutoLinkConfigData, TicketDistribution } from "./AutoLinkTypes";
import { usePartiesData } from "@/hooks/usePartiesData";
import { useAutoLinkConfig } from "@/hooks/useAutoLinkConfig";

interface AutoLinkPartiesModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSave: (config: AutoLinkConfigData) => void;
}

export default function AutoLinkPartiesModal({ isOpen, closeModal, onSave }: AutoLinkPartiesModalProps) {
  const { data: parties, isLoading } = usePartiesData();
  const { data: currentConfig } = useAutoLinkConfig();
  const [selectedParties, setSelectedParties] = useState<{ id: string; sigla: string; name: string }[]>([]);
  const [ticketDistribution, setTicketDistribution] = useState<TicketDistribution>({});
  const [isSaving, setIsSaving] = useState(false);

  const t = useTranslations("AutoLink.ModalParties");

  // Add this new memoized value for available parties
  const availableParties = useMemo(() => {
    if (!parties) return [];
    return parties.filter(party => 
      !selectedParties.some(selected => selected.id === party.id.toString())
    );
  }, [parties, selectedParties]);

  if (!isOpen) return null;

  const saveConfig = async () => {
    if (selectedParties.length === 0 || Object.values(ticketDistribution).reduce((acc, p) => acc + p, 0) === 0) return;

    try {
      setIsSaving(true);
      const updatedConfig = { ...currentConfig };
      
      // Calculate distribution per party
      const distributionPerParty = Object.entries(ticketDistribution).reduce<Record<string, number>>((acc, [type, value]) => {
        acc[type] = value / selectedParties.length;
        return acc;
      }, {});

      // Update party configurations
      updatedConfig.party = updatedConfig.party || {};
      selectedParties.forEach(party => {
        const existingDistribution = currentConfig?.party?.[party.id] || {};
        
        // Merge existing and new distributions, summing values for same ticket types
        updatedConfig.party = {
          ...updatedConfig.party,
          [party.id]: Object.entries(distributionPerParty).reduce<TicketDistribution>((acc, [ticketType, value]) => {
            acc[ticketType] = (existingDistribution[ticketType] || 0) + value;
            return acc;
          }, { ...existingDistribution })
        };
      });

      await onSave(updatedConfig);
      setSelectedParties([]);
      setTicketDistribution({});
      closeModal();
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const removeParty = (id: string) => {
    setSelectedParties((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 border-4 border-black shadow-lg max-w-3xl w-full rounded-lg relative">
        <h2 className="text-xl font-bold text-yellow-300 mb-4">{t("title")}</h2>

        <select
          className="w-full p-2 bg-gray-700 border border-white mt-2"
          onChange={(e) => {
            const selectedParty = parties.find(p => p.id.toString() === e.target.value);
            if (selectedParty && !selectedParties.some(p => p.id === selectedParty.id.toString())) {
              setSelectedParties([...selectedParties, {
                id: selectedParty.id.toString(),
                sigla: selectedParty.acronym,
                name: selectedParty.name
              }]);
            }
          }}
          disabled={isLoading}
          value=""
        >
          <option value="">{t("selectPlaceholder")}</option>
          {availableParties.map(party => (
            <option key={party.id} value={party.id}>
              {party.acronym} - {party.name}
            </option>
          ))}
        </select>

        {selectedParties.length > 0 && (
          <div className="mt-4 p-3 bg-gray-800 border-2 border-gray-700 rounded min-h-[100px] max-h-[100px] overflow-y-auto">
            <h3 className="text-md font-bold text-yellow-300">{t("selectedTitle")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {selectedParties.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-white bg-gray-700 p-2 rounded w-auto">
                  <span className="text-sm">{p.sigla} - {p.name}</span>
                  <button
                    onClick={() => removeParty(p.id)}
                    className="text-xs bg-red-600 px-2 py-1 border border-white rounded hover:bg-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <AutoLinkDistribution
          entityType="party"
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
            disabled={selectedParties.length === 0 || isSaving}
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
