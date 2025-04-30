"use client";

export default function RaceDetailModal({
  block,
  onClose,
}: {
  block: { block: number; horses: number[]; time: string };
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 border-4 border-yellow-400 p-6 rounded-lg w-full max-w-md text-white relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-yellow-300 mb-4">
          Block #{block.block}
        </h2>
        <p><strong>Time:</strong> {block.time}</p>
        <p className="mt-2"><strong>Sorteados:</strong></p>
        <ul className="list-disc list-inside">
          {block.horses.map((h) => (
            <li key={h}>Horse {h}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
