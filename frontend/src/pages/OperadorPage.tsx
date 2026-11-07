import { useEffect, useState } from "react";
import {
    listarDisponibles,
    listarAsignadasMias,
    asignarSolicitud,
    cambiarEstado,
    registrarAtencion,
} from "../api/solicitudesApi";
import { legible, fechaCorta } from "../utils/formato";
import type { Solicitud, EstadoSolicitud } from "../types/dto";

const SIGUIENTE: Partial<Record<EstadoSolicitud, { estado: EstadoSolicitud; texto: string }>> = {
    ASIGNADA: { estado: "EN_PROCESO", texto: "Iniciar" },
    EN_PROCESO: { estado: "RESUELTA", texto: "Marcar resuelta" },
    RESUELTA: { estado: "CERRADA", texto: "Cerrar" },
};

const PUEDE_CANCELAR: EstadoSolicitud[] = ["CREADA", "ASIGNADA", "EN_PROCESO"];
const PUEDE_ATENDER: EstadoSolicitud[] = ["ASIGNADA", "EN_PROCESO", "RESUELTA"];

function OperadorPage() {
    const [disponibles, setDisponibles] = useState<Solicitud[]>([]);
    const [mias, setMias] = useState<Solicitud[]>([]);
    const [cargandoDisponibles, setCargandoDisponibles] = useState(true);
    const [cargandoMias, setCargandoMias] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<string | null>(null);
    const [ocupadoId, setOcupadoId] = useState<number | null>(null);

    const [atendiendo, setAtendiendo] = useState<Solicitud | null>(null);
    const [detalle, setDetalle] = useState("");

    useEffect(() => {
        listarDisponibles()
            .then(setDisponibles)
            .catch((e) => setError(e.message))
            .finally(() => setCargandoDisponibles(false));
    }, []);

    useEffect(() => {
        listarAsignadasMias()
            .then(setMias)
            .catch((e) => setError(e.message))
            .finally(() => setCargandoMias(false));
    }, []);

    async function ejecutar(id: number, accion: () => Promise<void>) {
        setOcupadoId(id);
        setError(null);
        setExito(null);
        try {
            await accion();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Ocurrió un error inesperado.");
        } finally {
            setOcupadoId(null);
        }
    }

    function asignarme(s: Solicitud) {
        ejecutar(s.id, async () => {
            const actualizada = await asignarSolicitud(s.id);
            setDisponibles((anteriores) => anteriores.filter((x) => x.id !== s.id));
            setMias((anteriores) => [actualizada, ...anteriores]);
        });
    }

    function cancelarDisponible(s: Solicitud) {
        if (!window.confirm(`¿Cancelar la solicitud "${s.titulo}"? No se puede deshacer.`)) return;
        ejecutar(s.id, async () => {
            await cambiarEstado(s.id, "CANCELADA");
            setDisponibles((anteriores) => anteriores.filter((x) => x.id !== s.id));
        });
    }

    function cambiar(s: Solicitud, estado: EstadoSolicitud) {
        if (
            estado === "CANCELADA" &&
            !window.confirm(`¿Cancelar la solicitud "${s.titulo}"? No se puede deshacer.`)
        ) {
            return;
        }
        ejecutar(s.id, async () => {
            const actualizada = await cambiarEstado(s.id, estado);
            setMias((anteriores) => anteriores.map((x) => (x.id === s.id ? actualizada : x)));
            if (atendiendo?.id === s.id && !PUEDE_ATENDER.includes(actualizada.estado)) {
                setAtendiendo(null);
                setDetalle("");
            }
        });
    }

    function abrirAtencion(s: Solicitud) {
        setAtendiendo(s);
        setDetalle("");
        setError(null);
        setExito(null);
    }

    async function guardarAtencion() {
        if (!atendiendo) return;
        if (!detalle.trim()) {
            setError("Escribe el detalle de la atención.");
            return;
        }
        const solicitud = atendiendo;
        await ejecutar(solicitud.id, async () => {
            await registrarAtencion(solicitud.id, detalle.trim());
            setAtendiendo(null);
            setDetalle("");
            setExito("Atención registrada.");
        });
    }

    return (
        <div>
            <h2>Solicitudes de soporte</h2>

            {error && <p className="mensaje-error">{error}</p>}
            {exito && <p className="mensaje-exito">{exito}</p>}

            {atendiendo && (
                <section className="panel">
                    <h3 style={{ marginTop: 0 }}>Registrar atención: {atendiendo.titulo}</h3>
                    <div className="formulario">
                        <label className="campo">
                            Detalle de la atención
                            <textarea
                                value={detalle}
                                maxLength={1000}
                                onChange={(e) => setDetalle(e.target.value)}
                                placeholder="Describe lo que hiciste o lo que falta por hacer"
                            />
                        </label>
                        <div className="acciones">
                            <button
                                className="btn-primario"
                                onClick={guardarAtencion}
                                disabled={ocupadoId === atendiendo.id}
                            >
                                Guardar atención
                            </button>
                            <button
                                onClick={() => {
                                    setAtendiendo(null);
                                    setDetalle("");
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </section>
            )}

            <section className="panel">
                <div className="encabezado-seccion">
                    <h3>Disponibles para asignar</h3>
                    {!cargandoDisponibles && (
                        <span className="contador">{disponibles.length} en total</span>
                    )}
                </div>

                {cargandoDisponibles ? (
                    <p className="vacio">Cargando solicitudes...</p>
                ) : disponibles.length === 0 ? (
                    <p className="vacio">No hay solicitudes disponibles por ahora.</p>
                ) : (
                    <div className="tabla-scroll">
                        <table className="tabla">
                            <thead>
                            <tr>
                                <th>Solicitud</th>
                                <th>Solicitante</th>
                                <th>Categoría</th>
                                <th>Prioridad</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {disponibles.map((s) => (
                                <tr key={s.id}>
                                    <td>
                                        {s.titulo}
                                        <div className="descripcion-corta">{s.descripcion}</div>
                                    </td>
                                    <td>{s.solicitanteNombre}</td>
                                    <td>{s.categoriaNombre}</td>
                                    <td>
                                        <span className="badge">{s.prioridadNombre}</span>
                                    </td>
                                    <td>{fechaCorta(s.fechaCreacion)}</td>
                                    <td>
                                        <div className="acciones">
                                            <button
                                                className="btn-primario"
                                                onClick={() => asignarme(s)}
                                                disabled={ocupadoId === s.id}
                                            >
                                                Asignarme
                                            </button>
                                            <button
                                                className="btn-peligro"
                                                onClick={() => cancelarDisponible(s)}
                                                disabled={ocupadoId === s.id}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="panel">
                <div className="encabezado-seccion">
                    <h3>Mis solicitudes asignadas</h3>
                    {!cargandoMias && <span className="contador">{mias.length} en total</span>}
                </div>

                {cargandoMias ? (
                    <p className="vacio">Cargando tus solicitudes...</p>
                ) : mias.length === 0 ? (
                    <p className="vacio">Todavía no tienes solicitudes asignadas.</p>
                ) : (
                    <div className="tabla-scroll">
                        <table className="tabla">
                            <thead>
                            <tr>
                                <th>Solicitud</th>
                                <th>Solicitante</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                                <th>Asignada</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {mias.map((s) => {
                                const siguiente = SIGUIENTE[s.estado];
                                return (
                                    <tr key={s.id}>
                                        <td>
                                            {s.titulo}
                                            <div className="descripcion-corta">{s.descripcion}</div>
                                        </td>
                                        <td>{s.solicitanteNombre}</td>
                                        <td>
                                            <span className="badge">{s.prioridadNombre}</span>
                                        </td>
                                        <td>
                        <span className="badge" data-estado={s.estado}>
                          {legible(s.estado)}
                        </span>
                                        </td>
                                        <td>{s.fechaAsignacion ? fechaCorta(s.fechaAsignacion) : "-"}</td>
                                        <td>
                                            <div className="acciones">
                                                {siguiente && (
                                                    <button
                                                        className="btn-primario"
                                                        onClick={() => cambiar(s, siguiente.estado)}
                                                        disabled={ocupadoId === s.id}
                                                    >
                                                        {siguiente.texto}
                                                    </button>
                                                )}
                                                {PUEDE_ATENDER.includes(s.estado) && (
                                                    <button
                                                        onClick={() => abrirAtencion(s)}
                                                        disabled={ocupadoId === s.id}
                                                    >
                                                        Registrar atención
                                                    </button>
                                                )}
                                                {PUEDE_CANCELAR.includes(s.estado) && (
                                                    <button
                                                        className="btn-peligro"
                                                        onClick={() => cambiar(s, "CANCELADA")}
                                                        disabled={ocupadoId === s.id}
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
