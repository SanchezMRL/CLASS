import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../common/Loading";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        showNotification("Perfil actualizado correctamente", "success");
      } else {
        showNotification(
          result.message || "Error al actualizar perfil",
          "error"
        );
      }
    } catch (error) {
      showNotification(
        "Error de conexión. Inténtalo de nuevo más tarde.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="settings-container">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="settings-content">
        <Sidebar isOpen={sidebarOpen} />
        <main
          className={`main-content ${
            sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <div className="settings-header">
            <h1>Configuración</h1>
          </div>
          {notification.show && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          <div className="settings-layout">
            <div className="settings-tabs">
              <button
                className={activeTab === "profile" ? "active" : ""}
                onClick={() => setActiveTab("profile")}
              >
                Perfil
              </button>
              <button
                className={activeTab === "security" ? "active" : ""}
                onClick={() => setActiveTab("security")}
              >
                Seguridad
              </button>
            </div>
            <div className="settings-content-area">
              {activeTab === "profile" && (
                <div className="settings-section">
                  <h2>Información del Perfil</h2>
                  <form
                    onSubmit={handleProfileSubmit}
                    className="settings-form"
                  >
                    <div className="form-group">
                      <label htmlFor="name">Nombre Completo</label>
                      <input
                        type="text"
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Correo Electrónico</label>
                      <input
                        type="email"
                        id="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Teléfono</label>
                      <input
                        type="tel"
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bio">Biografía</label>
                      <textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        rows="4"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="save-button"
                      disabled={isLoading}
                    >
                      {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </form>
                </div>
              )}
              {activeTab === "security" && (
                <div className="settings-section">
                  <h2>Seguridad de la Cuenta</h2>
                  <p>Funcionalidad de cambio de contraseña próximamente.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
