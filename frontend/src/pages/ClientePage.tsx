import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { listarSolicitudes, crearSolicitud } from "../api/solicitudesApi";
import { legible, fechaCorta } from "../utils/formato";
import type { Solicitud, Prioridad } from "../types/models";

function ClientePage() {
    const { usuario } = useAuth();
    const miUsuario = usuario?.split("@")[0] ?? "";

    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<string | null>(null);

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("Accesos");
    const [prioridad, setPrioridad] = useState<Prioridad>("MEDIA");

    useEffect(() => {
        listarSolicitudes()
            .then(setSolicitudes)
            .catch((e) => setError(e.message))
            .finally(() => setCargando(false));
    }, []);

    async function enviar() {
        setExito(null);
        if (!titulo.trim() || !descripcion.trim()) {
            setError("Completa el título y la descripción para crear la solicitud.");
            return;
        }
        try {
            setError(null);
            const nueva = await crearSolicitud(
                { titulo, descripcion, categoria, prioridad },
                miUsuario
            );
            setSolicitudes((anteriores) => [nueva, ...anteriores]);
            setTitulo("");
            setDescripcion("");
            setExito("Solicitud creada.");
        } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo crear la solicitud.");
        }
    }

    const mias = solicitudes.filter((s) => s.usuarioSolicitante === miUsuario);

    return (
        <div>
            <h2>Mis solicitudes</h2>

            <section className="panel">
                <h3 style={{ marginTop: 0 }}>Nueva solicitud</h3>
                <div className="formulario">
                    <label className="campo">
                        Título
                        <input
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Ej: No puedo entrar al correo"
                        />
                    </label>
                    <label className="campo">
                        Descripción
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Cuéntanos qué está pasando"
                        />
                    </label>
                    <div className="fila-doble">
                        <label className="campo">
                            Categoría
                            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                                <option>Accesos</option>
                                <option>Hardware</option>
                                <option>Software</option>
                                <option>Redes</option>
                                <option>Otro</option>
                            </select>
                        </label>
                        <label className="campo">
                            Prioridad
                            <select
                                value={prioridad}
                                onChange={(e) => setPrioridad(e.target.value as Prioridad)}
                            >
                                <option value="BAJA">Baja</option>
                                <option value="MEDIA">Media</option>
                                <option value="ALTA">Alta</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <button className="btn-primario" onClick={enviar}>
                            Crear solicitud
                        </button>
                    </div>
                    {error && <p className="mensaje-error">{error}</p>}
                    {exito && <p className="mensaje-exito">{exito}</p>}
                </div>
            </section>

            <section className="panel">
                <div className="encabezado-seccion">
                    <h3>Historial</h3>
                    {!cargando && <span className="contador">{mias.length} en total</span>}
                </div>

                {cargando ? (
                    <p className="vacio">Cargando tus solicitudes...</p>
                ) : mias.length === 0 ? (
                    <p className="vacio">
                        Aún no tienes solicitudes. Crea la primera con el formulario de arriba.
                    </p>
                ) : (
                    <div className="tabla-scroll">
                        <table className="tabla">
                            <thead>
                            <tr>
                                <th>Título</th>
                                <th>Categoría</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                            </tr>
                            </thead>
                            <tbody>
                            {mias.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.titulo}</td>
                                    <td>{s.categoria}</td>
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
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default ClientePage;