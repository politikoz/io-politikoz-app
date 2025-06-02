"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import PartyButtons from "./PartyButtons";

interface PartyButtonsContainerProps {
  onNavigate: (section: string) => void;
  hasParty?: boolean | undefined;  // Changed to allow undefined
  isWalletConnected: boolean;
  isLoading?: boolean;
}

const PartyButtonsContainer = ({ 
  onNavigate, 
  hasParty, 
  isWalletConnected,
  isLoading 
}: PartyButtonsContainerProps) => {
  return (
    <AuthProvider>
      <PartyButtons
        onNavigate={onNavigate}
        hasParty={hasParty}
        isWalletConnected={isWalletConnected}
        isLoading={isLoading}
      />
    </AuthProvider>
  );
};

export default PartyButtonsContainer;