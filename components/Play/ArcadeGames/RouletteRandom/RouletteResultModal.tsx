"use client";

// /MiniGames/RouletteRandom/RouletteResultModal.tsx

export default function RouletteResultModal({
  number,
  success,
  onClose,
}: {
  number: number;
  success: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-4 border-yellow-500 p-6 rounded-lg text-center text-white w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-yellow-300">Resultado</h2>
        <p className="text-lg mb-2">
          Número sorteado: <span className="font-bold">{number}</span>
        </p>
        <p
          className={`text-xl font-bold ${
            success ? "text-green-400" : "text-red-400"
          }`}
        >
          {success ? "🎉 Você venceu!" : "😢 Você perdeu."}
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-yellow-400 text-black font-bold rounded"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
