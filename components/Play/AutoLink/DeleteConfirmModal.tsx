"use client";

import { useTranslations } from "next-intl";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  type: 'party' | 'politikoz' | 'random';
  itemId: string;
  isDeleting: boolean;
}

export default function DeleteConfirmModal({ 
  isOpen, 
  onConfirm, 
  onCancel,
  type,
  itemId,
  isDeleting 
}: DeleteConfirmModalProps) {
  const t = useTranslations("AutoLink.DeleteConfirm");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={!isDeleting ? onCancel : undefined} 
      />
      <div className="relative bg-gray-900 border-2 border-white p-6 rounded-lg max-w-md mx-4 shadow-xl">
        <h2 className="text-white font-bold text-lg mb-4">
          {isDeleting ? t("deleting") : t("title")}
        </h2>
        
        <div className="text-white mb-6">
          {isDeleting ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t("deletingMessage")}
            </div>
          ) : (
            t("message", { 
              type: t(`type.${type}`),
              id: type === 'random' ? t("random") : itemId
            })
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t("deleting")}</span>
              </>
            ) : (
              t("confirm")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}