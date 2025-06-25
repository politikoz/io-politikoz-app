"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import AutoLinkList from "./AutoLinkList";
import AutoLinkProgress from "./AutoLinkProgress";
import AutoLinkPolitikozModal from "./AutoLinkPolitikozModal";
import AutoLinkPartiesModal from "./AutoLinkPartiesModal";
import AutoLinkRandomModal from "./AutoLinkRandomModal";
import AutoLinkPartyModal from "./AutoLinkPartyModal";
import { TicketType } from "@/types/AutoLinkConfigData";
import { AutoLinkConfigData } from "./AutoLinkTypes";
import { useAutoLinkConfig } from "@/hooks/useAutoLinkConfig";
import AuthenticatedAction from "@/components/Auth/AuthenticatedAction";

type EntityType = 'party' | 'politikoz' | 'random';

const TICKET_TYPES: TicketType[] = [
  "BRIBER", 
  "CORRUPT", 
  "FRONTMAN",
  "FRONTMAN_BOOSTED_ELECTION_ONLY",
  "LAUNDERER", 
  "LOBBYIST"
];

export default function AutoLinkConfig() {
  const t = useTranslations("AutoLink.Config");
  const { 
    data: config, 
    saveConfig, 
    deleteConfig,
    isDeleting // Get isDeleting from hook
  } = useAutoLinkConfig();
  const [modalType, setModalType] = useState<string | null>(null);

  const ticketTotals = useMemo(() => {
    const totals: Record<TicketType, number> = {} as Record<TicketType, number>;
    
    TICKET_TYPES.forEach(ticketType => {
      // Sum party distributions
      const partyTotal = Object.values(config.party || {})
        .reduce((sum, tickets) => sum + (tickets[ticketType] || 0), 0);
      
      // Sum politikoz distributions
      const politikozTotal = Object.values(config.politikoz || {})
        .reduce((sum, tickets) => sum + (tickets[ticketType] || 0), 0);

      totals[ticketType] = partyTotal + politikozTotal;
    });

    return totals;
  }, [config]);

  const usedPercentage = useMemo(() => {
    let totalUsed = 0;
    const totalTypes = TICKET_TYPES.length;    

    TICKET_TYPES.forEach(ticketType => {
      // Get party percentages
      const partyValues = Object.values(config.party || {})
        .map(tickets => tickets[ticketType] || 0);
      
      // Get politikoz percentages
      const politikozValues = Object.values(config.politikoz || {})
        .map(tickets => tickets[ticketType] || 0);
      
      // Sum all values for this ticket type
      const totalForType = [...partyValues, ...politikozValues]
        .reduce((sum, val) => sum + val, 0);

      totalUsed += totalForType * 100; // Convert decimal to percentage
    });

    
    const finalPercentage = (totalUsed / (totalTypes * 100)) * 100;

    return finalPercentage;
  }, [config, TICKET_TYPES]);

  const handleSaveConfig = async (newConfig: AutoLinkConfigData) => {
    try {
      // A configuração já vem corretamente montada do modal
      await saveConfig(newConfig);
    } catch (error) {
      
    }
  };

  const handleDeleteConfig = async (entityType: EntityType, entityId: string) => {
    try {
      await deleteConfig({ entityType, entityId });
    } catch (error) {
      
    }
  };

  const closeModal = () => setModalType(null);

  return (
    <div className="relative flex flex-col w-full max-w-4xl mx-auto border-4 border-black bg-gray-900 text-white p-4 shadow-lg h-full">
      <h2 className="text-xl font-bold text-yellow-300">{t("title")}</h2>
      <p className="text-sm text-gray-400 mb-4">{t("description")}</p>
      
      <AutoLinkProgress usedPercentage={usedPercentage} />

      {/* Grid de botões */}
      <div className="grid grid-cols-2 gap-4 my-4 mt-4">
        <button 
          onClick={() => setModalType("specificPolitikoz")}
          className="bg-blue-600 text-white py-2 border-2 border-white hover:bg-blue-700"
        >
          {t("linkToSpecificPolitikoz")}
        </button>

        <button 
          onClick={() => setModalType("randomPolitikoz")} 
          className="bg-blue-600 text-white py-2 border-2 border-white hover:bg-blue-700"
        >
          {t("distributeToRandomPolitikoz")}
        </button>

        <button
          onClick={() => setModalType("myParty")}
          className="bg-green-600 text-white py-2 border-2 border-white hover:bg-green-700"
        >
          {t("linkToMyParty")}
        </button>

        <button 
          onClick={() => setModalType("parties")} 
          className="bg-green-600 text-white py-2 border-2 border-white hover:bg-green-700"
        >
          {t("distributeAmongParties")}
        </button>
      </div>

      {/* Lista com título original e container com scroll */}
      <h3 className="mt-10 text-lg font-bold text-yellow-300">{t("configuredAutoLinks")}</h3>    
      <div className="h-auto overflow-y-auto max-h-40 border-t border-gray-700 pt-2">        
        <AutoLinkList 
          config={config} 
          onDelete={handleDeleteConfig} 
          isDeleting={isDeleting}
        />
      </div>

      {/* Modal com autenticação */}
      {modalType && (
        <AuthenticatedAction onCancel={closeModal}>
          {modalType === "specificPolitikoz" && (
            <AutoLinkPolitikozModal 
              isOpen={true}
              closeModal={closeModal} 
              onSave={handleSaveConfig} 
            />
          )}
          {modalType === "parties" && (
            <AutoLinkPartiesModal isOpen={true} closeModal={closeModal} onSave={handleSaveConfig} />
          )}
          {modalType === "randomPolitikoz" && (
            <AutoLinkRandomModal isOpen={true} closeModal={closeModal} onSave={handleSaveConfig} />
          )}
          {modalType === "myParty" && (
            <AutoLinkPartyModal isOpen={true} closeModal={closeModal} onSave={handleSaveConfig} />
          )}   
        </AuthenticatedAction>
      )}
    </div>
  );
}
