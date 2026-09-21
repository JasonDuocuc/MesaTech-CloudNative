import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { obtenerCatalogo } from "../api/catalogoApi";
import { crearSolicitud, listarPorSolicitante } from "../api/solicitudesApi";
import { legible, fechaCorta } from "../utils/formato";
import type { Categoria, Prioridad, Solicitud } from "../types/dto";

function ClientePage() {
    const { identidad } = useAuth();
    const idUsuario = identidad?.id;

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [prioridades, setPrioridades] = useState<Prioridad[]>([]);
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
    const [cargandoLista, setCargandoLista] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<string | null>(null);

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoriaId, setCategoriaId] = useState("");
    const [prioridadId, setPrioridadId] = useState("");

    useEffect(() => {
        obtenerCatalogo()
            .then((c) => {
                setCategorias(c.categorias);
                setPrioridades(c.prioridades);
                setCategoriaId(c.categorias[0] ? String(c.categorias[0].id) : "");
                setPrioridadId(c.prioridades[0] ? String(c.prioridades[0].id) : "");
            })
            .catch((e) => setError(e.message))
            .finally(() => setCargandoCatalogo(false));
    }, []);

    useEffect(() => {
        if (!idUsuario) return;
        listarPorSolicitante(idUsuario)
            .then(setSolicitudes)
            .catch((e) => setError(e.message))
            .finally(() => setCargandoLista(false));
    }, [idUsuario]);

    async function enviar() {
        setExito(null);
        if (!identidad) {
            setError("Todavía se está cargando tu sesión. Intenta de nuevo en un momento.");
            return;
        }
        const categoria = categorias.find((c) => String(c.id) === categoriaId);
        const prioridad = prioridades.find((p) => String(p.id) === prioridadId);
        if (!titulo.trim() || !descripcion.trim() || !categoria || !prioridad) {
            setError("Completa el título, la descripción, la categoría y la prioridad.");
            return;
        }
        try {
            setError(null);
            const nueva = await crearSolicitud({
                titulo: titulo.trim(),
                descripcion: descripcion.trim(),
                categoriaId: categoria.id,
                categoriaNombre: categoria.nombre,
                prioridadId: prioridad.id,
                prioridadNombre: prioridad.nombre,
                solicitanteId: identidad.id,
                solicitanteNombre: identidad.nombre,
                solicitanteEmail: identidad.email,
            });
            setSolicitudes((anteriores) => [nueva, ...anteriores]);
            setTitulo("");
            setDescripcion("");
            setExito("Solicitud creada.");
        } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo crear la solicitud.");
        }
    }

    const sinCatalogo =
        !cargandoCatalogo && (categorias.length === 0 || prioridades.length === 0);

    return (
        <div>
            <h2>Mis solicitudes</h2>

            <section className="panel">
                <h3 style={{ marginTop: 0 }}>Nueva solicitud</h3>

                {sinCatalogo && (
                    <p className="mensaje-aviso">
                        Todavía no hay categorías o prioridades disponibles. Pídele al
                        administrador que las cree para poder registrar solicitudes.
                    </p>
                )}

                <div className="formulario">
                    <label className="campo">
                        Título
                        <input
                            value={titulo}
                            maxLength={150}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Ej: No puedo entrar al correo"
                        />
                    </label>
                    <label className="campo">
                        Descripción
                        <textarea
                            value={descripcion}
                            maxLength={1000}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Cuéntanos qué está pasando"
                        />
                    </label>
                    <div className="fila-doble">
                        <label className="campo">
                            Categoría
                            <select
                                value={categoriaId}
                                onChange={(e) => setCategoriaId(e.target.value)}
                            >
                                {categorias.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="campo">
                            Prioridad
                            <select
                                value={prioridadId}
                                onChange={(e) => setPrioridadId(e.target.value)}
                            >
                                {prioridades.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <button className="btn-primario" onClick={enviar} disabled={sinCatalogo}>
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
                    {!cargandoLista && (
                        <span className="contador">{solicitudes.length} en total</span>
                    )}
                </div>

                {cargandoLista ? (
                    <p className="vacio">Cargando tus solicitudes...</p>
                ) : solicitudes.length === 0 ? (
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
                                <th>Operador</th>
                                <th>Fecha</th>
                            </tr>
                            </thead>
                            <tbody>
                            {solicitudes.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.titulo}</td>
                                    <td>{s.categoriaNombre}</td>
                                    <td>
                                        <span className="badge">{s.prioridadNombre}</span>
                                    </td>
                                    <td>
                      <span className="badge" data-estado={s.estado}>
                        {legible(s.estado)}
                      </span>
                                    </td>
                                    <td>{s.operadorNombre ?? "Sin asignar"}</td>
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