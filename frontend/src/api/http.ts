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
    errores?: Record<string, string>;
}

export async function http<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
    let respuesta: Response;
    try {
        respuesta = await fetch(ruta, {
            ...opciones,
            headers: { "Content-Type": "application/json", ...opciones.headers },
        });
    } catch {
        throw new ApiError(
            0,
            "No se pudo conectar con el servidor. Revisa que los servicios estén levantados."
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
        throw new ApiError(
            respuesta.status,
            datos.mensaje ?? detalle ?? `Error ${respuesta.status}: ${respuesta.statusText}`,
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