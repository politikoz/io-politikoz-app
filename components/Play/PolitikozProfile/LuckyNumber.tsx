import { useState, useEffect } from "react";
import Image from "next/image";
import LuckyNumberModal from "./LuckyNumberModal";
import { useTranslations } from "next-intl";
import AuthenticatedAction from "@/components/Auth/AuthenticatedAction";

interface LuckyNumberProps {
  value: string;
  readonly: boolean;
  assetName: string;
  onChange?: (newValue: number, applyToAll: boolean) => void;
  allPolitikozIds: string[]; // Changed from number[] to string[]
}

export default function LuckyNumber({ value, readonly, assetName, onChange, allPolitikozIds }: LuckyNumberProps) {
  const t = useTranslations("PolitikozProfile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLuckyNumber, setCurrentLuckyNumber] = useState(value.padStart(2, '0'));

  useEffect(() => {
    setCurrentLuckyNumber(value.padStart(2, '0'));
  }, [value]);

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="flex items-center space-x-2 mt-1 relative">
        <div className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] flex items-center justify-center">
          <Image
            src="/images/icons8-lucky-clover-64.png"
            alt="Lucky Clover"
            width={24}
            height={24}
            className="object-contain w-full h-full"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        <span className="text-md font-bold text-green-400 font-['Press_Start_2P']">
          {currentLuckyNumber.padStart(2, '0')}
        </span>

        {!readonly && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-white px-2 py-1 text-[10px] bg-green-600 text-white shadow-[4px_4px_0px_black] hover:bg-green-700 transition font-['Press_Start_2P']"
          >
            {t("edit")}
          </button>
        )}
      </div>

      {isModalOpen && (
        <AuthenticatedAction onCancel={closeModal}>
          <LuckyNumberModal
            isOpen={true}
            onClose={() => {
              setIsModalOpen(false);
            }}
            currentValue={currentLuckyNumber.padStart(2, '0')}
            assetName={assetName}
            allPolitikozIds={allPolitikozIds} // Remove the map to String, keep as is
            onSave={(newValue, applyToAll) => {
              const formattedValue = newValue.toString().padStart(2, '0');
              onChange?.(newValue, applyToAll);
              setCurrentLuckyNumber(formattedValue);
            }}
          />
        </AuthenticatedAction>
      )}
    </>
  );
}
