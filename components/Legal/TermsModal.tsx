"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations("Terms");

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-6 border-b">
            <Dialog.Title className="text-2xl font-pixel text-gray-900">
              {t("title")}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6 text-gray-700">
              {/* Introduction */}
              <section>
                <h2 className="text-xl font-pixel mb-4">{t("sections.intro.title")}</h2>
                <p className="mb-4">{t("sections.intro.content")}</p>
              </section>

              {/* KOZ Token */}
              <section>
                <h2 className="text-xl font-pixel mb-4">{t("sections.token.title")}</h2>
                <p className="mb-4">{t("sections.token.content")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t("sections.token.points.utility")}</li>
                  <li>{t("sections.token.points.governance")}</li>
                  <li>{t("sections.token.points.rewards")}</li>
                </ul>
              </section>

              {/* Disclaimers */}
              <section>
                <h2 className="text-xl font-pixel mb-4">{t("sections.disclaimers.title")}</h2>
                <p>{t("sections.disclaimers.content")}</p>
              </section>

              {/* User Responsibilities */}
              <section>
                <h2 className="text-xl font-pixel mb-4">{t("sections.responsibilities.title")}</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {["compliance", "security", "conduct"].map((key) => (
                    <li key={key}>{t(`sections.responsibilities.points.${key}`)}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-pixel"
            >
              {t("close")}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TermsModal;