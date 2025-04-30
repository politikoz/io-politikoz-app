"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function TicketPolicyExample() {
  const t = useTranslations("TicketPolicy");

  return (
    <div className="bg-gray-800 border-2 border-white rounded p-4 mt-4">
      <h4 className="text-md font-bold text-yellow-300 mb-2">
        {t("exampleTitle")}
      </h4>
      <p className="text-sm text-gray-300">
        {t("exampleIntro")}
      </p>
      <ul className="text-sm text-gray-300 list-disc list-inside mt-2 space-y-1">
        <li>{t("exampleLine1")}</li>
        <li>{t("exampleLine2")}</li>
        <li>{t("exampleLine3")}</li>
        <li>{t("exampleLine4")}</li>
      </ul>
      <p className="text-sm text-gray-300 mt-2 italic">
        {t("exampleNote")}
      </p>
    </div>
  );
}
