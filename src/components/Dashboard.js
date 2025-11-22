import { useContext } from "react";
import { AppDataContext } from "../context/AppDataContext.js";

function Dashboard() {
  const { usuarios, productos, historial } = useContext(AppDataContext);

  return (
    <div className="box">
      <h2>Dashboard</h2>

      <p><b>Usuarios registrados:</b> {usuarios.length}</p>
      <p><b>Productos activos:</b> {productos.length}</p>

      <hr/>

      <h3>Actividad Reciente</h3>

      <div className="history-card">
        {historial.length === 0 && <p>No hay actividad aún...</p>}

        {historial.slice(-5).reverse().map(item => (
          <div key={item.id} className="history-item">
            <p><b>{item.accion}</b> — {item.detalle}</p>
            <small>{item.fecha}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
