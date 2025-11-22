import { useState } from "react";

export const usePeliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // 👉 ESTA función es la que tu componente necesita
  const cargarPeliculas = async (busqueda) => {
    if (!busqueda) return;

    try {
      setCargando(true);
      setError(null);

      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${busqueda}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNDIzNDM3ODdkMWM3MzFiZmUxMzE5OWZjNjg5OWViMSIsIm5iZiI6MTc2MzY3OTcwMi43NDU5OTk4LCJzdWIiOiI2OTFmOWRkNjFkOWFkNDdmYmI0YTJkYWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Jz5X2u_LXNZsUjph1zfiaKOurw38_KhR1vassCKXGE4`,
          },
        }
      );

      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setError("No se encontraron películas");
        setPeliculas([]);
      } else {
        setPeliculas(data.results);
        setError(null);
      }

    } catch (err) {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return {
    peliculas,
    cargando,
    error,
    cargarPeliculas, 
  };
};
