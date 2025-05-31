"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { XMarkIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";

const CONSENT_KEY = "politikoz-consent-v1";

const ConsentBanner: React.FC = () => {
  const t = useTranslations("Consent");
  const [showBanner, setShowBanner] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      try {
        const hasConsented = window.localStorage.getItem(CONSENT_KEY);
        setShowBanner(!hasConsented);
      } catch (error) {
        setShowBanner(true);
      }
    };

    checkConsent();
  }, []);

  const handleAccept = () => {
    try {
      window.localStorage.setItem(CONSENT_KEY, new Date().toISOString());
      setShowBanner(false);
    } catch (error) {
      console.error("Error saving consent:", error);
    }
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="relative bg-blue-900/95 text-blue-100 shadow-lg z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1 p-1.5">
          <ExclamationCircleIcon className="h-8 w-8 text-yellow-300 flex-shrink-1" />
          <p className="text-sm text-center flex items-center ml-1">
            {t("message")}
            <button
              onClick={() => setIsTermsOpen(true)}
              className="text-blue-300 hover:text-blue-200 transition-colors ml-0.5"
            >
              {t("termsLink")}
            </button>
            <span className="text-blue-100 mx-0.5">{t("and")}</span>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              {t("privacyLink")}
            </button>
          </p>

          <button
            onClick={handleAccept}
            className="text-blue-300 hover:text-blue-100 transition-colors flex-shrink-0 -mr-0.5 ml-1"
            aria-label="Close consent banner"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      <PrivacyModal 
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </>
  );
};

export default ConsentBanner;