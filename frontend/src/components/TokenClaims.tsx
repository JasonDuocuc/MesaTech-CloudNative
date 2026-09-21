import { useAuth } from "../hooks/useAuth";

function TokenClaims() {
    const { claims } = useAuth();

    if (!claims) {
        return (
            <section className="panel">
                <p className="vacio">Cargando datos del token...</p>
            </section>
        );
    }

    const expiracion =
        typeof claims.exp === "number"
            ? new Date(claims.exp * 1000).toLocaleString("es-CL")
            : "-";

    const filas: [string, string][] = [
        ["Usuario (upn)", String(claims.upn ?? claims.unique_name ?? "-")],
        ["Roles", Array.isArray(claims.roles) ? claims.roles.join(", ") : "-"],
        ["Audience (aud)", String(claims.aud ?? "-")],
        ["Issuer (iss)", String(claims.iss ?? "-")],
        ["Scopes (scp)", String(claims.scp ?? "-")],
        ["Expira", expiracion],
    ];

    return (
        <section className="panel">
            <div className="encabezado-seccion">
                <h3>Claims del token</h3>
                <span className="contador">Datos de tu sesión en Entra ID</span>
            </div>
            <div className="tabla-scroll">
                <table className="tabla claims">
                    <tbody>
                    {filas.map(([nombre, valor]) => (
                        <tr key={nombre}>
                            <td>{nombre}</td>
                            <td>{valor}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default TokenClaims;