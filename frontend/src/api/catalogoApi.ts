import { http } from "./http";
import type { CatalogoResponse, CatalogoItemRequest } from "../types/dto";

const BASE = "/v1/catalogo";

export type RecursoCatalogo = "categorias" | "prioridades";

export function obtenerCatalogo(): Promise<CatalogoResponse> {
    return http<CatalogoResponse>(BASE);
}

export function crearItem<T>(
    recurso: RecursoCatalogo,
    datos: CatalogoItemRequest
): Promise<T> {
    return http<T>(`${BASE}/${recurso}`, {
        method: "POST",
        body: JSON.stringify(datos),
    });
}

export function actualizarItem<T>(
    recurso: RecursoCatalogo,
    id: number,
    datos: CatalogoItemRequest
): Promise<T> {
    return http<T>(`${BASE}/${recurso}/${id}`, {
        method: "PUT",
        body: JSON.stringify(datos),
    });
}

export function eliminarItem(recurso: RecursoCatalogo, id: number): Promise<void> {
    return http<void>(`${BASE}/${recurso}/${id}`, { method: "DELETE" });
}
