"use client";

import { WalletProvider } from "@/providers/WalletProvider";
import ReleasePrisonerModal from "./ReleasePrisonerModal";

interface ReleasePrisonerModalContainerProps {
  isOpen: boolean;
  prisonerName: string;
  onClose: () => void;
  onConfirm: (releaseAll: boolean) => void;
  releaseCost: number;
  prisonEpochs: number;
  totalPrisoners: number;
  totalReleaseCost: number;
  assetNames: string[];
}

export function ReleasePrisonerModalContainer(props: ReleasePrisonerModalContainerProps) {
  return (
    <WalletProvider>
      <ReleasePrisonerModal {...props} />
    </WalletProvider>
  );
}