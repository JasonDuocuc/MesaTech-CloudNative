import { useEffect, useState } from "react";
import {
    listarCatalogo,
    crearItemCatalogo,
    eliminarItemCatalogo,
} from "../api/catalogoApi";
import { listarSolicitudes } from "../api/solicitudesApi";
import { legible, fechaCorta } from "../utils/formato";
import type { Catalogo, Solicitud } from "../types/models";

function AdminPage() {
    const [catalogo, setCatalogo] = useState<Catalogo[]>([]);
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    useEffect(() => {
        Promise.all([listarCatalogo(), listarSolicitudes()])
            .then(([c, s]) => {
                setCatalogo(c);
                setSolicitudes(s);
            })
            .catch((e) => setError(e.message))
            .finally(() => setCargando(false));
    }, []);

    async function agregar() {
        if (!nombre.trim()) {
            setError("Escribe un nombre para agregar la categoría.");
            return;
        }
        try {
            setError(null);
            const nuevo = await crearItemCatalogo({ nombre, descripcion });
            setCatalogo((anterior) => [...anterior, nuevo]);
            setNombre("");
            setDescripcion("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo agregar la categoría.");
        }
    }

    async function eliminar(id: number) {
        try {
            setError(null);
            await eliminarItemCatalogo(id);
            setCatalogo((anterior) => anterior.filter((c) => c.id !== id));
        } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo eliminar la categoría.");
        }
    }

    return (
        <div>
            <h2>Administración</h2>

            {error && <p className="mensaje-error">{error}</p>}

            <section className="panel">
                <div className="encabezado-seccion">
                    <h3>Catálogo de categorías</h3>
                    {!cargando && <span className="contador">{catalogo.length} categorías</span>}
                </div>

                <div className="fila-agregar">
                    <input
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <input
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                    <button className="btn-primario" onClick={agregar}>
                        Agregar categoría
                    </button>
                </div>

                {cargando ? (
                    <p className="vacio">Cargando catálogo...</p>
                ) : catalogo.length === 0 ? (
                    <p className="vacio">El catálogo está vacío. Agrega la primera categoría.</p>
                ) : (
                    <div className="tabla-scroll">
                        <table className="tabla">
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {catalogo.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.nombre}</td>
                                    <td>{c.descripcion}</td>
                                    <td>
                                        <button className="btn-peligro" onClick={() => eliminar(c.id)}>
                                            Eliminar
                                        </button>
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
                    <h3>Todas las solicitudes</h3>
                    {!cargando && <span className="contador">{solicitudes.length} en total</span>}
                </div>

                {cargando ? (
                    <p className="vacio">Cargando solicitudes...</p>
                ) : solicitudes.length === 0 ? (
                    <p className="vacio">Todavía no hay solicitudes.</p>
                ) : (
                    <div className="tabla-scroll">
                        <table className="tabla">
                            <thead>
                            <tr>
                                <th>Título</th>
                                <th>Solicitante</th>
                                <th>Categoría</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                            </tr>
                            </thead>
                            <tbody>
                            {solicitudes.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.titulo}</td>
                                    <td>{s.usuarioSolicitante}</td>
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

export default AdminPage;