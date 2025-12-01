import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePicture || null);
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setProfilePictureUrl(localUrl);

      // Lógica para subir la imagen al servidor
      const formData = new FormData();
      formData.append('profilePicture', file);
      // fetch('/api/user/profile-picture', { method: 'POST', body: formData })
      //   .then(response => response.json())
      //   .then(data => setProfilePictureUrl(data.profilePictureUrl));
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
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
              <img src={profilePictureUrl} alt="Profile" className="avatar-img" />
            ) : (
              user?.name ? user.name.charAt(0).toUpperCase() : "U"
            )}
          </div>
          <div className={`user-dropdown ${isDropdownOpen ? 'show' : ''}`}>
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
                    {user.role === 'profesor' ? '👨‍🏫 Profesor' : '👨‍🎓 Alumno'}
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
              style={{ display: 'none' }}
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