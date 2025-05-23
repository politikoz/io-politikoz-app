"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import TicketProfileView from "./TicketProfileView";

interface TicketProfileContainerProps {
  onAuthError?: () => void;
}

export default function TicketProfileContainer({ onAuthError }: TicketProfileContainerProps) {
  return (
    <AuthProvider onAuthError={onAuthError}>
      <TicketProfileView />
    </AuthProvider>
  );
}