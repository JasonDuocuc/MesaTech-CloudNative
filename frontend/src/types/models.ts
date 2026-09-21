export type Rol = "ROLE_CLIENTE" | "ROLE_OPERADOR" | "ROLE_ADMINISTRADOR";

export type EstadoSolicitud =
    | "CREADA"
    | "ASIGNADA"
    | "EN_PROCESO"
    | "RESUELTA"
    | "CERRADA"
    | "CANCELADA";

export type Prioridad = "BAJA" | "MEDIA" | "ALTA";

export interface Solicitud {
    id: number;
    titulo: string;
    descripcion: string;
    categoria: string;
    prioridad: Prioridad;
    usuarioSolicitante: string;
    estado: EstadoSolicitud;
    fechaCreacion: string;
}

export interface Catalogo {
    id: number;
    nombre: string;
    descripcion: string;
}