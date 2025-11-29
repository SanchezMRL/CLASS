import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-nav-item">
          <span className="sidebar-nav-icon">&#127968;</span>
          <span className="sidebar-nav-text">Dashboard</span>
        </NavLink>
        <NavLink to="/cursos" className="sidebar-nav-item">
          <span className="sidebar-nav-icon">&#128214;</span>
          <span className="sidebar-nav-text">Cursos</span>
        </NavLink>
        <NavLink to="/horarios" className="sidebar-nav-item">
          <span className="sidebar-nav-icon">&#128197;</span>
          <span className="sidebar-nav-text">Horarios</span>
        </NavLink>
        <NavLink to="/configuracion" className="sidebar-nav-item">
          <span className="sidebar-nav-icon">&#2699;</span>
          <span className="sidebar-nav-text">Configuración</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
