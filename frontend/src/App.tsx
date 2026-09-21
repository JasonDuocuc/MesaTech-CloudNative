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
            <main className="login">
                <section className="login-marca">
                    <h1>MesaTech Cloud</h1>
                    <p>Gestiona tus solicitudes de soporte técnico en un solo lugar.</p>
                </section>
                <section className="login-acceso">
                    <h2>Bienvenido</h2>
                    <p>Inicia sesión con tu cuenta de MesaTech para continuar.</p>
                    <button className="btn-primario btn-grande" onClick={iniciarSesion}>
                        Iniciar sesión con Microsoft
                    </button>
                </section>
            </main>
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
          <main className="contenedor">
              {pagina}
              <TokenClaims />
          </main>
      </div>
  );
}

export default App;