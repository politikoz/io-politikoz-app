"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Header/Logo";
import { Navigation } from "@/components/Header/Navigation";
import { MobileNavigation } from "@/components/Header/MobileNavigation";
import { SupportedLocales as Locale } from "@/i18n/routing";
import ConnectToKozButton from "../ConnectToKoz/ConnectToKozButton";
import LocaleSwitcherModal from "./LocaleSwitcherModal";

export const Header: React.FC = () => {  
  const locale = useLocale() as Locale;
  const t = useTranslations("Header");

  const homeLabel = t('home');
  const exploreLabel = t('explore');
  const playLabel = t('play');
  const documentationLabel = t('documentation');
  
  return (
    <header className="bg-dark text-light px-2 py-4 flex items-center justify-between shadow-pixel-art">
      {/* Mobile Navigation: Exibe apenas em telas menores */}
      <MobileNavigation
        home={homeLabel}
        explore={exploreLabel}
        play={playLabel}
        documentation={documentationLabel}
      />

      {/* Logo: Exibe apenas em telas maiores */}
      <Logo className="hidden md:block" />

      {/* Centro: Navegação Desktop */}
      <div className="flex-1 hidden md:flex justify-center">
        <Navigation
          home={homeLabel}
          explore={exploreLabel}
          play={playLabel}
          documentation={documentationLabel}
        />
      </div>

      {/* Direita: Locale Switcher e Connect Wallet */}
      <RightActions currentLocale={locale} />
    </header>
  );
};

const RightActions: React.FC<{ currentLocale: Locale }> = ({ currentLocale }) => {
  const pathname = usePathname();
  // Get clean path without locale
  const currentPath = pathname.replace(`/${currentLocale}`, '') || '/';
  
  // Add locale back to path for non-root paths
  const fullPath = currentPath === '/' ? '/' : `/${currentLocale}${currentPath}`;

  return (
    <div className="flex items-center space-x-2 z-50">
      <LocaleSwitcherModal currentLocale={currentLocale} />       
      <ConnectToKozButton 
        label="Connect to Koz" 
        originPage={fullPath}
        originDisplay={currentPath === '/' ? 'HomePage' : currentPath.slice(1)}
      />
    </div>
  );
};

export default Header;
