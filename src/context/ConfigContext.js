import { createContext, useEffect, useState } from "react";

export const ConfigContext = createContext();

export function ConfigProvider({ children }) {

  const [tema, setTema] = useState(() =>
    localStorage.getItem("tema") || "claro"
  );

  const [tamanoFuente, setTamanoFuente] = useState(() =>
    localStorage.getItem("tamanoFuente") || "16px"
  );

  useEffect(() => {
    localStorage.setItem("tema", tema);
  }, [tema]);

  useEffect(() => {
    localStorage.setItem("tamanoFuente", tamanoFuente);
  }, [tamanoFuente]);

  return (
    <ConfigContext.Provider value={{
      tema,
      setTema,
      tamanoFuente,
      setTamanoFuente
    }}>
      {children}
    </ConfigContext.Provider>
  );
}
