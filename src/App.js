import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { ConfigContext } from "./context/ConfigContext";

import Login from "./Login";
import Panel from "./Panel";

function App() {
  const { isLogged } = useContext(AuthContext);
  const { tema, tamanoFuente } = useContext(ConfigContext);

  useEffect(() => {
    document.body.className = tema === "oscuro" ? "tema-oscuro" : "tema-claro";
    document.body.style.fontSize = tamanoFuente;
  }, [tema, tamanoFuente]);

  return <>{isLogged ? <Panel /> : <Login />}</>;
}

export default App;
