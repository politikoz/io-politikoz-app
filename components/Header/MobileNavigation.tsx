"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/routing";

type MobileNavigationProps = {
  home: string; // Rótulo do link para "Home"
  explore: string; // Rótulo do link para "Explore"
  play: string; // Rótulo do link para "play"
  documentation: string; // Rótulo do link para "Docs"
};

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  home,
  explore,
  play,
  documentation,
}) => {
  return (
    <Disclosure as="nav" className="relative md:hidden">
      {({ open, close }) => (
        <>
          {/* Botão do Menu */}
          <DisclosureButton
            className="flex items-center justify-center w-15 h-10 text-primary z-30 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {open ? (
              <XMarkIcon className="h-8 w-8" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-8 w-8" aria-hidden="true" />
            )}
          </DisclosureButton>

          {/* Painel do Menu */}
          <DisclosurePanel
            className={`fixed top-16 left-0 w-full bg-dark text-light shadow-lg z-20 transition-transform duration-300 ${
              open ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <ul className="flex flex-col items-center space-y-4 py-4">
              {/* Link para Home */}
              <li>
                <Link
                  href="/"
                  className="block text-sm font-bold hover:text-primary transition-colors"
                  onClick={() => close()} // Fecha o menu ao clicar
                >
                  {home}
                </Link>
              </li>

              {/* Link para Explore */}
              <li>
                <Link
                  href="/explore"
                  className="block text-sm font-bold hover:text-primary transition-colors"
                  onClick={() => close()} // Fecha o menu ao clicar
                >
                  {explore}
                </Link>
              </li>

              {/* Link para Play */}
              <li>
                <Link
                  href="/play"
                  className="block text-sm font-bold hover:text-primary transition-colors"
                  onClick={() => close()} // Fecha o menu ao clicar
                >
                  {play}
                </Link>
              </li>              

              {/* Link para Docs */}
              <li>
                <a
                  href="https://docs.politikoz.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-bold hover:text-primary transition-colors"
                  onClick={() => close()} // Fecha o menu ao clicar
                >
                  {documentation}
                </a>
              </li>
            </ul>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default MobileNavigation;
