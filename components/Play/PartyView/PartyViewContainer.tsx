"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import PartyView from "./PartyView";

interface PartyViewContainerProps {
  onAuthError?: () => void;
}

export default function PartyViewContainer({ onAuthError }: PartyViewContainerProps) {
  return (
    <AuthProvider onAuthError={onAuthError}>
      <PartyView />
    </AuthProvider>
  );
}