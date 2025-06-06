"use client";

import { WalletProvider } from "@/providers/WalletProvider";
import { MintButton } from "./MintButton";

export function MintContainer() {
  return (
    <WalletProvider>
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-pixel text-yellow-400 mb-6">
          Mint Test KOZ Tokens
        </h2>
        <MintButton />
      </div>
    </WalletProvider>
  );
}