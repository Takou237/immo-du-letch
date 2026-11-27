/**
 * Loads Google Identity Services (GIS) and requests an OAuth 2.0 access token
 * via the official Google account chooser popup.
 */

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleTokenClient = {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: (error: { type: string; message?: string }) => void;
          }) => GoogleTokenClient;
        };
      };
    };
  }
}

let gisLoadPromise: Promise<void> | null = null;

function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }
  if (gisLoadPromise) {
    return gisLoadPromise;
  }

  gisLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Impossible de charger Google Sign-In.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gisLoadPromise = null;
      reject(new Error("Impossible de charger le script Google Identity Services."));
    };
    document.head.appendChild(script);
  });

  return gisLoadPromise;
}

export async function requestGoogleAccessToken(clientId: string): Promise<string> {
  await loadGoogleIdentityScript();

  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) {
    throw new Error("Service Google OAuth indisponible.");
  }

  return new Promise<string>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error_description || "Connexion Google annulée."));
          return;
        }
        if (!response.access_token) {
          reject(new Error("Aucun jeton reçu de Google."));
          return;
        }
        resolve(response.access_token);
      },
      error_callback: (err) => {
        reject(new Error(err.message || "Popup Google fermée ou bloquée."));
      },
    });

    client.requestAccessToken({ prompt: "select_account" });
  });
}
