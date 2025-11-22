function MenuLateral({ setVista }) {
  return (
    <div className="menu-lateral">
      <h3>ADMIN</h3>
      <hr />

      <p onClick={() => setVista("dashboard")}>Dashboard</p>
      <p onClick={() => setVista("usuarios")}>Usuarios</p>
      <p onClick={() => setVista("productos")}>Productos</p>
      <p onClick={() => setVista("config")}>Configuración</p>
      <p onClick={() => setVista("peliculas")}>Películas</p>
    </div>
  );
}

export default MenuLateral;   
