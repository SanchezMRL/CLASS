import React, { useState } from "react";
import { usePeliculas } from "../hooks/usePeliculas";

export const Peliculas = () => {
  const [busqueda, setBusqueda] = useState("");
  const { peliculas, cargarPeliculas } = usePeliculas();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (busqueda.trim() !== "") {
      cargarPeliculas(busqueda);
    }
  };

  return (
    <div style={styles.contenedor}>
      <h2 style={styles.titulo}>Buscar Películas</h2>

      {/* BUSCADOR */}
      <form onSubmit={handleSubmit} style={styles.formulario}>
        <input
          style={styles.input}
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Escribe el nombre de la película..."
        />
        <button style={styles.boton}>Buscar</button>
      </form>

      {/* RESULTADOS */}
      <div style={styles.grid}>
        {peliculas.length === 0 ? (
          <p style={styles.mensaje}>No hay resultados todavía. Busca algo arriba 🔍</p>
        ) : (
          peliculas.map((pelicula) => (
            <div key={pelicula.id} style={styles.card}>
              {pelicula.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${pelicula.poster_path}`}
                  alt={pelicula.title}
                  style={styles.imagen}
                />
              ) : (
                <div style={styles.imagenVacia}>Sin imagen</div>
              )}

              <h4 style={styles.cardTitulo}>{pelicula.title}</h4>
              <p style={styles.fecha}>{pelicula.release_date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 🎨 ESTILOS
const styles = {
  contenedor: {
    width: "90%",
    maxWidth: "900px",
    margin: "30px auto",
    textAlign: "center",
  },
  titulo: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  formulario: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "25px",
  },
  input: {
    padding: "10px",
    width: "300px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  boton: {
    padding: "10px 20px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    padding: "10px",
    borderRadius: "10px",
    background: "#f8f8f8",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.15)",
  },
  imagen: {
    width: "100%",
    borderRadius: "8px",
  },
  imagenVacia: {
    width: "100%",
    height: "260px",
    background: "#ddd",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#666",
  },
  cardTitulo: {
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  fecha: {
    fontSize: "13px",
    color: "#555",
  },
  mensaje: {
    color: "#777",
    fontSize: "16px",
    marginTop: "30px",
  },
};
