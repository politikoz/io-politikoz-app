"use client";

import { useState } from "react";
import Card from "./Card";
import ResultModal from "./ResultModal";
import HistoryCards from "./HistoryCards";
import HistoryDetailModal from "./HistoryDetailModal";
import { getRandomCardFromBlock } from "./BlockDraw";

interface BlockDrawRecord {
  block: number;
  time: string;
  number: number;
}

function calculateHandTotal(cards: number[]): number {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    if (card === 1) {
      total += 11;
      aces += 1;
    } else {
      total += card;
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

export default function Blackjack() {
  const [playerCards, setPlayerCards] = useState<number[]>([]);
  const [dealerCards, setDealerCards] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [blockHistory, setBlockHistory] = useState<BlockDrawRecord[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockDrawRecord | null>(null);

  const drawCard = (): number => {
    const number = getRandomCardFromBlock();
    const newBlock: BlockDrawRecord = {
      block: (blockHistory[0]?.block || 1000) + 1,
      time: new Date().toLocaleTimeString(),
      number,
    };
    setBlockHistory((prev) => [newBlock, ...prev]);
    return number;
  };

  const startGame = () => {
    const p1 = drawCard();
    const p2 = drawCard();
    const d1 = drawCard();
    const d2 = drawCard();

    setPlayerCards([p1, p2]);
    setDealerCards([d1, d2]);
    setResult(null);
    setPlayerTurn(true);
  };

  const handleHit = () => {
    const newCard = drawCard();
    const newCards = [...playerCards, newCard];
    const newTotal = calculateHandTotal(newCards);

    setPlayerCards(newCards);

    if (newTotal === 21) {
      setResult("🎯 21 cravado! Vitória!");
      setPlayerTurn(false);
    } else if (newTotal > 21) {
      setResult("💥 Você estourou! Derrota.");
      setPlayerTurn(false);
    }
  };

  const handleStand = () => {
    setPlayerTurn(false);
    let dealer = [...dealerCards];
  
    const playerTotal = calculateHandTotal(playerCards);
  
    while (true) {
      const dealerTotal = calculateHandTotal(dealer);
  
      if (dealerTotal >= 17 && dealerTotal >= playerTotal) {
        break;
      }
  
      if (dealerTotal >= 21) {
        break;
      }
  
      const newCard = drawCard();
      dealer.push(newCard);
    }
  
    setDealerCards(dealer);
  
    const finalDealerTotal = calculateHandTotal(dealer);
  
    const outcome =
      finalDealerTotal > 21
        ? "Dealer estourou! Você venceu!"
        : finalDealerTotal > playerTotal
        ? "Você perdeu."
        : finalDealerTotal < playerTotal
        ? "Você venceu!"
        : "Empate.";
  
    setResult(`🎯 ${outcome}`);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-gray-900 text-white border-4 border-yellow-500 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">🃏 Blackjack 21</h2>

      {/* Dealer */}
      <div className="mb-4 w-full">
        <h3 className="text-lg font-bold mb-1">🤖 Dealer</h3>
        <div className="flex gap-2">
          {dealerCards.map((val, idx) => (
            <Card key={idx} value={val} />
          ))}
        </div>
        <p className="text-sm mt-1">Total: {calculateHandTotal(dealerCards)}</p>
      </div>

      {/* Player */}
      <div className="mb-4 w-full">
        <h3 className="text-lg font-bold mb-1">🧍 Você</h3>
        <div className="flex gap-2">
          {playerCards.map((val, idx) => (
            <Card key={idx} value={val} />
          ))}
        </div>
        <p className="text-sm mt-1">Total: {calculateHandTotal(playerCards)}</p>
      </div>

      <div className="flex gap-4 mt-2">
        {playerCards.length === 0 ? (
          <button
            onClick={startGame}
            className="bg-green-500 text-black px-4 py-2 rounded font-bold"
          >
            Iniciar Jogo
          </button>
        ) : playerTurn ? (
          <>
            <button
              onClick={handleHit}
              className="bg-yellow-400 text-black px-4 py-2 rounded font-bold"
            >
              Pedir Carta
            </button>
            <button
              onClick={handleStand}
              className="bg-red-500 text-white px-4 py-2 rounded font-bold"
            >
              Parar
            </button>
          </>
        ) : null}
      </div>

      {result && (
        <ResultModal
          result={result}
          onRestart={() => {
            setPlayerCards([]);
            setDealerCards([]);
            setResult(null);
            setPlayerTurn(true);
          }}
        />
      )}

      {blockHistory.length > 0 && (
        <div className="w-full">
          <HistoryCards history={blockHistory} onSelect={(entry) => setSelectedBlock(entry)} />
        </div>
      )}

      {selectedBlock && (
        <HistoryDetailModal
          data={selectedBlock}
          onClose={() => setSelectedBlock(null)}
        />
      )}
    </div>
  );
}
