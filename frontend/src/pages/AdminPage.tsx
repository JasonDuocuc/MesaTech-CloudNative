import { useEffect, useState } from "react";
import {
    listarCatalogo,
    crearItemCatalogo,
    eliminarItemCatalogo,
} from "../api/catalogoApi";
import { listarSolicitudes } from "../api/solicitudesApi";
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
            setError("El nombre es obligatorio.");
            return;
        }
        try {
            setError(null);
            const nuevo = await crearItemCatalogo({ nombre, descripcion });
            setCatalogo((anterior) => [...anterior, nuevo]);
            setNombre("");
            setDescripcion("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error al agregar");
        }
    }

    async function eliminar(id: number) {
        try {
            setError(null);
            await eliminarItemCatalogo(id);
            setCatalogo((anterior) => anterior.filter((c) => c.id !== id));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error al eliminar");
        }
    }

    const celda = { padding: "4px 12px" };

    return (
        <div>
            <h2>Panel del Administrador</h2>

            {error && <p style={{ color: "tomato" }}>{error}</p>}

            <h3>Catálogo</h3>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
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
                <button onClick={agregar}>Agregar</button>
            </div>

            {cargando ? (
                <p>Cargando...</p>
            ) : (
                <table style={{ borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th style={celda}>Nombre</th>
                        <th style={celda}>Descripción</th>
                        <th style={celda}></th>
                    </tr>
                    </thead>
                    <tbody>
                    {catalogo.map((c) => (
                        <tr key={c.id}>
                            <td style={celda}>{c.nombre}</td>
                            <td style={celda}>{c.descripcion}</td>
                            <td style={celda}>
                                <button onClick={() => eliminar(c.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <h3>Todas las solicitudes</h3>
            {cargando ? (
                <p>Cargando...</p>
            ) : solicitudes.length === 0 ? (
                <p>No hay solicitudes.</p>
            ) : (
                <table style={{ borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th style={celda}>Título</th>
                        <th style={celda}>Solicitante</th>
                        <th style={celda}>Categoría</th>
                        <th style={celda}>Prioridad</th>
                        <th style={celda}>Estado</th>
                        <th style={celda}>Fecha</th>
                    </tr>
                    </thead>
                    <tbody>
                    {solicitudes.map((s) => (
                        <tr key={s.id}>
                            <td style={celda}>{s.titulo}</td>
                            <td style={celda}>{s.usuarioSolicitante}</td>
                            <td style={celda}>{s.categoria}</td>
                            <td style={celda}>{s.prioridad}</td>
                            <td style={celda}>{s.estado}</td>
                            <td style={celda}>
                                {new Date(s.fechaCreacion).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminPage;