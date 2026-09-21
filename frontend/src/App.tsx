import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./auth/authConfig";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import TokenClaims from "./components/TokenClaims";
import ClientePage from "./pages/ClientePage";
import OperadorPage from "./pages/OperadorPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const { instance } = useMsal();
  const { estaAutenticado, roles } = useAuth();

  const iniciarSesion = () => {
    instance.loginRedirect(loginRequest);
  };

  if (!estaAutenticado) {
    return (
        <div style={{ padding: 24 }}>
          <h1>MesaTech Cloud</h1>
          <button onClick={iniciarSesion}>Iniciar sesión</button>
        </div>
    );
  }

  let pagina;
  if (roles.includes("ROLE_ADMINISTRADOR")) {
    pagina = <AdminPage />;
  } else if (roles.includes("ROLE_OPERADOR")) {
    pagina = <OperadorPage />;
  } else if (roles.includes("ROLE_CLIENTE")) {
    pagina = <ClientePage />;
  } else {
    pagina = <p>Cargando tu perfil...</p>;
  }

  return (
      <div>
        <Navbar />
        <div style={{ padding: 24 }}>
          {pagina}
          <TokenClaims />
        </div>
      </div>
  );
}

export default App;