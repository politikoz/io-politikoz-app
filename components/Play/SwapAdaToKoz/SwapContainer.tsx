"use client";

import SwapAdaToKoz from "./SwapAdaToKoz";
import { WalletProvider } from "@/providers/WalletProvider";

export function SwapContainer() {
  return (
    <WalletProvider>        
          <SwapAdaToKoz />
    </WalletProvider>
  );
}