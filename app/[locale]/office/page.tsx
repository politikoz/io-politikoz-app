import { Suspense } from "react";
import OfficeViewClient from "./OfficeViewClient";

export default function OfficePage() {
  console.log("[OfficePage] Render");

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Suspense fallback={null}>
        <OfficeViewClient />
      </Suspense>
    </div>
  );
}