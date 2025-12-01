import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // --- NUEVO: Leemos la foto guardada en localStorage al cargar el componente ---
  const [profilePictureUrl, setProfilePictureUrl] = useState(() => {
    const savedPicture = localStorage.getItem('userProfilePicture');
    return savedPicture || user?.avatar_url || null;
  });

  const fileInputRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- MODIFICADO: Ahora guardamos la imagen en localStorage ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // reader.result es la imagen en formato Base64 (un texto largo)
        const base64String = reader.result;
        
        // 1. Guardamos la imagen en localStorage para que persista
        localStorage.setItem('userProfilePicture', base64String);
        
        // 2. Actualizamos el estado para verla inmediatamente
        setProfilePictureUrl(base64String);
      };

      reader.readAsDataURL(file); // Inicia la lectura del archivo
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          &#9776;
        </button>
        <div className="logo">Aula Virtual</div>
      </div>
      <div className="header-right">
        <div
          className="user-menu"
          ref={dropdownRef}
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <div className="user-avatar">
            {profilePictureUrl ? (
              // --- NUEVO: La etiqueta img con estilos para que se ajuste ---
              <img src={profilePictureUrl} alt="Profile" className="avatar-img" />
            ) : (
              user?.name ? user.name.charAt(0).toUpperCase() : "U"
            )}
          </div>
          <div className={`user-dropdown ${isDropdownOpen ? "show" : ""}`}>
            <div className="user-dropdown-header">
              <div className="user-dropdown-avatar">
                {profilePictureUrl ? (
                  <img src={profilePictureUrl} alt="Profile" className="avatar-img" />
                ) : (
                  user?.name ? user.name.charAt(0).toUpperCase() : "U"
                )}
              </div>
              <div className="user-dropdown-info">
                <div className="user-dropdown-name">{user?.name}</div>
                <div className="user-dropdown-email">{user?.email}</div>
                {user?.role && (
                  <div className="user-dropdown-role">
                    {user.role === "profesor" ? "👨‍🏫 Profesor" : "👨‍🎓 Alumno"}
                  </div>
                )}
              </div>
            </div>
            <div className="user-dropdown-divider"></div>
            <button className="user-dropdown-item" onClick={triggerFileSelect}>
              <span className="change-photo-icon">📷</span>
              Cambiar Foto de Perfil
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/png, image/jpeg, image/webp"
            />
            <div className="user-dropdown-divider"></div>
            <button className="user-dropdown-item logout-item" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
