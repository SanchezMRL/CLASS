import { useContext } from "react";
import { ConfigContext } from "../context/ConfigContext";

function Configuracion() {
  const {
    tema,
    setTema,
    tamanoFuente,
    setTamanoFuente
  } = useContext(ConfigContext);

  return (
    <div className="box">
      <h2>Configuración del Sistema</h2>

      {/* Tema */}
      <div>
        <label><b>Tema:</b></label>
        <select value={tema} onChange={e => setTema(e.target.value)}>
          <option value="claro">Claro</option>
          <option value="oscuro">Oscuro</option>
        </select>
      </div>

      {/* Tamaño de Fuente */}
      <div>
        <label><b>Tamaño de Fuente:</b></label>
        <select
          value={tamanoFuente}
          onChange={e => setTamanoFuente(e.target.value)}
        >
          <option value="14px">Pequeño</option>
          <option value="16px">Normal</option>
          <option value="20px">Grande</option>
        </select>
      </div>
    </div>
  );
}

export default Configuracion;
