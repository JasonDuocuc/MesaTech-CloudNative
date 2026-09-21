import { http } from "./http";
import type {
    Solicitud,
    CrearSolicitudRequest,
    AsignarSolicitudRequest,
    CrearAtencionRequest,
    Atencion,
    EstadoSolicitud,
} from "../types/dto";

const BASE = "/internal/solicitudes";

export function crearSolicitud(datos: CrearSolicitudRequest): Promise<Solicitud> {
    return http<Solicitud>(BASE, { method: "POST", body: JSON.stringify(datos) });
}

export function listarTodas(): Promise<Solicitud[]> {
    return http<Solicitud[]>(BASE);
}

export function listarPorSolicitante(solicitanteId: string): Promise<Solicitud[]> {
    return http<Solicitud[]>(`${BASE}/solicitante/${encodeURIComponent(solicitanteId)}`);
}

export function listarDisponibles(): Promise<Solicitud[]> {
    return http<Solicitud[]>(`${BASE}/disponibles`);
}

export function listarPorOperador(operadorId: string): Promise<Solicitud[]> {
    return http<Solicitud[]>(`${BASE}/operador/${encodeURIComponent(operadorId)}`);
}

export function asignarSolicitud(
    id: number,
    datos: AsignarSolicitudRequest
): Promise<Solicitud> {
    return http<Solicitud>(`${BASE}/${id}/asignacion`, {
        method: "PATCH",
        body: JSON.stringify(datos),
    });
}

export function cambiarEstado(id: number, estado: EstadoSolicitud): Promise<Solicitud> {
    return http<Solicitud>(`${BASE}/${id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
    });
}

export function registrarAtencion(
    id: number,
    datos: CrearAtencionRequest
): Promise<Atencion> {
    return http<Atencion>(`${BASE}/${id}/atenciones`, {
        method: "POST",
        body: JSON.stringify(datos),
    });
}