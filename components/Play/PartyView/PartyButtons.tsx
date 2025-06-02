"use client";

import { useTranslations } from "next-intl";
import {
  FlagIcon,
  BriefcaseIcon,
  HashtagIcon,
  Cog8ToothIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

interface PartyButtonsProps {
  onNavigate: (section: string) => void;
  hasParty?: boolean;
  isWalletConnected: boolean;
  isLoading?: boolean;
}

const PartyButtons = ({
  onNavigate,
  hasParty,
  isWalletConnected,
  isLoading = false,
}: PartyButtonsProps) => {
  const t = useTranslations("PartyView.buttons");

  const partyOptions = [
    {
      label: !isWalletConnected 
        ? t("createParty")                    // Not connected - show Create Party
        : (isLoading || hasParty === undefined)
          ? ""                                // Connected and loading - show empty label
          : hasParty 
            ? t("myParty")                    // Has party - show My Party
            : t("createParty"),               // No party - show Create Party
      icon: isWalletConnected && (isLoading || hasParty === undefined) ? (
        <ArrowPathIcon className="animate-spin" />
      ) : (
        <FlagIcon />
      ),
      section: "my-party",
      disabled: !isWalletConnected || isLoading || hasParty === undefined,
    },
    { label: t("myPolitikoz"), icon: <BriefcaseIcon />, section: "my-politikoz", disabled: false },
    { label: t("campaignGame"), icon: <HashtagIcon />, section: "campaign-politikoz", disabled: true },
    { label: t("governanceSettings"), icon: <Cog8ToothIcon />, section: "governance-settings", disabled: false },
    { label: t("exit"), icon: <ArrowRightStartOnRectangleIcon />, section: "exit", disabled: false },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
      {partyOptions.map((option, index) => {
        const isDisabled = option.disabled || (option.section === "my-party" && !isWalletConnected);

        return (
          <button
            key={index}
            onClick={() => !isDisabled && onNavigate(option.section)}
            disabled={isDisabled}
            className={`w-44 h-20 flex flex-col items-center justify-center p-2 
                      bg-gray-900 shadow-[6px_6px_0px_black] hover:bg-gray-700 transition 
                      font-['Press_Start_2P'] ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="w-8 h-8 flex items-center justify-center text-white">
              {option.icon}
            </div>
            <div className="flex flex-col items-center mt-1 min-h-[32px] justify-center">
              <span className="text-[10px] text-yellow-300 text-center leading-tight">
                {option.label}
              </span>
              {option.section === "my-party" && !isWalletConnected && (
                <span className="text-[8px] text-red-400 text-center leading-tight mt-1">
                  {t("connectWallet")}
                </span>
              )}
              {isDisabled && option.section !== "my-party" && (
                <span className="text-[8px] text-red-400 text-center leading-tight mt-1">
                  {t("comingSoon")}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PartyButtons;
