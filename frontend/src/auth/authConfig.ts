import { type Configuration, LogLevel } from "@azure/msal-browser";

const FRONTEND_CLIENT_ID = "625a158e-2d47-47cb-9729-8cda1ab10940";
const TENANT_ID = "b1505d07-62a1-4611-a819-1a97141f1284";
const API_CLIENT_ID = "1dfc072d-b46e-46b1-84b5-03a59cc145b0";

export const msalConfig: Configuration = {
    auth: {
        clientId: FRONTEND_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${TENANT_ID}`,
        redirectUri: "http://localhost:3000",
        postLogoutRedirectUri: "http://localhost:3000",
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

export const loginRequest = {
    scopes: [
        `api://${API_CLIENT_ID}/Solicitudes.Read`,
        `api://${API_CLIENT_ID}/Solicitudes.Write`,
        `api://${API_CLIENT_ID}/Catalogo.Read`,
        `api://${API_CLIENT_ID}/Catalogo.Write`,
    ],
};

export const apiTokenRequest = {
    scopes: loginRequest.scopes,
};