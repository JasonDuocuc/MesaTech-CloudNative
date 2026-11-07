import { msalInstance } from "../auth/msalInstance";
import { apiTokenRequest } from "../auth/authConfig";

const API_BASE_URL = "https://PENDIENTE-configurar-api-gateway.amazonaws.com";

async function getAccessToken(): Promise<string> {
    const account = msalInstance.getActiveAccount();
    if (!account) {
        throw new Error("No hay una cuenta activa. El usuario debe iniciar sesión.");
    }

    const response = await msalInstance.acquireTokenSilent({
        ...apiTokenRequest,
        account,
    });

    return response.accessToken;
}

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : (undefined as T);
}