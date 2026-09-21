import { useMsal } from "@azure/msal-react";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
    const { instance } = useMsal();
    const { nombre, usuario, roles } = useAuth();

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 24px",
                background: "#1f2937",
                color: "white",
            }}
        >
            <strong>MesaTech Cloud</strong>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <span>
          {nombre ?? usuario} ({roles.join(", ") || "..."})
        </span>
                <button onClick={() => instance.logoutRedirect()}>Cerrar sesión</button>
            </div>
        </nav>
    );
}

export default Navbar;