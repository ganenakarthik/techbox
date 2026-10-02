import React from "react";
import { MaintenanceView } from "@/components/maintenance/MaintenanceView";
import { MAINTENANCE_CONFIG } from "@/config/maintenance";

export default function Page() {
  if (MAINTENANCE_CONFIG.enabled) {
    return <MaintenanceView />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center">
      <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h1 className="text-2xl font-black text-[#ff6a00]">Partsly Hardware Platform</h1>
        <p className="text-xs text-zinc-400">System online.</p>
      </div>
    </div>
  );
}
