import { useAuth } from "../hooks/useAuth";

function TokenClaims() {
    const { claims } = useAuth();

    if (!claims) {
        return <p>Cargando datos del token...</p>;
    }

    const expiracion =
        typeof claims.exp === "number"
            ? new Date(claims.exp * 1000).toLocaleString()
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
        <div style={{ marginTop: 24 }}>
            <h2>Claims del token</h2>
            <table style={{ borderCollapse: "collapse" }}>
                <tbody>
                {filas.map(([nombre, valor]) => (
                    <tr key={nombre}>
                        <td style={{ padding: "4px 12px", fontWeight: "bold" }}>{nombre}</td>
                        <td style={{ padding: "4px 12px" }}>{valor}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default TokenClaims;