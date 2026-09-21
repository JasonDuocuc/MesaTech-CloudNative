import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { listarSolicitudes, crearSolicitud } from "../api/solicitudesApi";
import type { Solicitud, Prioridad } from "../types/models";

function ClientePage() {
    const { usuario } = useAuth();
    const miUsuario = usuario?.split("@")[0] ?? "";

    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        if (!titulo.trim() || !descripcion.trim()) {
            setError("Completa el título y la descripción.");
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
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error al crear la solicitud");
        }
    }

    const mias = solicitudes.filter((s) => s.usuarioSolicitante === miUsuario);

    return (
        <div>
            <h2>Panel del Cliente</h2>

            <h3>Nueva solicitud</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
                <input
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
                <textarea
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option>Accesos</option>
                    <option>Hardware</option>
                    <option>Software</option>
                    <option>Redes</option>
                    <option>Otro</option>
                </select>
                <select
                    value={prioridad}
                    onChange={(e) => setPrioridad(e.target.value as Prioridad)}
                >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                </select>
                <button onClick={enviar}>Crear solicitud</button>
            </div>

            {error && <p style={{ color: "tomato" }}>{error}</p>}

            <h3>Mis solicitudes</h3>
            {cargando ? (
                <p>Cargando...</p>
            ) : mias.length === 0 ? (
                <p>Aún no tienes solicitudes.</p>
            ) : (
                <table style={{ borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th style={{ padding: "4px 12px" }}>Título</th>
                        <th style={{ padding: "4px 12px" }}>Categoría</th>
                        <th style={{ padding: "4px 12px" }}>Prioridad</th>
                        <th style={{ padding: "4px 12px" }}>Estado</th>
                        <th style={{ padding: "4px 12px" }}>Fecha</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mias.map((s) => (
                        <tr key={s.id}>
                            <td style={{ padding: "4px 12px" }}>{s.titulo}</td>
                            <td style={{ padding: "4px 12px" }}>{s.categoria}</td>
                            <td style={{ padding: "4px 12px" }}>{s.prioridad}</td>
                            <td style={{ padding: "4px 12px" }}>{s.estado}</td>
                            <td style={{ padding: "4px 12px" }}>
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

export default ClientePage;