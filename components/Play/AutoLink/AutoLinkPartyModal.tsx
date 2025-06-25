import { useState } from "react";
import AutoLinkDistribution from "./AutoLinkDistribution";
import { AutoLinkConfigData, TicketDistribution } from "./AutoLinkTypes";
import { useTranslations } from "next-intl";
import { useAutoLinkConfig } from "@/hooks/useAutoLinkConfig";

interface AutoLinkPartyModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSave: (config: AutoLinkConfigData) => void;
}

export default function AutoLinkPartyModal({ isOpen, closeModal, onSave }: AutoLinkPartyModalProps) {
  const [ticketDistribution, setTicketDistribution] = useState<TicketDistribution>({});
  const [isSaving, setIsSaving] = useState(false);
  const t = useTranslations("AutoLink.ModalParty");
  const { data: currentConfig } = useAutoLinkConfig();

  if (!isOpen) return null;

  const saveConfig = async () => {
    if (Object.values(ticketDistribution).reduce((acc, p) => acc + p, 0) === 0) return;

    try {
      setIsSaving(true);
      const updatedConfig = { ...currentConfig };
      // Add party-specific logic here
      await onSave(updatedConfig);
      setTicketDistribution({});
      closeModal();
    } catch (error) {
      
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 border-4 border-black shadow-lg max-w-3xl w-full rounded-lg relative">
        <h2 className="text-xl font-bold text-yellow-300 mb-2">
          {t("title")}
        </h2>
        
        <p className="text-sm text-gray-400 mb-4">
          {t("description")}
        </p>

        <AutoLinkDistribution
          entityType="party"
          ticketDistribution={ticketDistribution}
          setTicketDistribution={setTicketDistribution}
        />

        <div className="flex justify-between mt-6">
          <button 
            onClick={closeModal} 
            className="bg-red-600 text-white px-4 py-2 border-2 border-white rounded hover:bg-red-700"
            disabled={isSaving}
          >
            {t("cancel")}
          </button>
          <button 
            onClick={saveConfig} 
            disabled={isSaving}
            className="bg-green-600 text-white px-4 py-2 border-2 border-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            {isSaving && (
              <span className="animate-spin">⟳</span>
            )}
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}