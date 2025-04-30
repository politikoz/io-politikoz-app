// /MiniGames/Blackjack21/ResultModal.tsx
export default function ResultModal({
    result,
    onRestart,
  }: {
    result: string;
    onRestart: () => void;
  }) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
        <div className="bg-gray-900 text-white p-6 rounded-lg border-4 border-yellow-400 w-full max-w-sm text-center">
          <h2 className="text-xl font-bold mb-4 text-yellow-300">Resultado</h2>
          <p className="text-lg mb-6">{result}</p>
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-green-500 text-black font-bold rounded"
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }
  