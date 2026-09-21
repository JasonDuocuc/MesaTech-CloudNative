import { useMsal } from "@azure/msal-react";
import { useAuth } from "../hooks/useAuth";

const NOMBRE_ROL: Record<string, string> = {
    ROLE_CLIENTE: "Cliente",
    ROLE_OPERADOR: "Operador",
    ROLE_ADMINISTRADOR: "Administrador",
};

function Navbar() {
    const { instance } = useMsal();
    const { nombre, usuario, roles } = useAuth();
    const rol = roles.map((r) => NOMBRE_ROL[r] ?? r).join(", ");

    return (
        <header className="barra">
            <span className="barra-marca">MesaTech Cloud</span>
            <div className="barra-usuario">
                <span>{nombre ?? usuario}</span>
                {rol && <span className="barra-rol">{rol}</span>}
                <button onClick={() => instance.logoutRedirect()}>Cerrar sesión</button>
            </div>
        </header>
    );
}

export default Navbar;