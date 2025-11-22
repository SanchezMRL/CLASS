import { useState } from "react";

export default function useResource(initialData = []) {
  const [lista, setLista] = useState(initialData);
  const [nuevo, setNuevo] = useState("");

  const agregar = () => {
    if (!nuevo.trim()) return;

    setLista([
      ...lista,
      { id: Date.now(), nombre: nuevo }
    ]);

    setNuevo("");
  };

  const eliminar = (id) => {
    setLista(lista.filter(item => item.id !== id));
  };

  return {
    lista,
    nuevo,
    setNuevo,
    agregar,
    eliminar
  };
}
