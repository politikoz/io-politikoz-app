"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface TicketCardProps {
  ticket: string;
  amount: number;
}

export default function TicketCard({ ticket, amount }: TicketCardProps) {
  const t = useTranslations("TicketPolicy");

  return (
    <div className="flex flex-col items-center border-2 border-white rounded p-3 bg-gray-800 text-center">
      <Image
        src={`/images/${ticket.toLowerCase()}.png`}
        alt={ticket}
        width={64}
        height={64}
        className="mb-2"
      />
      <div className="text-sm font-bold">{ticket}</div>
      <div className="text-xs text-gray-300">
        {t("ticketRule", { amount })}
      </div>
    </div>
  );
}
