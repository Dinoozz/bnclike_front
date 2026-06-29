const DEFAULT_PYTHON_API_URL = "http://127.0.0.1:5000";

const GARAGE_ACTIONS = {
  open: {
    method: "POST",
    endpoint: "/open",
  },
  close: {
    method: "POST",
    endpoint: "/close",
  },
  closeCompletely: {
    method: "POST",
    endpoint: "/close_completely",
  },
};

export class GarageApiError extends Error {
  constructor(message, statusCode = 502, payload = null) {
    super(message);
    this.name = "GarageApiError";
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

function getPythonApiUrl() {
  return process.env.PYTHON_API_URL || DEFAULT_PYTHON_API_URL;
}

function getPythonApiKey() {
  return process.env.PYTHON_API_KEY || "test";
}

function buildUrl(endpoint) {
  const baseUrl = getPythonApiUrl().endsWith("/")
    ? getPythonApiUrl()
    : `${getPythonApiUrl()}/`;

  return new URL(endpoint.replace(/^\//, ""), baseUrl);
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function requestGarage(endpoint, { method = "GET" } = {}) {
  const response = await fetch(buildUrl(endpoint), {
    method,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": getPythonApiKey(),
    },
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new GarageApiError(
      payload?.message || "L'API Python a retourne une erreur.",
      response.status,
      payload,
    );
  }

  return {
    payload,
    statusCode: response.status,
  };
}

export async function getGarageStatus() {
  try {
    const result = await requestGarage("/status");

    return {
      available: true,
      payload: result.payload,
      statusCode: result.statusCode,
      error: null,
    };
  } catch (error) {
    return {
      available: false,
      payload: error.payload || null,
      statusCode: error.statusCode || 503,
      error: error.message || "Impossible de joindre l'API Python.",
    };
  }
}

export async function runGarageAction(action) {
  const config = GARAGE_ACTIONS[action];

  if (!config) {
    throw new GarageApiError("Action garage inconnue.", 400);
  }

  return requestGarage(config.endpoint, { method: config.method });
}
