"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { AutoLinkConfigData, TicketDistribution } from "./AutoLinkTypes";
import { usePartiesData } from "@/hooks/usePartiesData";
import DeleteConfirmModal from "./DeleteConfirmModal";

const formatPolitikozId = (id: string) => id.padStart(5, '0');

interface Props {
  config: AutoLinkConfigData;
  onDelete: (entityType: 'party' | 'politikoz' | 'random', entityId: string) => void;
  isDeleting: boolean;
}

const formatPercentage = (value: number) => `${(value * 100).toFixed(0)}%`;

const AutoLinkList: React.FC<Props> = ({ config, onDelete, isDeleting }) => {
  const t = useTranslations("AutoLink.List");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    show: boolean;
    type: 'party' | 'politikoz' | 'random';
    id: string;
    isDeleting: boolean;
  } | null>(null);
  const { data: parties } = usePartiesData();

  const handleDeleteClick = (entityType: 'party' | 'politikoz' | 'random', entityId: string) => {
    setShowDeleteConfirm({
      show: true,
      type: entityType,
      id: entityId,
      isDeleting: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!showDeleteConfirm) return;

    setDeletingId(showDeleteConfirm.id);
    setShowDeleteConfirm(prev => prev ? { ...prev, isDeleting: true } : null);

    try {
      await onDelete(showDeleteConfirm.type, showDeleteConfirm.id);
    } catch (error) {
      console.error('Delete failed:', error);
      setShowDeleteConfirm(prev => prev ? { ...prev, isDeleting: false } : null);
    } finally {
      // Aguarda um pequeno delay antes de fechar o modal
      await new Promise(resolve => setTimeout(resolve, 500));
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const DeleteButton = ({ entityType, entityId }: { entityType: 'party' | 'politikoz' | 'random', entityId: string }) => (
    <button
      onClick={() => handleDeleteClick(entityType, entityId)}
      disabled={isDeleting && deletingId === entityId}
      className="ml-4 bg-red-600 px-2 py-1 text-[10px] text-white border border-white rounded hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-1"
    >
      {isDeleting && deletingId === entityId ? (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        t("delete")
      )}
    </button>
  );

  const renderDistributionText = (distribution: TicketDistribution) => {
    return Object.entries(distribution)
      .map(([ticketType, value]) => `${ticketType} ${formatPercentage(value)}`)
      .join(" | ");
  };

  const renderPolitikozConfigs = () => {
    if (!config.politikoz) return null;
    
    return Object.entries(config.politikoz).map(([entityId, ticketDistribution]) => {
      if (entityId === 'random') return null; // Changed from '-1' to 'random'
      
      const formattedId = formatPolitikozId(entityId);
      
      return (
        <div key={`politikoz-${entityId}`} className="flex justify-between items-center bg-gray-700 p-2 rounded mb-2 text-xs">
          <div>
            <span className="font-bold text-yellow-400">
              {t("politikozLabel", { id: formattedId })}
            </span>{" "}
            {renderDistributionText(ticketDistribution)}
          </div>
          <DeleteButton entityType="politikoz" entityId={entityId} />
        </div>
      );
    });
  };

  const renderPartyConfigs = () => {
    if (!config.party || !parties) return null;

    return Object.entries(config.party).map(([entityId, ticketDistribution]) => {
      const party = parties.find(p => p.id.toString() === entityId);
      const partyAcronym = party?.acronym || entityId;

      return (
        <div
          key={`party-${entityId}`}
          className="flex justify-between items-center bg-gray-700 p-2 rounded mb-2 text-xs"
        >
          <div>
            <span className="font-bold text-yellow-400">
              {t("partyLabel", { id: partyAcronym })}
            </span>{" "}
            {renderDistributionText(ticketDistribution)}
          </div>
          <DeleteButton entityType="party" entityId={entityId} />
        </div>
      );
    });
  };

  const renderRandomConfig = () => {
    if (!config.politikoz?.random) return null; // Changed from '['-1']' to '.random'

    return (
      <div className="flex justify-between items-center bg-gray-700 p-2 rounded mb-2 text-xs">
        <div>
          <span className="font-bold text-yellow-400">{t("randomLabel")}</span>{" "}
          {renderDistributionText(config.politikoz.random)}
        </div>
        <DeleteButton entityType="politikoz" entityId="random" /> {/* Changed from '-1' to 'random' */}
      </div>
    );
  };

  return (
    <>
      <div className="p-4 bg-gray-800 border-2 text-xs">
        {!config.politikoz && !config.party ? (
          <p className="text-gray-400">{t("empty")}</p>
        ) : (
          <>
            {renderRandomConfig()}
            {renderPolitikozConfigs()}
            {renderPartyConfigs()}
          </>
        )}
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirm.show}
          onConfirm={handleConfirmDelete}
          onCancel={() => !showDeleteConfirm.isDeleting && setShowDeleteConfirm(null)}
          type={showDeleteConfirm.type}
          itemId={showDeleteConfirm.id}
          isDeleting={showDeleteConfirm.isDeleting}
        />
      )}
    </>
  );
};

export default AutoLinkList;
