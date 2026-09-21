import { apiFetch } from "./apiClient";
import type { Solicitud, EstadoSolicitud, Prioridad } from "../types/models";

// Cambiar a false cuando el backend en AWS esté listo
const USAR_DATOS_SIMULADOS = true;

export interface NuevaSolicitud {
    titulo: string;
    descripcion: string;
    categoria: string;
    prioridad: Prioridad;
}

let solicitudesSimuladas: Solicitud[] = [
    {
        id: 1,
        titulo: "No puedo iniciar sesión en el correo",
        descripcion: "Me aparece error de contraseña incorrecta.",
        categoria: "Accesos",
        prioridad: "ALTA",
        usuarioSolicitante: "cliente1",
        estado: "CREADA",
        fechaCreacion: "2026-09-18T10:30:00",
    },
    {
        id: 2,
        titulo: "Impresora sin conexión",
        descripcion: "La impresora del piso 2 no responde.",
        categoria: "Hardware",
        prioridad: "MEDIA",
        usuarioSolicitante: "cliente1",
        estado: "EN_PROCESO",
        fechaCreacion: "2026-09-19T09:00:00",
    },
];

const pausa = () => new Promise((resolver) => setTimeout(resolver, 300));

export async function listarSolicitudes(): Promise<Solicitud[]> {
    if (USAR_DATOS_SIMULADOS) {
        await pausa();
        return [...solicitudesSimuladas];
    }
    return apiFetch<Solicitud[]>("/v1/solicitudes");
}

export async function crearSolicitud(
    datos: NuevaSolicitud,
    usuario: string
): Promise<Solicitud> {
    if (USAR_DATOS_SIMULADOS) {
        await pausa();
        const nueva: Solicitud = {
            ...datos,
            id: Date.now(),
            usuarioSolicitante: usuario,
            estado: "CREADA",
            fechaCreacion: new Date().toISOString(),
        };
        solicitudesSimuladas = [nueva, ...solicitudesSimuladas];
        return nueva;
    }
    return apiFetch<Solicitud>("/v1/solicitudes", {
        method: "POST",
        body: JSON.stringify(datos),
    });
}

export async function cambiarEstado(
    id: number,
    estado: EstadoSolicitud
): Promise<Solicitud> {
    if (USAR_DATOS_SIMULADOS) {
        await pausa();
        const actual = solicitudesSimuladas.find((s) => s.id === id);
        if (!actual) throw new Error("Solicitud no encontrada");
        if (estado === "RESUELTA" && actual.estado !== "EN_PROCESO") {
            throw new Error("Una solicitud solo puede pasar a RESUELTA desde EN_PROCESO");
        }
        const actualizada = { ...actual, estado };
        solicitudesSimuladas = solicitudesSimuladas.map((s) =>
            s.id === id ? actualizada : s
        );
        return actualizada;
    }
    return apiFetch<Solicitud>(`/v1/solicitudes/${id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
    });
}