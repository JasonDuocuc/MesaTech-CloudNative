import { useEffect, useState } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { apiTokenRequest } from "../auth/authConfig";
import type { Rol } from "../types/models";

type Claims = Record<string, unknown>;

function decodificarToken(token: string): Claims {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
}

export function useAuth() {
    const { instance, accounts } = useMsal();
    const estaAutenticado = useIsAuthenticated();
    const [roles, setRoles] = useState<Rol[]>([]);
    const [claims, setClaims] = useState<Claims | null>(null);

    useEffect(() => {
        if (!estaAutenticado || accounts.length === 0) return;

        let cancelado = false;

        async function cargarToken() {
            try {
                const respuesta = await instance.acquireTokenSilent({
                    ...apiTokenRequest,
                    account: accounts[0],
                });
                const datos = decodificarToken(respuesta.accessToken);
                if (!cancelado) {
                    setClaims(datos);
                    setRoles((datos.roles as Rol[]) ?? []);
                }
            } catch (error) {
                console.error("No se pudo obtener el token:", error);
            }
        }

        cargarToken();
        return () => {
            cancelado = true;
        };
    }, [estaAutenticado, accounts, instance]);

    return {
        estaAutenticado,
        usuario: accounts[0]?.username ?? null,
        nombre: accounts[0]?.name ?? null,
        roles,
        claims,
    };
}