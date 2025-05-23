"use client";

import { ReactNode, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";

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

  const handleAuth = async () => {
    // Check if we already have a valid session
    const session = getSession();
    if (session || isAuthenticated || isAuthenticating) {
      console.log('[AuthenticatedAction] Already authenticated or in progress');
      return;
    }

    setIsAuthenticating(true);
    setShowModal(true);
    
    try {
      console.log('[AuthenticatedAction] Starting wallet signature request');
      const result = await authenticate().catch((error) => {
        // Handle user cancellation gracefully
        if (error?.message?.includes('user declined')) {
          console.log('[AuthenticatedAction] User declined signature');
          return null;
        }
        throw error;
      });

      if (result) {
        console.log('[AuthenticatedAction] Authentication successful');
        // Add delay to ensure backend processing completes
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowModal(false);
      }
    } catch (error) {
      console.error('[AuthenticatedAction] Authentication error:', error);
      onCancel?.();
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Only trigger authentication on initial mount if needed
  if (!isAuthenticated && showModalOnError && !isAuthenticating) {
    handleAuth();
  }

  return (
    <>
      {typeof children === "function" ? children(isAuthenticated) : children}
      {showModal && <AuthModal />}
    </>
  );
}