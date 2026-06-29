"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { fetchGarageStatus } from "@/components/garage/garage-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function StatusInfo({ initialStatus = null }) {
  const [status, setStatus] = useState(initialStatus);

  const checkActiveStatus = useCallback(async () => {
    setStatus(null);

    try {
      await fetchGarageStatus();
      setStatus("green");
      return "green";
    } catch {
      setStatus("red");
      return "red";
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      checkActiveStatus();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [checkActiveStatus]);

  const statusLabel =
    status === "green" ? "Connecté" : status === "red" ? "Non connecté" : "...";

  return (
    <Dialog>
      <div className="fixed top-4 z-50 inline-flex w-fit items-center space-x-3 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 shadow-md">
        <div className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-200 select-none">
          Serveur Next → API Python locale
        </div>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="ml-2 rounded bg-gray-600 px-2 py-1 text-white hover:bg-gray-500"
          >
            Détails
          </Button>
        </DialogTrigger>
        <span className="font-medium text-white select-none">{statusLabel}</span>
        <button
          type="button"
          className="flex h-8 w-8 cursor-pointer items-center justify-center"
          onClick={checkActiveStatus}
          aria-label="Rafraichir le statut"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              status === "green"
                ? "bg-green-500"
                : status === "red"
                  ? "bg-red-500"
                  : "bg-gray-500"
            }`}
          >
            {status === null && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
          </div>
        </button>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connexion API Python</DialogTitle>
          <DialogDescription>
            Le navigateur communique uniquement avec Next.js. Le serveur Next
            contacte ensuite l&apos;API Python configuree sur localhost.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded border border-gray-600 bg-gray-700 p-3">
            <div className="space-y-1">
              <div className="text-sm font-medium text-white">Statut serveur</div>
              <div className="text-xs text-gray-300">
                Route interne: /api/garage/status
              </div>
            </div>
            <Badge
              className={
                status === "green"
                  ? "border-transparent bg-green-600 text-white"
                  : status === "red"
                    ? "border-transparent bg-red-600 text-white"
                    : "border-transparent bg-gray-600 text-white"
              }
            >
              {statusLabel}
            </Badge>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full bg-gray-600 text-white hover:bg-gray-500"
            onClick={checkActiveStatus}
          >
            <RefreshCw className="size-4" />
            Vérifier maintenant
          </Button>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="bg-gray-600 text-white hover:bg-gray-500"
            >
              Fermer
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
