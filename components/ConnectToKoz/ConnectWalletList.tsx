"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useTranslations } from "next-intl";

export default function ConnectWalletList() {
  const {
    wallets,
    connect,
    disconnect,
    connected,
    rewardAddress,
    name,
  } = useConnectWallet();

  const [isLocalConnected, setIsLocalConnected] = useState(false);
  const [localWalletName, setLocalWalletName] = useState<string | null>(null);
  const [localStakeAddress, setLocalStakeAddress] = useState<string | null>(null);

  const handleDisconnect = () => {
    disconnect();
    setIsLocalConnected(false);
    setLocalWalletName(null);
    setLocalStakeAddress(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConnected = localStorage.getItem("connected") === "true";
      const storedWalletName = localStorage.getItem("walletName");
      const storedStakeAddress = localStorage.getItem("stakeAddress");

      setIsLocalConnected(storedConnected);
      setLocalWalletName(storedWalletName);
      setLocalStakeAddress(storedStakeAddress);

      const handleConnectionChange = (event: CustomEvent<{ connected: boolean }>) => {
        if (!event.detail.connected) {
          setIsLocalConnected(false);
          setLocalWalletName(null);
          setLocalStakeAddress(null);
        }
      };

      window.addEventListener('walletConnectionChange', handleConnectionChange as EventListener);

      return () => {
        window.removeEventListener('walletConnectionChange', handleConnectionChange as EventListener);
      };
    }
  }, []);

  const t = useTranslations("ConnectToKoz");

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleConnect = async (walletName: string) => {
    try {
      await connect(walletName);
      
      // Ensure connection event is dispatched
      window.dispatchEvent(
        new CustomEvent("walletConnectionChange", {
          detail: { connected: true }
        })
      );
    } catch (error) {
      console.error(`Failed to connect to ${walletName}:`, error);
      alert(t("connectError", { wallet: walletName }));
    }
  };

  const handleDownloadClick = () => {
    window.open(
      "https://developers.cardano.org/showcase/?tags=wallet",
      "_blank",
      "noopener noreferrer"
    );
  };

  const truncateAddress = (address: string | null) => {
    if (!address || address.length <= 8) return address || t("noAddress");
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  // Update button onClick to use new handler
  return (
    <div className="flex flex-col space-y-2">
      {(connected || isLocalConnected) ? (
        <div className="flex flex-col items-center px-4 py-2 bg-gray-900 text-yellow-400 border-2 border-yellow-500 rounded-none shadow-pixel-art">
          <div className="flex items-center w-full mb-4">
            {wallets.find((wallet) => wallet.name === (name || localWalletName))?.icon && (
              <Image
                src={wallets.find((wallet) => wallet.name === (name || localWalletName))?.icon || ""}
                alt={(name || localWalletName) || "Connected Wallet"}
                width={20}
                height={20}
                className="mr-2"
              />
            )}
            <div className="flex-1">
              <span className="block text-sm font-bold">
                {capitalizeFirstLetter((name || localWalletName) || t("wallet"))}
              </span>
              <span className="text-xs text-gray-300">
                {truncateAddress(rewardAddress || localStakeAddress)}
              </span>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="w-full px-3 py-2 bg-red-500 text-gray-900 text-sm font-bold rounded hover:bg-yellow-500 transition-all duration-200"
          >
            {t("disconnect")}
          </button>
        </div>
      ) : (
        <>
          {wallets.map((wallet) => (
            <div
              key={wallet.name}
              role="button"
              tabIndex={0}
              onClick={() => handleConnect(wallet.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleConnect(wallet.name);
                }
              }}
              className="flex items-center px-4 py-2 bg-gray-900 text-yellow-400 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-none transition-all duration-200 cursor-pointer shadow-pixel-art"
              style={{
                fontFamily: '"Press Start 2P", cursive',
                boxShadow: "0px 0px 0px 2px #FFD700",
              }}
            >
              {wallet.icon && (
                <Image
                  src={wallet.icon.trimStart()}
                  alt={wallet.name}
                  width={20}
                  height={20}
                  className="mr-2"
                />
              )}
              <span className="flex-1 text-sm font-bold">
                {capitalizeFirstLetter(wallet.name)}
              </span>
            </div>
          ))}

          <div
            role="button"
            tabIndex={0}
            onClick={handleDownloadClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleDownloadClick();
              }
            }}
            className="flex items-center px-4 py-2 bg-gray-900 text-yellow-400 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-none transition-all duration-200 cursor-pointer shadow-pixel-art"
            style={{
              fontFamily: '"Press Start 2P", cursive',
              boxShadow: "0px 0px 0px 2px #FFD700",
            }}
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            <span className="flex-1 text-sm font-bold">
              {t("downloadWallet")}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
