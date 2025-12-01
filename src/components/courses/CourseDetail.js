import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import { useCourses } from "../../hooks/useCourses";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../common/Loading";
import AddResourceModal from "./AddResourceModal";
import AssignmentDetailModal from "./AssignmentDetailModal";
import { resourceService } from "../../services/resourceService";

const CourseDetail = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [expandedWeeks, setExpandedWeeks] = useState({
    1: false,
    2: false,
    3: true,
    4: false,
    5: false,
  });
  const [expandedTopics, setExpandedTopics] = useState({
    "week3-topic1": true,
  });
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [selectedWeekForAdd, setSelectedWeekForAdd] = useState(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [courseResources, setCourseResources] = useState({ weeks: {} });
  const { id } = useParams();
  const { courses, loading } = useCourses();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (courses.length > 0) {
      const foundCourse = courses.find((c) => c.id === id);
      setCourse(foundCourse);
    }
  }, [id, courses]);

  useEffect(() => {
    const loadResources = async () => {
      if (id && user) {
        const resources = await resourceService.getCourseResources(id);
        
        // Si es alumno, verificar qué tareas ya entregó
        if (user.role === 'alumno') {
          for (const weekKey in resources.weeks) {
            const week = resources.weeks[weekKey];
            for (const topic of week.topics) {
              for (const resource of topic.resources) {
                if (resource.type === 'assignment') {
                  const hasSubmitted = await resourceService.hasSubmitted(resource.id, user.id);
                  if (hasSubmitted) {
                    resource.status = 'submitted';
                  }
                }
              }
            }
          }
        }
        
        setCourseResources(resources);
      }
    };
    loadResources();
  }, [id, user]);

  const toggleWeek = (weekNumber) => {
    setExpandedWeeks((prev) => ({ ...prev, [weekNumber]: !prev[weekNumber] }));
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const handleAddResource = (weekNumber) => {
    setSelectedWeekForAdd(weekNumber);
    setIsAddResourceModalOpen(true);
  };

  const handleResourceAdded = async (resourceData) => {
    await resourceService.addResource(
      id,
      selectedWeekForAdd,
      1,
      resourceData
    );
    const updatedResources = await resourceService.getCourseResources(id);
    setCourseResources(updatedResources);
  };

  const handleDeleteResource = async (weekNumber, topicId, resourceId) => {
    if (window.confirm("¿Estás seguro de eliminar este recurso?")) {
      await resourceService.deleteResource(
        id,
        weekNumber,
        topicId,
        resourceId
      );
      const updatedResources = await resourceService.getCourseResources(id);
      setCourseResources(updatedResources);
    }
  };

  const handleOpenAssignment = (assignment) => {
    console.log('🎯 handleOpenAssignment - assignment completo:', assignment);
    console.log('📦 Submissions en assignment:', assignment.submissions);
    setSelectedAssignment(assignment);
    setIsAssignmentModalOpen(true);
  };

  const handleSubmitAssignment = async (submissionData) => {
    if (selectedAssignment && selectedWeekForAdd) {
      await resourceService.submitAssignment(
        id,
        selectedWeekForAdd,
        1,
        selectedAssignment.id,
        submissionData
      );
      const updatedResources = await resourceService.getCourseResources(id);
      setCourseResources(updatedResources);
    }
  };

  const getWeekResources = (weekNumber) => {
    return courseResources.weeks[weekNumber] || null;
  };

  const handleViewResource = async (resource) => {
    console.log('Ver recurso:', resource);
    if (resource.url && resource.url !== '#') {
      window.open(resource.url, '_blank');
    } else {
      alert('Este recurso no tiene archivo adjunto');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="course-detail-container">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="course-detail-content">
          <Sidebar isOpen={sidebarOpen} />
          <main
            className={`main-content ${
              sidebarOpen ? "sidebar-open" : "sidebar-closed"
            }`}
          >
            <div className="error-message">
              <h2>Curso no encontrado</h2>
              <Link to="/cursos" className="primary-button">
                Volver a Cursos
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-container">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="course-detail-content">
        <Sidebar isOpen={sidebarOpen} />
        <main
          className={`main-content ${
            sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <div className="course-detail-header">
            <Link to="/cursos" className="back-link">
              ← Volver a Cursos
            </Link>
            <div className="course-hero">
              <div className="course-hero-image">
                <img
                  src={
                    course.image ||
                    "https://picsum.photos/seed/course/800/400.jpg"
                  }
                  alt={course.name}
                />
              </div>
              <div className="course-hero-info">
                <h1>{course.name}</h1>
                <p className="course-instructor">Por {course.instructor}</p>
                <div className="course-meta-info">
                  <span className="duration">📚 {course.duration}</span>
                  <span className="students">
                    👥 {course.students} estudiantes
                  </span>
                  <span className="level">📊 Nivel: Intermedio</span>
                </div>
                <div className="course-progress-section">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span>{course.progress}% completado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="course-detail-tabs">
            <button
              className={activeTab === "content" ? "active" : ""}
              onClick={() => setActiveTab("content")}
            >
              Contenido
            </button>
            <button
              className={activeTab === "description" ? "active" : ""}
              onClick={() => setActiveTab("description")}
            >
              Descripción
            </button>
            <button
              className={activeTab === "resources" ? "active" : ""}
              onClick={() => setActiveTab("resources")}
            >
              Recursos
            </button>
          </div>

          <div className="course-detail-body">
            {activeTab === "content" && (
              <div className="course-content">
                <div className="course-info-section">
                  <button
                    className="info-header"
                    onClick={() =>
                      setExpandedTopics((prev) => ({
                        ...prev,
                        info: !prev["info"],
                      }))
                    }
                  >
                    <span>📚 Información del curso</span>
                    <span className="toggle-icon">
                      {expandedTopics["info"] ? "▲" : "▼"}
                    </span>
                  </button>
                </div>

                <div className="weeks-section">
                  <h3 className="weeks-title">Total de semanas (18)</h3>

                  {[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18,
                  ].map((weekNum) => {
                    const weekData = getWeekResources(weekNum);
                    const hasTopic =
                      weekData && weekData.topics && weekData.topics.length > 0;

                    return (
                      <div key={weekNum} className="week-item">
                        <button
                          className={`week-header ${
                            expandedWeeks[weekNum] ? "expanded" : ""
                          }`}
                          onClick={() => toggleWeek(weekNum)}
                        >
                          <span className="week-title">
                            Semana {weekNum < 10 ? "0" + weekNum : weekNum}
                          </span>
                          <span className="toggle-icon">
                            {expandedWeeks[weekNum] ? "▲" : "▼"}
                          </span>
                        </button>

                        {expandedWeeks[weekNum] && (
                          <div className="week-content">
                            {hasTopic ? (
                              weekData.topics.map((topic) => (
                                <div key={topic.id} className="topic-item">
                                  <button
                                    className={`topic-header ${
                                      expandedTopics[
                                        `week${weekNum}-topic${topic.id}`
                                      ]
                                        ? "expanded"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      toggleTopic(
                                        `week${weekNum}-topic${topic.id}`
                                      )
                                    }
                                  >
                                    <span className="topic-title">
                                      {topic.name}
                                    </span>
                                    <span className="toggle-icon">
                                      {expandedTopics[
                                        `week${weekNum}-topic${topic.id}`
                                      ]
                                        ? "▲"
                                        : "▼"}
                                    </span>
                                  </button>

                                  {expandedTopics[
                                    `week${weekNum}-topic${topic.id}`
                                  ] && (
                                    <div className="topic-content">
                                      {topic.resources.map((resource) => (
                                        <div
                                          key={resource.id}
                                          className="resource-item-detail"
                                        >
                                          <div className="resource-left">
                                            <span className="resource-icon-doc">
                                              {resource.type === "assignment"
                                                ? "📝"
                                                : "📄"}
                                            </span>
                                            <div className="resource-info-detail">
                                              <span className="resource-type">
                                                {resource.description}
                                              </span>
                                              <span className="resource-name">
                                                {resource.title}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="resource-right">
                                            {resource.type === "assignment" ? (
                                              <>
                                                <span
                                                  className={`status-badge ${resource.status}`}
                                                >
                                                  {resource.status ===
                                                  "submitted"
                                                    ? "✓ Entregado"
                                                    : resource.status ===
                                                      "pending"
                                                    ? "⏳ Pendiente"
                                                    : "📝 Nueva"}
                                                </span>
                                                {resource.deadline ? (
                                                  <span className="deadline-info">
                                                    Hasta:{" "}
                                                    {new Date(
                                                      resource.deadline.to
                                                    ).toLocaleDateString(
                                                      "es-ES",
                                                      {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                      }
                                                    )}
                                                  </span>
                                                ) : (
                                                  <span className="no-deadline">
                                                    Sin fecha límite
                                                  </span>
                                                )}
                                                <button
                                                  className="view-assignment-btn"
                                                  onClick={() => {
                                                    setSelectedWeekForAdd(
                                                      weekNum
                                                    );
                                                    handleOpenAssignment(
                                                      resource
                                                    );
                                                  }}
                                                >
                                                  Ver detalles
                                                </button>
                                              </>
                                            ) : (
                                              <>
                                                <span className="status-badge reviewed">
                                                  ✓ Revisado
                                                </span>
                                                <span className="no-deadline">
                                                  Sin fecha límite
                                                </span>
                                                <button
                                                  onClick={() => handleViewResource(resource)}
                                                  className="view-resource-btn"
                                                >
                                                  Ver
                                                </button>
                                              </>
                                            )}
                                            {user.role === "profesor" && (
                                              <button
                                                className="delete-resource-btn"
                                                onClick={() =>
                                                  handleDeleteResource(
                                                    weekNum,
                                                    topic.id,
                                                    resource.id
                                                  )
                                                }
                                              >
                                                🗑️
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="no-resources">
                                <p>No hay recursos en esta semana</p>
                              </div>
                            )}

                            {user.role === "profesor" && (
                              <div className="add-resource-section">
                                <button
                                  className="add-resource-btn"
                                  onClick={() => handleAddResource(weekNum)}
                                >
                                  + Agregar Recurso
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "description" && (
              <div className="course-description">
                <h2>Descripción del Curso</h2>
                <p>
                  Este curso está diseñado para proporcionar una comprensión
                  profunda de los conceptos fundamentales y avanzados en el área
                  de estudio. A través de lecciones interactivas, ejercicios
                  prácticos y proyectos del mundo real, los estudiantes
                  desarrollarán las habilidades necesarias para aplicar estos
                  conocimientos en situaciones profesionales.
                </p>
                <h3>Lo que aprenderás</h3>
                <ul className="learning-objectives">
                  <li>✓ Conceptos fundamentales y terminología</li>
                  <li>✓ Técnicas y metodologías avanzadas</li>
                  <li>✓ Mejores prácticas de la industria</li>
                  <li>✓ Aplicación práctica mediante proyectos</li>
                  <li>✓ Resolución de problemas del mundo real</li>
                </ul>
                <h3>Requisitos previos</h3>
                <p>
                  No se requieren conocimientos previos, aunque una familiaridad
                  básica con los conceptos relacionados será beneficiosa.
                </p>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="course-resources">
                <h2>Recursos del Curso</h2>
                <div className="resource-list">
                  <div className="resource-item">
                    <span className="resource-icon">📄</span>
                    <div className="resource-info">
                      <h4>Guía de estudio completa</h4>
                      <p>Material complementario del curso</p>
                    </div>
                    <button className="download-button">Descargar</button>
                  </div>
                  <div className="resource-item">
                    <span className="resource-icon">📊</span>
                    <div className="resource-info">
                      <h4>Presentaciones en PDF</h4>
                      <p>Diapositivas de todas las lecciones</p>
                    </div>
                    <button className="download-button">Descargar</button>
                  </div>
                  <div className="resource-item">
                    <span className="resource-icon">💻</span>
                    <div className="resource-info">
                      <h4>Código de ejemplo</h4>
                      <p>Ejemplos prácticos y ejercicios</p>
                    </div>
                    <button className="download-button">Descargar</button>
                  </div>
                  <div className="resource-item">
                    <span className="resource-icon">🔗</span>
                    <div className="resource-info">
                      <h4>Enlaces útiles</h4>
                      <p>Recursos adicionales y documentación</p>
                    </div>
                    <button className="download-button">Ver</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <AddResourceModal
        isOpen={isAddResourceModalOpen}
        onClose={() => setIsAddResourceModalOpen(false)}
        onAdd={handleResourceAdded}
        weekNumber={selectedWeekForAdd}
        topicId={1}
      />

      <AssignmentDetailModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        assignment={selectedAssignment}
        onSubmit={handleSubmitAssignment}
      />
    </div>
  );
};

export default CourseDetail;
