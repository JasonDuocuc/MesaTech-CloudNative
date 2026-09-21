// Tipos que reflejan los DTO Java de solicitudes-service y catalogo-service.

export type Rol = "CLIENTE" | "OPERADOR" | "ADMINISTRADOR";

export type EstadoSolicitud =
    | "CREADA"
    | "ASIGNADA"
    | "EN_PROCESO"
    | "RESUELTA"
    | "CERRADA"
    | "CANCELADA";

export interface Categoria {
    id: number;
    nombre: string;
}

export interface Prioridad {
    id: number;
    nombre: string;
}

export interface CatalogoResponse {
    categorias: Categoria[];
    prioridades: Prioridad[];
}

export interface CatalogoItemRequest {
    nombre: string;
}

export interface Solicitud {
    id: number;
    titulo: string;
    descripcion: string;
    categoriaId: number;
    categoriaNombre: string;
    prioridadId: number;
    prioridadNombre: string;
    solicitanteId: string;
    solicitanteNombre: string;
    solicitanteEmail: string;
    estado: EstadoSolicitud;
    operadorId: string | null;
    operadorNombre: string | null;
    fechaCreacion: string;
    fechaActualizacion: string;
    fechaAsignacion: string | null;
}

export interface CrearSolicitudRequest {
    titulo: string;
    descripcion: string;
    categoriaId: number;
    categoriaNombre: string;
    prioridadId: number;
    prioridadNombre: string;
    solicitanteId: string;
    solicitanteNombre: string;
    solicitanteEmail: string;
}

export interface AsignarSolicitudRequest {
    operadorId: string;
    operadorNombre: string;
}

export interface CambiarEstadoRequest {
    estado: EstadoSolicitud;
}

export interface CrearAtencionRequest {
    operadorId: string;
    operadorNombre: string;
    detalle: string;
}

export interface Atencion {
    id: number;
    solicitudId: number;
    operadorId: string;
    operadorNombre: string;
    detalle: string;
    fechaCreacion: string;
}