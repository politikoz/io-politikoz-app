"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface TicketResultProps {
  ticket: string;
  amount: number;
}

export default function TicketResult({ ticket, amount }: TicketResultProps) {
  const t = useTranslations("TicketPolicy");

  return (
    <div className="flex flex-col items-center border-2 border-white rounded p-3 bg-gray-800 text-center w-full">
      <Image
        src={`/images/assets/${ticket.toLowerCase()}.png`}
        alt={ticket}
        width={64}
        height={64}
        className="mb-2"
      />
      <div className="text-sm font-bold">{ticket}</div>
      <div className="text-xs text-yellow-300">
        {t("ticketsLabel")}: {amount}
      </div>
    </div>
  );
}
