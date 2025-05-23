"use client";

import { ReactNode, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";
import AuthErrorModal from "./AuthErrorModal";

interface AuthenticatedActionProps {
  children: ReactNode | ((isAuthenticated: boolean) => ReactNode);
  showModalOnError?: boolean;
  onCancel?: () => void;
}

export default function AuthenticatedAction({ 
  children,
  showModalOnError = true,
  onCancel 
}: AuthenticatedActionProps) {
  const { isAuthenticated, authenticate, getSession } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  const handleAuth = async () => {
    const session = getSession();
    if (session || isAuthenticated || isAuthenticating) {
      return;
    }

    setIsAuthenticating(true);
    setShowModal(true);
    setHasAttempted(true);
    
    try {
      const result = await authenticate().catch(() => null);

      if (result) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowModal(false);
      } else {
        setAuthError('Authentication failed');
        setShowModal(false);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleErrorClose = () => {
    setAuthError(null);
    onCancel?.();
  };

  if (!isAuthenticated && showModalOnError && !isAuthenticating && !hasAttempted) {
    handleAuth();
  }

  return (
    <>
      {typeof children === "function" ? children(isAuthenticated) : children}
      {showModal && !authError && <AuthModal />}
      {authError && (
        <AuthErrorModal 
          isOpen={true}
          onClose={handleErrorClose}
          error={authError}
        />
      )}
    </>
  );
}