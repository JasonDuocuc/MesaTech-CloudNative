import { useEffect, useState } from "react";
import { listarSolicitudes, cambiarEstado } from "../api/solicitudesMock";
import { legible, fechaCorta } from "../utils/formato";
import type { Solicitud, EstadoSolicitud } from "../types/models";

const SIGUIENTE: Partial<Record<EstadoSolicitud, { estado: EstadoSolicitud; texto: string }>> = {
    CREADA: { estado: "ASIGNADA", texto: "Asignar" },
    ASIGNADA: { estado: "EN_PROCESO", texto: "Iniciar" },
    EN_PROCESO: { estado: "RESUELTA", texto: "Marcar resuelta" },
    RESUELTA: { estado: "CERRADA", texto: "Cerrar" },
};

const ESTADOS: EstadoSolicitud[] = [
    "CREADA",
    "ASIGNADA",
    "EN_PROCESO",
    "RESUELTA",
    "CERRADA",
    "CANCELADA",
];

function OperadorPage() {
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtro, setFiltro] = useState<EstadoSolicitud | "TODAS">("TODAS");

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
            setError(e instanceof Error ? e.message : "No se pudo cambiar el estado.");
        }
    }

    const visibles =
        filtro === "TODAS" ? solicitudes : solicitudes.filter((s) => s.estado === filtro);

    return (
        <div>
            <h2>Solicitudes de soporte</h2>

            {error && <p className="mensaje-error">{error}</p>}

            <section className="panel">
                <div className="encabezado-seccion">
                    <h3>Bandeja</h3>
                    <select
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value as EstadoSolicitud | "TODAS")}
                        aria-label="Filtrar por estado"
                    >
                        <option value="TODAS">Todos los estados</option>
                        {ESTADOS.map((e) => (
                            <option key={e} value={e}>
                                {legible(e)}
                            </option>
                        ))}
                    </select>
                </div>

                {cargando ? (
                    <p className="vacio">Cargando solicitudes...</p>
                ) : visibles.length === 0 ? (
                    <p className="vacio">No hay solicitudes con este filtro.</p>
                ) : (
                    <div className="tabla-scroll">
                        <table className="tabla">
                            <thead>
                            <tr>
                                <th>Título</th>
                                <th>Solicitante</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {visibles.map((s) => {
                                const siguiente = SIGUIENTE[s.estado];
                                const puedeCancelar = s.estado === "CREADA" || s.estado === "ASIGNADA";
                                return (
                                    <tr key={s.id}>
                                        <td>{s.titulo}</td>
                                        <td>{s.usuarioSolicitante}</td>
                                        <td>
                        <span className="badge" data-prioridad={s.prioridad}>
                          {legible(s.prioridad)}
                        </span>
                                        </td>
                                        <td>
                        <span className="badge" data-estado={s.estado}>
                          {legible(s.estado)}
                        </span>
                                        </td>
                                        <td>{fechaCorta(s.fechaCreacion)}</td>
                                        <td>
                                            <div className="acciones">
                                                {siguiente && (
                                                    <button
                                                        className="btn-primario"
                                                        onClick={() => avanzar(s, siguiente.estado)}
                                                    >
                                                        {siguiente.texto}
                                                    </button>
                                                )}
                                                {puedeCancelar && (
                                                    <button
                                                        className="btn-peligro"
                                                        onClick={() => avanzar(s, "CANCELADA")}
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default OperadorPage;