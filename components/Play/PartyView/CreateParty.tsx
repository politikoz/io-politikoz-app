"use client";

import React, { useState } from "react";
import PartyFlag from "./PartyFlag";
import { useTranslations } from "next-intl";

export default function CreateParty() {
  const t = useTranslations("PartyView.create");

  const [partySigla, setPartySigla] = useState("");
  const [partyName, setPartyName] = useState("");
  const [flagKey, setFlagKey] = useState(0);

  const handleSiglaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
    setPartySigla(value);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-900 border-4 border-white shadow-[6px_6px_0px_black]">
      <h2 className="text-lg font-bold text-center text-yellow-400 mb-4">{t("title")}</h2>

      <div className="flex justify-center mb-4">
        <PartyFlag onRegenerate={() => setFlagKey(flagKey + 1)} />
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
          className="mt-4 border-2 border-white px-4 py-2 bg-green-600 text-white shadow-[4px_4px_0px_black] hover:bg-green-700 transition font-['Press_Start_2P']"
          disabled={!partySigla || !partyName}
        >
          {t("createButton")}
        </button>
      </div>
    </div>
  );
}
