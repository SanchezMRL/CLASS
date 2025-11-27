import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // La redirección se manejará automáticamente por el estado de autenticación
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          &#9776;
        </button>
        <div className="logo">Aula Virtual</div>
      </div>
      <div className="header-right">
        <div className="user-menu">
          <div 
            className="user-avatar" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {isDropdownOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-item">{user?.name}</div>
              <div className="user-dropdown-item">{user?.email}</div>
              <div className="user-dropdown-item" onClick={handleLogout}>
                Cerrar Sesión
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;