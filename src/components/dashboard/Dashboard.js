import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { useCourses } from '../../hooks/useCourses';
import { useSchedule } from '../../hooks/useSchedule';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const { courses, loading: coursesLoading } = useCourses();
  const { nextClasses, loading: scheduleLoading } = useSchedule();
  const [stats, setStats] = useState({ totalCourses: 0, completedCourses: 0, upcomingClasses: 0, averageGrade: 0 });

  useEffect(() => {
    if (courses.length > 0) {
      const completed = courses.filter(course => course.completed).length;
      const upcoming = nextClasses.length;
      setStats(prevStats => ({ ...prevStats, totalCourses: courses.length, completedCourses: completed, upcomingClasses: upcoming }));
    }
  }, [courses, nextClasses]);

  return (
    <div className="dashboard-container">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="dashboard-content">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="welcome-section">
            <h1>Bienvenido, {user?.name || 'Estudiante'}!</h1>
            <p>Este es tu panel de control del Aula Virtual</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card"><h3>Cursos Totales</h3><p className="stat-number">{stats.totalCourses}</p></div>
            <div className="stat-card"><h3>Cursos Completados</h3><p className="stat-number">{stats.completedCourses}</p></div>
            <div className="stat-card"><h3>Próximas Clases</h3><p className="stat-number">{stats.upcomingClasses}</p></div>
            <div className="stat-card"><h3>Promedio General</h3><p className="stat-number">{stats.averageGrade}%</p></div>
          </div>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h2>Mis Cursos</h2>
              {coursesLoading ? <p>Cargando cursos...</p> : (
                <ul className="course-list">{courses.slice(0, 3).map(course => (
                  <li key={course.id} className="course-item">
                    <div className="course-info"><h3>{course.name}</h3><p>{course.instructor}</p></div>
                    <div className="course-progress">
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${course.progress}%` }}></div></div>
                      <span>{course.progress}%</span>
                    </div>
                  </li>
                ))}</ul>
              )}
              <Link to="/cursos" className="view-all-link">Ver todos los cursos</Link>
            </div>
            <div className="dashboard-card">
              <h2>Próximas Clases</h2>
              {scheduleLoading ? <p>Cargando horarios...</p> : (
                <ul className="schedule-list">{nextClasses.slice(0, 3).map((classItem, index) => (
                  <li key={index} className="schedule-item">
                    <div className="schedule-time"><span className="time">{classItem.time}</span><span className="date">{classItem.date}</span></div>
                    <div className="schedule-info"><h3>{classItem.course}</h3><p>{classItem.topic}</p></div>
                  </li>
                ))}</ul>
              )}
              <Link to="/horarios" className="view-all-link">Ver todos los horarios</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;