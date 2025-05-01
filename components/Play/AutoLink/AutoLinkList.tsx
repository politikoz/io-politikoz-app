"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { AutoLinkConfigData, TicketDistribution } from "./AutoLinkTypes";
import { usePartiesData } from "@/hooks/usePartiesData";

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
  const { data: parties } = usePartiesData();

  const handleDelete = async (entityType: 'party' | 'politikoz' | 'random', entityId: string) => {
    setDeletingId(entityId);
    await onDelete(entityType, entityId);
    setDeletingId(null);
  };

  const DeleteButton = ({ entityType, entityId }: { entityType: 'party' | 'politikoz' | 'random', entityId: string }) => (
    <button
      onClick={() => handleDelete(entityType, entityId)}
      disabled={isDeleting && deletingId === entityId}
      className="ml-4 bg-red-600 px-2 py-1 text-[10px] text-white border border-white rounded hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-1"
    >
      {isDeleting && deletingId === entityId ? (
        <>
          <span className="animate-spin">⟳</span>          
        </>
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
      if (entityId === '-1') return null;
      
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
    if (!config.politikoz?.['-1']) return null;

    return (
      <div className="flex justify-between items-center bg-gray-700 p-2 rounded mb-2 text-xs">
        <div>
          <span className="font-bold text-yellow-400">{t("randomLabel")}</span>{" "}
          {renderDistributionText(config.politikoz['-1'])}
        </div>
        <DeleteButton entityType="random" entityId="-1" />
      </div>
    );
  };

  return (
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
  );
};

export default AutoLinkList;
