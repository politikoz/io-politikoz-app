"use client";

import React, { useState } from "react";
import PartyFlag from "./PartyFlag";
import { useTranslations } from "next-intl";
import { useCreateParty } from "@/hooks/useCreateParty";

interface CreatePartyProps {
  availableColors: string[];
}

export default function CreateParty({ availableColors }: CreatePartyProps) {
  const t = useTranslations("PartyView.create");
  const [flagKey, setFlagKey] = useState(0);
  const [partySigla, setPartySigla] = useState("");
  const [partyName, setPartyName] = useState("");
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || "");
  
  const createPartyMutation = useCreateParty();

  const handleSiglaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
    setPartySigla(value);
  };

  const handleSubmit = async () => {
    const stakeAddress = localStorage.getItem('stakeAddress');
    if (!stakeAddress) return;

    try {
      await createPartyMutation.mutateAsync({
        acronym: partySigla,
        name: partyName,
        flagColor: selectedColor,
        stakeAddress
      });
    } catch (error) {
      console.error('Failed to create party:', error);
    }
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

        <button
          onClick={handleSubmit}
          className="mt-4 border-2 border-white px-4 py-2 bg-green-600 text-white shadow-[4px_4px_0px_black] hover:bg-green-700 transition font-['Press_Start_2P']"
          disabled={!partySigla || !partyName || !selectedColor || createPartyMutation.isPending}
        >
          {createPartyMutation.isPending ? t("creating") : t("createButton")}
        </button>
      </div>
    </div>
  );
}
