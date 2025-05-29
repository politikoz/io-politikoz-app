"use client";

import BuyTicket from "./BuyTicket";
import { WalletProvider } from "@/providers/WalletProvider";

export function BuyTicketContainer() {
  return (
    <WalletProvider>
      <BuyTicket />
    </WalletProvider>
  );
}