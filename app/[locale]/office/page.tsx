
"use client";

import OfficeView from "@/components/Play/OfficeView/OfficeView";

export default function OfficePage() {
  console.log("[OfficePage] Render");

  return (
    <div className="w-full h-full flex flex-col items-center">
      <OfficeView />
    </div>
  );
}

