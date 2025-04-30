import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useTranslations } from "next-intl";

interface LinkTicketsModalProps {
  onClose: () => void;
}

export default function LinkTicketsModal({ onClose }: LinkTicketsModalProps) {
  const t = useTranslations("TicketProfile");

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <DialogPanel className="relative z-10 border-4 border-white bg-gray-900 text-white p-6 shadow-[6px_6px_0px_black] max-w-md w-full">
        <DialogTitle className="text-center text-lg font-['Press_Start_2P'] mb-4">
          {t("title")}
        </DialogTitle>

        <p className="text-center text-sm text-gray-300">
          {t("description")}
        </p>

        <button
          onClick={onClose}
          className="w-full mt-6 border-2 border-white px-4 py-2 bg-red-600 text-white text-sm font-['Press_Start_2P'] shadow-[4px_4px_0px_black]"
        >
          {t("closeButton")}
        </button>
      </DialogPanel>
    </Dialog>
  );
}
