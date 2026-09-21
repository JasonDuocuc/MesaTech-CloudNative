import { type Configuration, LogLevel } from "@azure/msal-browser";

// Los IDs de Entra ID se leen desde variables de entorno (.env.local, no versionado).
// Copia .env.example a .env.local y completa los valores de tu tenant.
function requerida(nombre: string): string {
    const valor = import.meta.env[nombre] as string | undefined;
    if (!valor) {
        throw new Error(
            `Falta la variable ${nombre}. Copia .env.example a .env.local y completa los valores.`
        );
    }
    return valor;
}

const FRONTEND_CLIENT_ID = requerida("VITE_FRONTEND_CLIENT_ID");
const TENANT_ID = requerida("VITE_TENANT_ID");
const API_CLIENT_ID = requerida("VITE_API_CLIENT_ID");
const REDIRECT_URI =
    (import.meta.env.VITE_REDIRECT_URI as string | undefined) ?? "http://localhost:3000";

export const msalConfig: Configuration = {
    auth: {
        clientId: FRONTEND_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${TENANT_ID}`,
        redirectUri: REDIRECT_URI,
        postLogoutRedirectUri: REDIRECT_URI,
    },
    cache: {
        cacheLocation: "sessionStorage",
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            },
        },
    },
};

// Scope acordado en el contrato de integración: el BFF exige SCOPE_access_as_user.
export const loginRequest = {
    scopes: [`api://${API_CLIENT_ID}/access_as_user`],
};

export const apiTokenRequest = {
    scopes: loginRequest.scopes,
};
