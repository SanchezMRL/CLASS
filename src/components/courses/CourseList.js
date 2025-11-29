import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import { useCourses } from "../../hooks/useCourses";
import Loading from "../common/Loading";

const CourseList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { courses, loading, error } = useCourses();

  const filteredCourses = courses.filter((course) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !course.completed) ||
      (filter === "completed" && course.completed);
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });


  const getButtonStyle = (isActive) => ({
    padding: '10px 15px',
    backgroundColor: isActive ? 'var(--primary-color)' : '#f8f9fa',
    color: isActive ? 'white' : '#333',
    border: `1px solid ${isActive ? 'var(--primary-color)' : '#ccc'}`,
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease-in-out',
    marginRight: '10px' 
  });

  const filterOptions = [
    { key: 'all', label: 'Todos' },
    { key: 'active', label: 'Activos' },
    { key: 'completed', label: 'Completados' },
  ];



  return (
    <div className="course-container">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="course-content">
        <Sidebar isOpen={sidebarOpen} />
        <main
          className={`main-content ${
            sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <div className="course-header">
            <h1>Mis Cursos</h1>
            <div className="course-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {

              }
              <div className="filter-buttons">
                {filterOptions.map(option => (
                  <button
                    key={option.key}
                    // 3. Aplicamos el estilo directamente aquí
                    style={getButtonStyle(filter === option.key)}
                    onClick={() => setFilter(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {
              }

            </div>
          </div>
          {loading ? (
            <Loading />
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="course-grid">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course.id} className="course-card">
                    <div className="course-image">
                      <img
                        src={
                          course.image ||
                          "https://picsum.photos/seed/course/300/200.jpg"
                        }
                        alt={course.name}
                      />
                    </div>
                    <div className="course-info">
                      <h3>{course.name}</h3>
                      <p className="instructor">{course.instructor}</p>
                      <div className="course-meta">
                        <span className="duration">{course.duration}</span>
                        <span className="students">
                          {course.students} estudiantes
                        </span>
                      </div>
                      <div className="course-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span>{course.progress}% completado</span>
                      </div>
                    </div>
                    <div className="course-actions">
                      <Link
                        to={`/cursos/${course.id}`}
                        className="primary-button"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-courses">
                  <p>No se encontraron cursos con los filtros seleccionados.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseList;