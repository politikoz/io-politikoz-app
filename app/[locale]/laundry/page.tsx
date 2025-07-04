import { Suspense } from "react";
import LaundryViewClient from "./LaundryViewClient";

export default function LaundryPage() {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <Suspense fallback={null}>
        <LaundryViewClient />
      </Suspense>
    </div>
  );
}
