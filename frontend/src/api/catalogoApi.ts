import { apiFetch } from "./apiClient";
import type { Catalogo } from "../types/models";

// Cambiar a false cuando el backend en AWS esté listo
const USAR_DATOS_SIMULADOS = true;

export interface NuevoItemCatalogo {
    nombre: string;
    descripcion: string;
}

let catalogoSimulado: Catalogo[] = [
    { id: 1, nombre: "Accesos", descripcion: "Problemas de contraseñas y permisos" },
    { id: 2, nombre: "Hardware", descripcion: "Equipos, impresoras y periféricos" },
    { id: 3, nombre: "Software", descripcion: "Instalación y errores de programas" },
];

const pausa = () => new Promise((resolver) => setTimeout(resolver, 300));

export async function listarCatalogo(): Promise<Catalogo[]> {
    if (USAR_DATOS_SIMULADOS) {
        await pausa();
        return [...catalogoSimulado];
    }
    return apiFetch<Catalogo[]>("/v1/catalogo");
}

export async function crearItemCatalogo(
    datos: NuevoItemCatalogo
): Promise<Catalogo> {
    if (USAR_DATOS_SIMULADOS) {
        await pausa();
        const nuevo: Catalogo = { ...datos, id: Date.now() };
        catalogoSimulado = [...catalogoSimulado, nuevo];
        return nuevo;
    }
    return apiFetch<Catalogo>("/v1/catalogo", {
        method: "POST",
        body: JSON.stringify(datos),
    });
}

export async function eliminarItemCatalogo(id: number): Promise<void> {
    if (USAR_DATOS_SIMULADOS) {
        await pausa();
        catalogoSimulado = catalogoSimulado.filter((c) => c.id !== id);
        return;
    }
    await apiFetch<void>(`/v1/catalogo/${id}`, { method: "DELETE" });
}