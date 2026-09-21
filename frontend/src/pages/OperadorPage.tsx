import { useEffect, useState } from "react";
import { listarSolicitudes, cambiarEstado } from "../api/solicitudesApi";
import type { Solicitud, EstadoSolicitud } from "../types/models";

const SIGUIENTE_ESTADO: Partial<Record<EstadoSolicitud, EstadoSolicitud>> = {
    CREADA: "ASIGNADA",
    ASIGNADA: "EN_PROCESO",
    EN_PROCESO: "RESUELTA",
    RESUELTA: "CERRADA",
};

function OperadorPage() {
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        listarSolicitudes()
            .then(setSolicitudes)
            .catch((e) => setError(e.message))
            .finally(() => setCargando(false));
    }, []);

    async function avanzar(solicitud: Solicitud, estado: EstadoSolicitud) {
        try {
            setError(null);
            const actualizada = await cambiarEstado(solicitud.id, estado);
            setSolicitudes((anteriores) =>
                anteriores.map((s) => (s.id === actualizada.id ? actualizada : s))
            );
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error al cambiar el estado");
        }
    }

    return (
        <div>
            <h2>Panel del Operador</h2>

            {error && <p style={{ color: "tomato" }}>{error}</p>}

            {cargando ? (
                <p>Cargando...</p>
            ) : solicitudes.length === 0 ? (
                <p>No hay solicitudes.</p>
            ) : (
                <table style={{ borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th style={{ padding: "4px 12px" }}>Título</th>
                        <th style={{ padding: "4px 12px" }}>Solicitante</th>
                        <th style={{ padding: "4px 12px" }}>Prioridad</th>
                        <th style={{ padding: "4px 12px" }}>Estado</th>
                        <th style={{ padding: "4px 12px" }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {solicitudes.map((s) => {
                        const siguiente = SIGUIENTE_ESTADO[s.estado];
                        const puedeCancelar = s.estado === "CREADA" || s.estado === "ASIGNADA";
                        return (
                            <tr key={s.id}>
                                <td style={{ padding: "4px 12px" }}>{s.titulo}</td>
                                <td style={{ padding: "4px 12px" }}>{s.usuarioSolicitante}</td>
                                <td style={{ padding: "4px 12px" }}>{s.prioridad}</td>
                                <td style={{ padding: "4px 12px" }}>{s.estado}</td>
                                <td style={{ padding: "4px 12px", display: "flex", gap: 8 }}>
                                    {siguiente && (
                                        <button onClick={() => avanzar(s, siguiente)}>
                                            Pasar a {siguiente}
                                        </button>
                                    )}
                                    {puedeCancelar && (
                                        <button onClick={() => avanzar(s, "CANCELADA")}>Cancelar</button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default OperadorPage;