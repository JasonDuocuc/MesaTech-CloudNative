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
export interface Identidad {
    id: string;
    nombre: string;
    email: string;
}

function extraerIdentidad(
    claims: Claims | null,
    nombreCuenta: string | null,
    usuarioCuenta: string | null
): Identidad | null {
    if (!claims) return null;
    const texto = (v: unknown) => (typeof v === "string" && v ? v : null);
    const id = texto(claims.oid) ?? texto(claims.sub);
    if (!id) return null;
    return {
        id,
        nombre: texto(claims.name) ?? nombreCuenta ?? usuarioCuenta ?? id,
        email:
            texto(claims.upn) ??
            texto(claims.preferred_username) ??
            texto(claims.email) ??
            usuarioCuenta ??
            "",
    };
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
        identidad: extraerIdentidad(
            claims,
            accounts[0]?.name ?? null,
            accounts[0]?.username ?? null
        ),
        claims,
    };
}