"use client";

import StakePage from "./StakePage";
import { WalletProvider } from "@/providers/WalletProvider";

export function StakeContainer() {
  return (
    <WalletProvider>
        <StakePage />
    </WalletProvider>
  );
}