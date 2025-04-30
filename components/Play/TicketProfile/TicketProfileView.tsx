"use client";

import { useState } from "react";
import TicketButtons from "./TicketButtons";
import TicketProfile from "./TicketProfile";
import BuyTickets from "./BuyTickets";

export default function TicketProfileView() {
  const [selectedView, setSelectedView] = useState<string>("profile"); // 🔹 "profile" é o padrão

  return (
    <div className="flex flex-col items-center w-full">
      {/* 🔹 Contêiner Principal - Mantém a mesma largura e altura para estabilidade */}
      <div className="w-full flex flex-col items-center p-4 max-w-4xl border-4 border-black bg-gray-900 shadow-[6px_6px_0px_black] min-h-[730px]">
        {/* 🔹 Renderiza a Seção Ativa (Todas têm a mesma largura e altura) */}
        <div className="w-full flex flex-col flex-1">
          {selectedView === "profile" && <TicketProfile />}
          {selectedView === "buy" && <BuyTickets />}
        </div>
      </div>

      {/* 🔹 Botões de Navegação - Fora do Contêiner Principal */}
      <div className="w-full mt-4">
        <TicketButtons selectedView={selectedView} setSelectedView={setSelectedView} />
      </div>
    </div>
  );
}
