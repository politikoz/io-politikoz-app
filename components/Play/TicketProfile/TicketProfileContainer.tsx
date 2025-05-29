"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import TicketProfile from "./TicketProfile";

interface TicketProfileContainerProps {
  onAuthError?: () => void;
}

export default function TicketProfileContainer({ onAuthError }: TicketProfileContainerProps) {
  return (
    <AuthProvider onAuthError={onAuthError}>
      <TicketProfile />
    </AuthProvider>
  );
}