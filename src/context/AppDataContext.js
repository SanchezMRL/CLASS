import { createContext, useState } from "react";

export const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [historial, setHistorial] = useState([]);

  const registrarActividad = (accion, detalle) => {
    const nuevoRegistro = {
      id: Date.now(),
      accion,
      detalle,
      fecha: new Date().toLocaleString()
    };

    setHistorial(prev => [...prev, nuevoRegistro]);
  };

  return (
    <AppDataContext.Provider value={{
      usuarios,
      setUsuarios,
      productos,
      setProductos,
      historial,
      registrarActividad
    }}>
      {children}
    </AppDataContext.Provider>
  );
}
