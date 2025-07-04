"use client";

import SwapAdaToKoz from "./SwapAdaToKoz";
import { WalletProvider } from "@/providers/WalletProvider";

export function SwapContainer() {
  console.log("[SwapContainer] Render");
  return (
    <WalletProvider>        
          <SwapAdaToKoz />
    </WalletProvider>
  );
}