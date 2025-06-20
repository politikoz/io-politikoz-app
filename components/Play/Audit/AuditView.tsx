"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useVerification } from "@/hooks/useVerification";
import { useElectionMerkle } from "@/hooks/useElectionMerkle";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

export default function AuditView() {
  const t = useTranslations("Audit");
  const [ticketNumber, setTicketNumber] = useState("");
  const [numberToVerify, setNumberToVerify] = useState("");
  const [selectedElectionId, setSelectedElectionId] = useState<number>();
  const { elections, isLoading: isLoadingElections } = useElectionMerkle();
  const { verification, isLoading } = useVerification(ticketNumber, selectedElectionId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 7);
    setTicketNumber(value);
  };

  const handleValidate = () => {
    if (ticketNumber) {
      setNumberToVerify(ticketNumber.padStart(7, '0'));
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Merkle Tree Explanation Section */}
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-500 mb-8">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 font-pixel">
          {t("howItWorks")}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <p className="text-white mb-4 leading-relaxed">
              {t("merkleExplanation")}
            </p>
            <p className="text-gray-400 text-sm">
              {t("sourceMention")}
              <a 
                href="https://github.com/cardano-foundation/merkle-tree-java"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 ml-1"
              >
                Cardano Foundation
              </a>
            </p>
          </div>         
        </div>
      </div>

      {/* Blockchain Root Section */}
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-blue-500 mb-8">
        <h3 className="text-xl font-bold text-blue-400 mb-4 font-pixel">
          {t("blockchainProof")}
        </h3>
        
        <div className="mb-4">
          <select
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            value={selectedElectionId || ''}
            onChange={(e) => setSelectedElectionId(Number(e.target.value))}
          >
            <option value="">{t("selectElection")}</option>
            {elections?.map((election) => (
              <option key={election.electionId} value={election.electionId}>
                {`${formatDate(election.electionStartDate)} - ${election.txHashMerkle.slice(0, 8)}...`}
              </option>
            ))}
          </select>
        </div>

        {selectedElectionId && elections && (
          <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <p className="text-gray-400 text-sm mb-2">{t("transactionLabel")}</p>
            <a 
              href={`https://cardanoscan.io/transaction/${elections.find(e => e.electionId === selectedElectionId)?.txHashMerkle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-green-400 font-mono text-sm break-all hover:text-green-300 transition-colors"
            >
              <span>{elections.find(e => e.electionId === selectedElectionId)?.txHashMerkle}</span>
              <ArrowTopRightOnSquareIcon className="w-4 h-4 inline-block group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        )}
      </div>

      {/* Validation Section */}
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-purple-500">
        <h3 className="text-xl font-bold text-purple-400 mb-4 font-pixel">
          {t("validateTicket")}
        </h3>
        
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={ticketNumber}
            onChange={handleInputChange}
            placeholder={t("ticketPlaceholder")}
            className="flex-1 bg-gray-800 border-2 border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none font-mono"
            maxLength={7}
            pattern="\d*"
          />
          <button
            onClick={handleValidate}
            disabled={isLoading || !ticketNumber}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
          >
            {isLoading ? t("validating") : t("validate")}
          </button>
        </div>

        {/* Only show verification result if a number has been verified */}
        {numberToVerify && verification && (
          <div className={`p-4 rounded-lg ${verification.valid ? 'bg-green-900/50 border-2 border-green-500' : 'bg-red-900/50 border-2 border-red-500'}`}>
            <h4 className="font-bold text-lg mb-2 text-white">
              {verification.valid ? t("validTicket") : t("invalidTicket")}
            </h4>
            
            <div className="text-gray-300 mb-4">
              {t("ticketNumber")}: <span className="font-mono">{numberToVerify}</span>
            </div>
            
            {verification.proof && verification.proof.length > 0 && (
              <div className="mt-4">
                <h5 className="text-white font-bold mb-2">{t("proofDetails")}</h5>
                <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs text-gray-300 font-mono">
                    {JSON.stringify(verification.proof, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}