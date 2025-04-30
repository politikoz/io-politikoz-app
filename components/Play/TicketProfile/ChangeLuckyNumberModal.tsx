import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { useChangeLuckyNumber } from "@/hooks/useChangeLuckyNumber";
import { Ticket } from "@/types/TicketData"; // Import the Ticket interface

interface ChangeLuckyNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTickets: Ticket[]; // Use the imported Ticket interface
  onSave: (newValue: string) => void;
}

export default function ChangeLuckyNumberModal({
  isOpen,
  onClose,
  selectedTickets,
  onSave,
}: ChangeLuckyNumberModalProps) {
  const t = useTranslations("TicketProfile");
  const [newLuckyNumber, setNewLuckyNumber] = useState<string>("00");
  const changeLuckyNumber = useChangeLuckyNumber();
  const [showSuccess, setShowSuccess] = useState(false);

  const increment = () => {
    setNewLuckyNumber((prev) => {
      let num = parseInt(prev || "0", 10);
      return num < 99 ? (num + 1).toString().padStart(2, '0') : "99";
    });
  };

  const decrement = () => {
    setNewLuckyNumber((prev) => {
      let num = parseInt(prev || "0", 10);
      return num > 0 ? (num - 1).toString().padStart(2, '0') : "00";
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

  const handleSave = async () => {
    try {
      await changeLuckyNumber.mutateAsync({
        ticketIds: selectedTickets.map(ticket => ticket.id),
        luckyNumber: newLuckyNumber
      });
      setShowSuccess(true);
      onSave(newLuckyNumber); // Chama onSave para desmarcar os tickets no componente pai
      
      // Close modal and reset success state after 3 seconds
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('API Response Error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-80" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="border-4 border-white bg-gray-900 p-6 shadow-[6px_6px_0px_black] w-64 text-center">
          <DialogTitle className="text-yellow-300 font-['Press_Start_2P'] text-sm mb-4">
            {t("changeLuckyNumber")}
          </DialogTitle>

          {!showSuccess ? (
            <>
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

              <p className="text-xs text-gray-400 mt-4">
                {t("selectedTickets")}: {selectedTickets.length}
              </p>

              {changeLuckyNumber.isError && (
                <div className="mt-4 p-2 bg-red-600 text-white text-sm rounded">
                  {t("luckyNumberChangeError")}
                </div>
              )}

              <div className="flex justify-between mt-4">
                <button
                  onClick={onClose}
                  className="border-2 border-white px-4 py-1 bg-black text-white shadow-[4px_4px_0px_black]"
                  disabled={changeLuckyNumber.isPending}
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={changeLuckyNumber.isPending}
                  className="border-2 border-white px-4 py-1 bg-green-600 text-white shadow-[4px_4px_0px_black] hover:bg-green-700 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                >
                  {changeLuckyNumber.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    t("confirm")
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 p-2 bg-green-600 text-white text-sm rounded">
              {t("luckyNumberChangeSuccess")}
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}