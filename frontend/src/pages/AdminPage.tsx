import { useEffect, useState } from "react";
import {
    obtenerCatalogo,
    crearItem,
    actualizarItem,
    eliminarItem,
} from "../api/catalogoApi";
import { listarSolicitudes } from "../api/solicitudesApi";
import { legible, fechaCorta } from "../utils/formato";
import type { Categoria, Prioridad } from "../types/dto";
import type { Solicitud } from "../types/models"; // temporal, hasta migrar solicitudes

interface Item {
    id: number;
    nombre: string;
}

interface EditorProps {
    titulo: string;
    singular: string;
    items: Item[];
    cargando: boolean;
    onCrear: (nombre: string) => Promise<boolean>;
    onActualizar: (id: number, nombre: string) => Promise<boolean>;
    onEliminar: (id: number) => Promise<boolean>;
}

function EditorCatalogo({
                            titulo,
                            singular,
                            items,
                            cargando,
                            onCrear,
                            onActualizar,
                            onEliminar,
                        }: EditorProps) {
    const [nuevo, setNuevo] = useState("");
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [nombreEditado, setNombreEditado] = useState("");

    async function agregar() {
        const nombre = nuevo.trim();
        if (!nombre) return;
        if (await onCrear(nombre)) setNuevo("");
    }

    async function guardar(id: number) {
        const nombre = nombreEditado.trim();
        if (!nombre) return;
        if (await onActualizar(id, nombre)) setEditandoId(null);
    }

    async function eliminar(item: Item) {
        if (!window.confirm(`¿Eliminar "${item.nombre}"?`)) return;
        await onEliminar(item.id);
    }

    function empezarEdicion(item: Item) {
        setEditandoId(item.id);
        setNombreEditado(item.nombre);
    }

    return (
        <section className="panel">
            <div className="encabezado-seccion">
                <h3>{titulo}</h3>
                {!cargando && <span className="contador">{items.length} en total</span>}
            </div>

            <div className="fila-agregar">
                <input
                    placeholder={`Nueva ${singular}`}
                    aria-label={`Nombre de la nueva ${singular}`}
                    value={nuevo}
                    onChange={(e) => setNuevo(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") agregar();
                    }}
                />
                <button className="btn-primario" onClick={agregar}>
                    Agregar
                </button>
            </div>

            {cargando ? (
                <p className="vacio">Cargando...</p>
            ) : items.length === 0 ? (
                <p className="vacio">Aún no hay elementos. Agrega el primero.</p>
            ) : (
                <div className="tabla-scroll">
                    <table className="tabla">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {editandoId === item.id ? (
                                        <input
                                            aria-label={`Nuevo nombre para ${item.nombre}`}
                                            value={nombreEditado}
                                            onChange={(e) => setNombreEditado(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") guardar(item.id);
                                                if (e.key === "Escape") setEditandoId(null);
                                            }}
                                        />
                                    ) : (
                                        item.nombre
                                    )}
                                </td>
                                <td>
                                    <div className="acciones">
                                        {editandoId === item.id ? (
                                            <>
                                                <button className="btn-primario" onClick={() => guardar(item.id)}>
                                                    Guardar
                                                </button>
                                                <button onClick={() => setEditandoId(null)}>Cancelar</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => empezarEdicion(item)}>Editar</button>
                                                <button className="btn-peligro" onClick={() => eliminar(item)}>
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

function AdminPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [prioridades, setPrioridades] = useState<Prioridad[]>([]);
    const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [cargandoSolicitudes, setCargandoSolicitudes] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        obtenerCatalogo()
            .then((c) => {
                setCategorias(c.categorias);
                setPrioridades(c.prioridades);
            })
            .catch((e) => setError(e.message))
            .finally(() => setCargandoCatalogo(false));

        listarSolicitudes()
            .then(setSolicitudes)
            .catch((e) => setError(e.message))
            .finally(() => setCargandoSolicitudes(false));
    }, []);

    async function ejecutar(accion: () => Promise<void>): Promise<boolean> {
        try {
            setError(null);
            await accion();
            return true;
        } catch (e) {
            setError(e instanceof Error ? e.message : "Ocurrió un error inesperado.");
            return false;
        }
    }

    const crearCategoria = (nombre: string) =>
        ejecutar(async () => {
            const nueva = await crearItem<Categoria>("categorias", { nombre });
            setCategorias((anteriores) => [...anteriores, nueva]);
        });

    const actualizarCategoria = (id: number, nombre: string) =>
        ejecutar(async () => {
            const actualizada = await actualizarItem<Categoria>("categorias", id, { nombre });
            setCategorias((anteriores) =>
                anteriores.map((c) => (c.id === id ? actualizada : c))
            );
        });

    const eliminarCategoria = (id: number) =>
        ejecutar(async () => {
            await eliminarItem("categorias", id);
            setCategorias((anteriores) => anteriores.filter((c) => c.id !== id));
        });

    const crearPrioridad = (nombre: string) =>
        ejecutar(async () => {
            const nueva = await crearItem<Prioridad>("prioridades", { nombre });
            setPrioridades((anteriores) => [...anteriores, nueva]);
        });

    const actualizarPrioridad = (id: number, nombre: string) =>
        ejecutar(async () => {
            const actualizada = await actualizarItem<Prioridad>("prioridades", id, { nombre });
            setPrioridades((anteriores) =>
                anteriores.map((p) => (p.id === id ? actualizada : p))
            );
        });

    const eliminarPrioridad = (id: number) =>
        ejecutar(async () => {
            await eliminarItem("prioridades", id);
            setPrioridades((anteriores) => anteriores.filter((p) => p.id !== id));
        });

    const catalogoIncompleto =
        !cargandoCatalogo && (categorias.length === 0 || prioridades.length === 0);

    return (
        <div>
            <h2>Administración</h2>

            {error && <p className="mensaje-error">{error}</p>}
            {catalogoIncompleto && (
                <p className="mensaje-aviso">
                    Los clientes no podrán crear solicitudes hasta que exista al menos una
                    categoría y una prioridad.
                </p>
            )}

            <EditorCatalogo
                titulo="Categorías"
                singular="categoría"
                items={categorias}
                cargando={cargandoCatalogo}
                onCrear={crearCategoria}
                onActualizar={actualizarCategoria}
                onEliminar={eliminarCategoria}
            />

            <EditorCatalogo
                titulo="Prioridades"
                singular="prioridad"
                items={prioridades}
                cargando={cargandoCatalogo}
                onCrear={crearPrioridad}
                onActualizar={actualizarPrioridad}
                onEliminar={eliminarPrioridad}
            />

            <section className="panel">
                <div className="encabezado-seccion">
                    <h3>Todas las solicitudes</h3>
                    {!cargandoSolicitudes && (
                        <span className="contador">{solicitudes.length} en total</span>
                    )}
                </div>

                {cargandoSolicitudes ? (
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