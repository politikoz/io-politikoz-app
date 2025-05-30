"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import PolitikozProfileView from "./PolitikozProfile";

interface PolitikozProfileContainerProps {
  onAuthError?: () => void;
}

export default function PolitikozProfileContainer({ onAuthError }: PolitikozProfileContainerProps) {
  return (
    <AuthProvider onAuthError={onAuthError}>
      <PolitikozProfileView />
    </AuthProvider>
  );
}