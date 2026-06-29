"use client";

import ButtonDown from "@/components/garage/button-down";
import ButtonDownCompletely from "@/components/garage/button-down-completely";
import ButtonUp from "@/components/garage/button-up";
import StatusInfo from "@/components/garage/status-info";

export default function GarageRemote({ initialStatus }) {
  return (
    <main className="relative flex min-h-dvh max-h-dvh flex-col items-center justify-around overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 select-none">
      <ButtonDownCompletely />

      <StatusInfo initialStatus={initialStatus} />

      <div className="z-10 mb-10 rounded-lg bg-gray-700 px-8 py-4 shadow-xl">
        <h1 className="text-center text-4xl font-bold tracking-wider text-white select-none">
          🚪 Garage Remote
        </h1>
      </div>

      <div className="z-10 flex flex-col items-center justify-center space-y-12 rounded-3xl border border-gray-600 bg-gray-700 p-10 shadow-2xl">
        <ButtonUp />
        <ButtonDown />
      </div>
    </main>
  );
}
