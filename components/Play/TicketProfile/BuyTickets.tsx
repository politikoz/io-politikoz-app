"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const userKozBalance = 1000;
const userAdaBalance = 500;
const ticketPriceKoz = 50;
const ticketPriceAda = 2;

const mockPurchaseHistory: Purchase[] = [
  { tickets: 4, amountSpent: 200, currency: "KOZ", timestamp: "2024-02-20 14:32" },
  { tickets: 2, amountSpent: 100, currency: "KOZ", timestamp: "2024-02-18 10:15" },
  { tickets: 3, amountSpent: 6, currency: "ADA", timestamp: "2024-02-15 18:45" },
  { tickets: 1, amountSpent: 50, currency: "KOZ", timestamp: "2024-02-12 12:00" },
  { tickets: 5, amountSpent: 10, currency: "ADA", timestamp: "2024-02-10 08:20" },
];

interface Purchase {
  tickets: number;
  amountSpent: number;
  currency: "KOZ" | "ADA";
  timestamp: string;
}

export default function BuyTickets() {
  const t = useTranslations("TicketProfile");
  const [useKoz, setUseKoz] = useState(true);
  const [amountSpent, setAmountSpent] = useState(0);
  const [ticketAmount, setTicketAmount] = useState(0);
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>(mockPurchaseHistory);

  const ticketPrice = useKoz ? ticketPriceKoz : ticketPriceAda;
  const userBalance = useKoz ? userKozBalance : userAdaBalance;
  const currency = useKoz ? "KOZ" : "ADA";

  const mockBoostPercentage = 5;
  const mockAdaReward = 100;

  const handleTicketChange = (value: number) => {
    if (value < 0) return;
    const cost = value * ticketPrice;
    if (cost > userBalance) return;
    setTicketAmount(value);
    setAmountSpent(cost);
  };

  const handleCurrencyChange = (value: number) => {
    if (value < 0 || value > userBalance) return;
    setAmountSpent(value);
    setTicketAmount(Math.floor(value / ticketPrice));
  };

  const handlePurchase = () => {
    if (ticketAmount === 0) return;

    const newPurchase: Purchase = {
      tickets: ticketAmount,
      amountSpent: amountSpent,
      currency: currency,
      timestamp: new Date().toLocaleString(),
    };

    setPurchaseHistory([newPurchase, ...purchaseHistory]);

    alert(t("alert", { count: ticketAmount, amount: amountSpent, currency }));

    setAmountSpent(0);
    setTicketAmount(0);
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto bg-gray-900 text-white border-2 border-yellow-500 rounded-lg shadow-lg">
      {/* Descrição do Ticket com Imagem */}
      <div className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded flex flex-col sm:flex-row items-center gap-4">
        <img
          src="/images/assets/frontman.png"
          alt="Frontman Ticket"
          className="w-24 h-24 sm:w-21 sm:h-21 rounded border-2 border-yellow-400"
        />
        <div>
          <h3 className="text-lg font-bold text-yellow-300">Frontman Ticket</h3>
          <p className="text-sm text-gray-300 mt-1">
            {t("ticketDescription", {
              boostPercentage: mockBoostPercentage,
              adaReward: mockAdaReward,
            })}
          </p>
        </div>
      </div>

      {/* Alternância KOZ/ADA */}
      <div className="flex flex-col w-full bg-gray-800 p-2 rounded border border-gray-700 mb-4">
        <span className="text-sm font-bold text-yellow-300 mb-2">{t("paymentMethod")}</span>
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-bold text-gray-300">KOZ</span>
          <label className="relative w-16 flex items-center cursor-pointer">
            <input type="checkbox" className="hidden" checked={!useKoz} onChange={() => setUseKoz(!useKoz)} />
            <div className="w-12 h-6 bg-gray-700 rounded-full flex items-center p-1">
              <div
                className={`w-4 h-4 bg-yellow-400 rounded-full transition-transform ${
                  useKoz ? "translate-x-0" : "translate-x-6"
                }`}
              ></div>
            </div>
          </label>
          <span className="text-sm font-bold text-yellow-400">ADA</span>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-2">
        {t("yourBalance", { balance: userBalance, currency })}
      </p>

      {/* Input Tickets */}
      <div className="flex flex-col mb-4">
        <label className="text-sm font-bold text-yellow-300 mb-1">{t("tickets")}</label>
        <input
          type="number"
          value={ticketAmount}
          onChange={(e) => handleTicketChange(Number(e.target.value))}
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded outline-none"
        />
      </div>

      {/* Input Moeda */}
      <div className="flex flex-col mb-4">
        <label className="text-sm font-bold text-yellow-300 mb-1">
          {t("amountInCurrency", { currency })}
        </label>
        <input
          type="number"
          value={amountSpent}
          onChange={(e) => handleCurrencyChange(Number(e.target.value))}
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded outline-none"
        />
      </div>

      <p className="text-sm text-gray-300 mb-4">
        {t("pricePerTicket", { price: ticketPrice, currency })}
      </p>

      {/* Botão de Compra */}
      <button
        onClick={handlePurchase}
        className={`w-full px-4 py-2 font-bold text-black bg-yellow-400 rounded shadow-md transition ${
          ticketAmount > 0 ? "hover:bg-yellow-500" : "opacity-50 cursor-not-allowed"
        }`}
        disabled={ticketAmount === 0}
      >
        {t("buyButton")}
      </button>

      {/* Histórico */}
      {purchaseHistory.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-bold text-yellow-300 mb-2">{t("purchaseHistory")}</h3>
          <div className="bg-gray-800 p-3 rounded border border-gray-600 max-h-60 overflow-y-auto">
            {purchaseHistory.map((purchase, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row justify-between text-sm text-gray-300 py-1 border-b border-gray-700 last:border-0"
              >
                <span>{purchase.tickets} Frontman</span>
                <span>{purchase.amountSpent} {purchase.currency}</span>
                <span className="text-xs text-gray-400">{purchase.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
