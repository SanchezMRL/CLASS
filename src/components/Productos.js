import { useContext, useState } from "react";
import { AppDataContext } from "../context/AppDataContext.js";

function Productos() {
  const { productos, setProductos } = useContext(AppDataContext);
  const [nuevo, setNuevo] = useState("");

  const agregar = () => {
    if (!nuevo.trim()) return;

    setProductos([
      ...productos,
      { id: Date.now(), nombre: nuevo }
    ]);

    setNuevo("");
  };

  const eliminar = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Productos</h2>

      <input
        className="input-login"
        placeholder="Nuevo producto"
        value={nuevo}
        onChange={e => setNuevo(e.target.value)}
      />

      <button className="btn-login" onClick={agregar}>
        Agregar
      </button>

      <div className="list-card">
        {productos.map(p => (
          <div key={p.id} className="list-item">
            {p.nombre}
            <button className="btn-delete" onClick={() => eliminar(p.id)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Productos;
