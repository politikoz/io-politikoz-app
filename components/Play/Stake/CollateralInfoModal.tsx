import { useTranslations } from "next-intl";
import React from "react";

interface CollateralInfoModalProps {
  onClose: () => void;
}

export default function CollateralInfoModal({ onClose }: CollateralInfoModalProps) {
  const t = useTranslations("Stake");

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-96 pixel-shadow">
        <h3 className="text-lg font-bold text-blue-300 mb-4">What is Collateral?</h3>
        
        <div className="space-y-4 text-sm">
          <p>
            Collateral is a small amount of ADA (usually 5 ADA) that your wallet holds 
            separately. It's required for smart contract transactions on Cardano.
          </p>
          
          <p>
            Think of it as a security deposit that ensures smart contract 
            transactions work properly. Don't worry - you keep full control of this ADA!
          </p>

          <p className="text-blue-300 font-semibold">
            Your wallet automatically manages this for you, and you can get it back 
            anytime by removing the collateral setting in your wallet.
          </p>
        </div>

        <button
          className="mt-6 bg-blue-600 px-4 py-2 rounded-md text-sm text-white hover:bg-blue-700 transition"
          onClick={onClose}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}