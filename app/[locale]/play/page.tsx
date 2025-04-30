import React from "react";
import InsideBuilding from "@/components/Play/InsideBuilding/InsideBuilding";

export default function Play() {
  return (
    <div className="flex flex-col flex-1 w-full bg-[#43A4E7]"> {/* Fundo inicial adicionado */}
      {/* InsideBuilding */}
      <div className="flex-1 w-full overflow-y-auto">
        <div className="w-full mx-auto px-0 lg:px-[120px] max-w-full lg:max-w-[1200px]">
          <InsideBuilding />
        </div>
      </div>
    </div>
  );
}
