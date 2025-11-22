import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

import MenuLateral from "./components/MenuLateral";
import Dashboard from "./components/Dashboard";
import Usuarios from "./components/Usuarios";
import Productos from "./components/Productos";  
import Configuracion from "./components/Configuracion";
import { Peliculas } from "./components/Peliculas";

function Panel() {
  const { logout } = useContext(AuthContext);
  const [vista, setVista] = useState("dashboard");

  const cargarVista = () => {
    switch (vista) {
      case "dashboard":
        return <Dashboard />;
      case "usuarios":
        return <Usuarios />;
      case "productos":
        return <Productos />;
      case "config":
        return <Configuracion />;
      case "peliculas":                    
        return <Peliculas />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <MenuLateral setVista={setVista} />

      <div style={{ padding: "20px", flexGrow: 1 }}>
        <button onClick={logout} style={{ float: "right" }}>
          Cerrar Sesión
        </button>

        {cargarVista()}  {/* ✅ ahora sí cambia correctamente */}
      </div>
    </div>
  );
}

export default Panel;
