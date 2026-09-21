import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalInstance } from "../auth/msalInstance";
import { apiTokenRequest } from "../auth/authConfig";

// En desarrollo queda vacío y el proxy de Vite reenvía /v1 y /v2 al BFF (localhost:8080).
// En producción apunta a la URL de AWS API Gateway.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

export class ApiError extends Error {
    status: number;
    errores?: Record<string, string>;

    constructor(status: number, mensaje: string, errores?: Record<string, string>) {
        super(mensaje);
        this.status = status;
        this.errores = errores;
    }
}

interface CuerpoError {
    mensaje?: string;
    error?: string;
    errores?: Record<string, string>;
}

async function obtenerToken(): Promise<string> {
    const cuenta = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];
    if (!cuenta) {
        throw new ApiError(401, "No hay una sesión activa. Inicia sesión nuevamente.");
    }
    try {
        const respuesta = await msalInstance.acquireTokenSilent({
            ...apiTokenRequest,
            account: cuenta,
        });
        return respuesta.accessToken;
    } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
            await msalInstance.acquireTokenRedirect({ ...apiTokenRequest, account: cuenta });
        }
        throw new ApiError(401, "No se pudo renovar la sesión. Inicia sesión nuevamente.");
    }
}

export async function http<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
    const token = await obtenerToken();

    let respuesta: Response;
    try {
        respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
            ...opciones,
            headers: {
                "Content-Type": "application/json",
                ...opciones.headers,
                Authorization: `Bearer ${token}`,
            },
        });
    } catch {
        throw new ApiError(
            0,
            "No se pudo conectar con el servidor. Revisa que el BFF y los servicios estén levantados."
        );
    }

    const texto = await respuesta.text();
    let cuerpo: unknown;
    if (texto) {
        try {
            cuerpo = JSON.parse(texto);
        } catch {
            cuerpo = undefined;
        }
    }

    if (!respuesta.ok) {
        const datos = (cuerpo ?? {}) as CuerpoError;
        const detalle = datos.errores ? Object.values(datos.errores).join(". ") : undefined;
        const porDefecto: Record<number, string> = {
            401: "Tu sesión no es válida o expiró. Inicia sesión nuevamente.",
            403: "No tienes permisos para realizar esta acción.",
            502: "Un servicio interno no está disponible. Intenta más tarde.",
        };
        throw new ApiError(
            respuesta.status,
            datos.mensaje ??
                detalle ??
                datos.error ??
                porDefecto[respuesta.status] ??
                `Error ${respuesta.status}: ${respuesta.statusText}`,
            datos.errores
        );
    }
    if (cuerpo === undefined && respuesta.status >= 500) {
        throw new ApiError(
            respuesta.status,
            "El servidor no responde. Revisa que los servicios estén levantados."
        );
    }

    return cuerpo as T;
}
