import { http } from "./http";
import type {
    Solicitud,
    CrearSolicitudRequest,
    Atencion,
    EstadoSolicitud,
    MisSolicitudesV2,
} from "../types/dto";

const BASE = "/v1/solicitudes";

// La identidad (solicitante u operador) la toma el BFF desde el JWT: no se envía en el body.

export function crearSolicitud(datos: CrearSolicitudRequest): Promise<Solicitud> {
    return http<Solicitud>(BASE, { method: "POST", body: JSON.stringify(datos) });
}

export function listarTodas(): Promise<Solicitud[]> {
    return http<Solicitud[]>(BASE);
}

// Usa la versión 2 del contrato público (GET /v2/solicitudes/mias).
// La v1 sigue disponible en GET /v1/solicitudes/mias y devuelve la lista directa.
export async function listarMias(): Promise<Solicitud[]> {
    const respuesta = await http<MisSolicitudesV2>("/v2/solicitudes/mias");
    return respuesta.solicitudes;
}

export function listarDisponibles(): Promise<Solicitud[]> {
    return http<Solicitud[]>(`${BASE}/disponibles`);
}

export function listarAsignadasMias(): Promise<Solicitud[]> {
    return http<Solicitud[]>(`${BASE}/asignadas/mias`);
}

export function asignarSolicitud(id: number): Promise<Solicitud> {
    return http<Solicitud>(`${BASE}/${id}/asignacion`, { method: "PATCH" });
}

export function cambiarEstado(id: number, estado: EstadoSolicitud): Promise<Solicitud> {
    return http<Solicitud>(`${BASE}/${id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
    });
}

export function registrarAtencion(id: number, detalle: string): Promise<Atencion> {
    return http<Atencion>(`${BASE}/${id}/atenciones`, {
        method: "POST",
        body: JSON.stringify({ detalle }),
    });
}
