"use client";

import { MeshProvider } from "@meshsdk/react";
import { WalletContextProvider } from "@/contexts/WalletContext";
import StakePage from "./StakePage";

export function StakeContainer() {
  return (
    <MeshProvider>
      <WalletContextProvider>
        <StakePage />
      </WalletContextProvider>
    </MeshProvider>
  );
}