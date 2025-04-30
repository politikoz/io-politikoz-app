"use client";

import React from "react";
import { useTranslations } from "next-intl";

const ConnectToKozFooter: React.FC = () => {
  const t = useTranslations("ConnectToKoz");

  return (
    <div className="mt-8 text-center text-[8px] text-gray-400">
      <div className="my-4 h-[1px] bg-gray-600 w-full mx-auto"></div>
      <p>
        {t.rich("agreeToTerms", {
          termsLink: (chunks) => (
            <a
              href="/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-yellow-500"
            >
              {chunks}
            </a>
          ),
          privacyLink: (chunks) => (
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-yellow-500"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </div>
  );
};

export default ConnectToKozFooter;
