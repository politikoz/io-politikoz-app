"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  GlobeAltIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import { useRouter, usePathname, routing, localeNames } from "@/i18n/routing";

const LocaleSwitcherModal = ({ currentLocale }: { currentLocale: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeLocale = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    setIsOpen(false); // Fecha o modal após a seleção
  };

  return (
    <>
      {/* Botão para abrir o modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center text-xs text-gray-400 hover:text-yellow-400 transition-colors duration-200"
        style={{
          fontFamily: '"Press Start 2P", cursive',
        }}
      >
        <GlobeAltIcon className="h-5 w-5 mr-2" />
        <span>{currentLocale.toUpperCase()}</span>
      </button>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <DialogPanel
            className="relative w-full max-w-xl bg-gray-800 p-8 text-left shadow-pixel"
            style={{
              fontFamily: '"Press Start 2P", cursive',
            }}
          >
            <DialogTitle className="text-3xl font-bold mb-4 text-white leading-snug text-center">
              Select Language
            </DialogTitle>

            {/* Lista de opções */}
            <div className="space-y-4">
              {Array.from(routing.locales).map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleChangeLocale(locale)}
                  className={`flex items-center px-4 py-2 w-full text-yellow-400 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-gray-900 transition-all duration-200 cursor-pointer ${
                    currentLocale === locale ? "bg-yellow-500 text-gray-900" : "bg-gray-900"
                  }`}
                  style={{
                    fontFamily: '"Press Start 2P", cursive',
                    boxShadow: "0px 0px 0px 2px #FFD700",
                  }}
                >
                  <span className="flex-grow text-left">{localeNames[locale] || locale}</span>
                  {currentLocale === locale && (
                    <CheckIcon className="h-5 w-5 text-secondary ml-2" />
                  )}
                </button>
              ))}
            </div>

            {/* Botão de Fechar */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-red-500 text-gray-900 font-bold text-sm shadow-pixel transition-all hover:bg-red-400"
                style={{
                  fontFamily: '"Press Start 2P", cursive',
                }}
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default LocaleSwitcherModal;
