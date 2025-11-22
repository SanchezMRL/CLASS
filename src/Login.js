import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");

  const enviar = (e) => {
    e.preventDefault();
    login(usuario, clave);
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={enviar}>
        <h2>Iniciar Sesión</h2>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;
