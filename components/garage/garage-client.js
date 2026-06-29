const COMMAND_ENDPOINTS = {
  open: "/api/garage/open",
  close: "/api/garage/close",
  closeCompletely: "/api/garage/close-completely",
};

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function sendGarageCommand(command) {
  const endpoint = COMMAND_ENDPOINTS[command];

  if (!endpoint) {
    throw new Error("Commande garage inconnue.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
  });
  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload?.error || "La commande garage a echoue.");
  }

  return payload;
}

export async function fetchGarageStatus() {
  const response = await fetch("/api/garage/status", {
    method: "GET",
    cache: "no-store",
  });
  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload?.error || "L'API garage est indisponible.");
  }

  return payload;
}
