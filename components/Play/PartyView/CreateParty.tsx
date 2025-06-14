"use client";

import React, { useState, useMemo } from "react";
import PartyFlag from "./PartyFlag";
import { useTranslations } from "next-intl";
import { useCreateParty } from "@/hooks/useCreateParty";

interface CreatePartyProps {
  availableColors: string[];
  availablePartyTypes: string[]; // Atualizado para string[]
}

export default function CreateParty({ availableColors, availablePartyTypes }: CreatePartyProps) {
  const t = useTranslations("PartyView.create");
  const [flagKey, setFlagKey] = useState(0);
  const [partySigla, setPartySigla] = useState("");
  const [partyName, setPartyName] = useState("");
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || "");
  const [selectedPartyType, setSelectedPartyType] = useState<string>(
    availablePartyTypes[0] || ""
  );
  const [error, setError] = useState<string | null>(null);
  
  const createPartyMutation = useCreateParty();

  // Add validation helper
  const isFormValid = useMemo(() => {
    return (
      partySigla.trim().length > 0 && 
      partyName.trim().length > 0 && 
      selectedColor && 
      selectedPartyType &&
      !createPartyMutation.isPending
    );
  }, [partySigla, partyName, selectedColor, selectedPartyType, createPartyMutation.isPending]);

  const handleSiglaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
    setPartySigla(value);
  };

  const handleSubmit = async () => {
    const stakeAddress = localStorage.getItem('stakeAddress');
    if (!stakeAddress || !selectedPartyType) return;

    try {
      setError(null);
      await createPartyMutation.mutateAsync({
        acronym: partySigla,
        name: partyName,
        flagColor: selectedColor,
        stakeAddress,
        partyType: selectedPartyType
      });
    } catch (error: any) {
      setError(error.message || t("errorDefault"));
    }
  };

  // Helper function to format party type for display
  const formatPartyType = (type: string): string => {
    if (!type) return '';
    
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black]">
      <div className="flex justify-center mb-4">
        <PartyFlag 
          availableColors={availableColors}
          onRegenerate={() => setFlagKey(flagKey + 1)}
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900 border-2 border-red-600 text-white text-sm text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <div>
          <label className="text-white text-sm font-bold">{t("siglaLabel")}</label>
          <input
            type="text"
            value={partySigla}
            onChange={handleSiglaChange}
            className="w-full p-2 border-2 border-gray-400 bg-gray-800 text-white text-center font-['Press_Start_2P']"
            maxLength={4}
            placeholder={t("placeholderSigla")}
          />
        </div>

        <div>
          <label className="text-white text-sm font-bold">{t("nameLabel")}</label>
          <input
            type="text"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            className="w-full p-2 border-2 border-gray-400 bg-gray-800 text-white text-center font-['Press_Start_2P']"
            placeholder={t("placeholderName")}
          />
        </div>

        <div>
          <label className="text-white text-sm font-bold">{t("typeLabel")}</label>
          <select
            value={selectedPartyType}
            onChange={(e) => setSelectedPartyType(e.target.value)}
            className="w-full p-2 border-2 border-gray-400 bg-gray-800 text-white text-center font-['Press_Start_2P']"
          >
            {availablePartyTypes.map((type) => (
              <option key={type} value={type}>
                {formatPartyType(type)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`mt-4 border-2 border-white px-4 py-2 text-white shadow-[4px_4px_0px_black] transition font-['Press_Start_2P']
            ${isFormValid 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-600 cursor-not-allowed opacity-50'}`}
        >
          {createPartyMutation.isPending ? t("creating") : t("createButton")}
        </button>
      </div>
    </div>
  );
}
