"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [timer, setTimer] = useState(3);

  const t = useTranslations("ConnectToKoz.LogoutModal");

  useEffect(() => {
    if (isOpen) {
      setIsButtonDisabled(true);
      setTimer(3);

      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setIsButtonDisabled(false);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div
        className="bg-gray-800 rounded-lg p-6 w-full max-w-md text-center shadow-lg border-2 border-yellow-500"
        style={{
          fontFamily: '"Press Start 2P", cursive',
          boxShadow: "0px 0px 0px 2px #FFD700",
        }}
      >
        <h2 className="text-lg font-bold mb-4 text-yellow-400">{t("title")}</h2>
        <p className="text-gray-300 mb-6 text-sm sm:text-base">{t("message")}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            className="px-4 py-2 bg-green-700 text-gray-300 rounded-md hover:bg-gray-600 w-full sm:w-auto"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
          <button
            className={`px-4 py-2 ${
              isButtonDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-red-500 hover:bg-yellow-400"
            } text-gray-900 font-bold rounded-md w-full sm:w-auto`}
            onClick={onConfirm}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? t("wait", { seconds: timer }) : t("disconnect")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
