import { useContext, useState } from "react";
import { AppDataContext } from "../context/AppDataContext.js";

function Usuarios() {
  const { usuarios, setUsuarios } = useContext(AppDataContext);
  const [nuevo, setNuevo] = useState("");

  const agregar = () => {
    if (!nuevo.trim()) return;

    setUsuarios([
      ...usuarios,
      { id: Date.now(), nombre: nuevo }
    ]);

    setNuevo("");
  };

  const eliminar = (id) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  return (
    <div className="box">
      <h2>Usuarios</h2>

      <div className="formulario">
        <input
          placeholder="Nuevo usuario"
          value={nuevo}
          onChange={e => setNuevo(e.target.value)}
        />

        <button className="btn-full" onClick={agregar}>
          Agregar
        </button>
      </div>

      <ul className="lista">
        {usuarios.map(u => (
          <li key={u.id}>
            {u.nombre}
            <button className="btn-eliminar" onClick={() => eliminar(u.id)}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Usuarios;
