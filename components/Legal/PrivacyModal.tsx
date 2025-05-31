"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations("Privacy");

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

              {/* Information Collection */}
              <section>
                <h2 className="text-xl font-pixel mb-4">{t("sections.collection.title")}</h2>
                <p className="mb-4">{t("sections.collection.content")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {["wallet", "usage", "cookies"].map((key) => (
                    <li key={key}>{t(`sections.collection.points.${key}`)}</li>
                  ))}
                </ul>
              </section>

              {/* Usage */}
              <section>
                <h2 className="text-xl font-pixel mb-4">{t("sections.usage.title")}</h2>
                <p className="mb-4">{t("sections.usage.content")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {["service", "improve", "security", "communication"].map((key) => (
                    <li key={key}>{t(`sections.usage.points.${key}`)}</li>
                  ))}
                </ul>
              </section>

              {/* Information Sharing */}
              <section>
                <h2 className="text-xl font-pixel mb-4">{t("sections.sharing.title")}</h2>
                <p className="mb-4">{t("sections.sharing.content")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {["providers", "legal", "aggregated"].map((key) => (
                    <li key={key}>{t(`sections.sharing.points.${key}`)}</li>
                  ))}
                </ul>
              </section>

              {/* Security */}
              <section>
                <h2 className="text-xl font-pixel mb-4">{t("sections.security.title")}</h2>
                <p>{t("sections.security.content")}</p>
              </section>

              {/* Rights */}
              <section>
                <h2 className="text-xl font-pixel mb-4">{t("sections.rights.title")}</h2>
                <p className="mb-4">{t("sections.rights.content")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {["access", "correct", "delete", "object"].map((key) => (
                    <li key={key}>{t(`sections.rights.points.${key}`)}</li>
                  ))}
                </ul>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-xl font-pixel mb-4">{t("sections.contact.title")}</h2>
                <p>{t("sections.contact.content")}</p>
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

export default PrivacyModal;