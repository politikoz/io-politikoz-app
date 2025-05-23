"use client";

import { useTranslations } from "next-intl";

interface AuthErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: string;
}

export default function AuthErrorModal({ isOpen, onClose, error }: AuthErrorModalProps) {
  const t = useTranslations("AuthError");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-gray-900 border-2 border-white p-6 rounded-lg max-w-md mx-4 shadow-xl">
        <h2 className="text-white font-bold text-lg mb-4">
          {t("title")}
        </h2>
        
        <p className="text-white mb-6">
          {t("message", { error })}
        </p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t("ok")}
          </button>
        </div>
      </div>
    </div>
  );
}