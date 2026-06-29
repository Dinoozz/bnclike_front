"use client";

import { useCallback, useRef } from "react";

import { sendGarageCommand } from "@/components/garage/garage-client";
import DualZoneTrigger from "@/components/garage/dual-zone-trigger";
import NotificationStack from "@/components/garage/notification-stack";

export default function ButtonDownCompletely() {
  const notifRef = useRef(null);

  const handleTrigger = useCallback(async () => {
    notifRef.current?.push("🔒 Requête close_completely envoyée…", "info");

    try {
      const response = await sendGarageCommand("closeCompletely");
      console.log("API DOWN_COMPLETELY response:", response);
      notifRef.current?.push("✅ Serveur : fermeture complète confirmée", "success");
    } catch (error) {
      console.error("Error with API DOWN_COMPLETELY request:", error);
      notifRef.current?.push("❌ Erreur : le serveur n'a pas répondu", "error");
    }
  }, []);

  return (
    <>
      <NotificationStack ref={notifRef} />
      <DualZoneTrigger onTrigger={handleTrigger} />
    </>
  );
}
