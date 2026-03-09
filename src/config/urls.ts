const normalizeUrl = (url: string): string => url.replace(/\/+$/, "");

const DEFAULT_BACKEND_URL = "https://wiz-app-production.up.railway.app";
const DEFAULT_FRONTEND_URL = "https://wiz-app.up.railway.app";

export const BACKEND_URL = normalizeUrl(
  process.env.REACT_APP_BACKEND_URL || DEFAULT_BACKEND_URL,
);

export const FRONTEND_URL = normalizeUrl(
  process.env.REACT_APP_FRONTEND_URL || DEFAULT_FRONTEND_URL,
);

export const BACKEND_WS_URL = BACKEND_URL.replace(/^http/i, "ws");
