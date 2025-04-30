import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useTranslations } from "next-intl";

interface LuckyNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentValue: number;
  onSave: (newValue: number, applyToAll: boolean) => void;
}

export default function LuckyNumberModal({
  isOpen,
  onClose,
  currentValue,
  onSave,
}: LuckyNumberModalProps) {
  const t = useTranslations("PolitikozProfile");
  const [newLuckyNumber, setNewLuckyNumber] = useState<string>(currentValue.toString());
  const [applyToAll, setApplyToAll] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewLuckyNumber(currentValue.toString());
    }
  }, [isOpen, currentValue]);

  const increment = () => {
    setNewLuckyNumber((prev) => {
      let num = parseInt(prev || "0", 10);
      return num < 99 ? (num + 1).toString() : "99";
    });
  };

  const decrement = () => {
    setNewLuckyNumber((prev) => {
      let num = parseInt(prev || "0", 10);
      return num > 0 ? (num - 1).toString() : "0";
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length <= 2) {
      setNewLuckyNumber(value);
    }
  };

  const handleBlur = () => {
    if (newLuckyNumber.length === 1) {
      setNewLuckyNumber(`0${newLuckyNumber}`);
    } else if (newLuckyNumber.length === 0) {
      setNewLuckyNumber("00");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-80" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="border-4 border-white bg-gray-900 p-6 shadow-[6px_6px_0px_black] w-64 text-center">
          <DialogTitle className="text-yellow-300 font-['Press_Start_2P'] text-sm mb-4">
            {t("editLuckyNumber")}
          </DialogTitle>

          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={decrement}
              className="border-2 border-white w-10 h-10 md:w-12 md:h-12 bg-red-600 text-white text-xl font-bold shadow-[4px_4px_0px_black] hover:bg-red-700 transition"
            >
              -
            </button>

            <input
              type="text"
              value={newLuckyNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={2}
              className="w-24 md:w-28 text-center text-lg font-bold text-green-400 bg-transparent border-4 border-green-400 focus:outline-none font-['Press_Start_2P'] 
                        appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />

            <button
              onClick={increment}
              className="border-2 border-white w-10 h-10 md:w-12 md:h-12 bg-green-600 text-white text-xl font-bold shadow-[4px_4px_0px_black] hover:bg-green-700 transition"
            >
              +
            </button>
          </div>

          <div className="flex items-center justify-center mt-3">
            <input
              type="checkbox"
              checked={applyToAll}
              onChange={() => setApplyToAll(!applyToAll)}
              className="w-4 h-4 border-2 border-white bg-gray-800 focus:ring-0 focus:outline-none cursor-pointer"
            />
            <label className="ml-2 text-xs text-white font-['Press_Start_2P'] cursor-pointer">
              {t("editForAll")}
            </label>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={onClose}
              className="border-2 border-white px-4 py-1 bg-black text-white shadow-[4px_4px_0px_black]"
            >
              {t("cancel")}
            </button>
            <button
              onClick={() => onSave(parseInt(newLuckyNumber, 10), applyToAll)}
              className="border-2 border-white px-4 py-1 bg-green-600 text-white shadow-[4px_4px_0px_black] hover:bg-green-700"
            >
              {t("confirm")}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
