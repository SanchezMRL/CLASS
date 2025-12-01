import React, { useState } from "react";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import { useSchedule } from "../../hooks/useSchedule";
import Loading from "../common/Loading";

const Schedule = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState("week");
  // --- NUEVO: Estado para navegar entre los días en la vista diaria ---
  const [currentDayIndex, setCurrentDayIndex] = useState(0); // 0 = Lunes, 1 = Martes, etc.

  const { schedule, loading, error } = useSchedule();
  const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00",
  ];

  // --- NUEVO: Función para calcular la duración de una clase en horas ---
  const getClassDurationInHours = (classItem) => {
    // Asumimos que el objeto de la clase tiene una propiedad 'duration' (ej: 3 o "3 horas")
    if (typeof classItem.duration === 'number') {
      return classItem.duration;
    }
    const match = classItem.duration?.match(/(\d+)/); // Extrae el número de "3 horas"
    return match ? parseInt(match[0], 10) : 1; // Por defecto, dura 1 hora
  };

  // --- MODIFICADO: Ahora usa el día seleccionado en lugar de "Lunes" siempre ---
  const getScheduleForDayAndTime = (day, time) =>
    schedule.find((item) => item.day === day && item.time === time);
  
  // --- NUEVO: Obtenemos el horario solo del día actual para la vista diaria ---
  const getScheduleForDay = (day) => {
    return schedule
      .filter(item => item.day === day)
      .sort((a, b) => a.time.localeCompare(b.time)); // Ordenamos por hora
  };

  return (
    <div>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="d-flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content flex-grow-1 p-4 ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          {/* --- Cabecera con Controles --- */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Horario de Clases</h1>
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${viewMode === "week" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setViewMode("week")}
              >
                Vista Semanal
              </button>
              <button
                type="button"
                className={`btn ${viewMode === "day" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setViewMode("day")}
              >
                Vista Diaria
              </button>
            </div>
          </div>

          {/* --- Contenido Principal --- */}
          {loading ? (
            <Loading />
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="schedule-view">
              {viewMode === "week" ? (
                // --- VISTA SEMANAL (sin cambios) ---
                <div className="week-view">
                  <div className="container-fluid text-center">
                    <div className="row g-0 border-top">
                      <div className="col-1">
                        <div className="p-2 fw-bold">Hora</div>
                        {timeSlots.map((time, index) => (
                          <div key={index} className="p-2 border-bottom small">{time}</div>
                        ))}
                      </div>
                      {weekDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="col">
                          <div className="p-2 fw-bold border-start border-bottom">{day}</div>
                          {timeSlots.map((time, timeIndex) => {
                            const classItem = getScheduleForDayAndTime(day, time);
                            return (
                              <div key={timeIndex} className="p-1 border-start border-bottom" style={{ minHeight: '60px' }}>
                                {classItem && (
                                  <div className="card h-100 text-start">
                                    <div className="card-body p-2">
                                      <h6 className="card-title">{classItem.course}</h6>
                                      <p className="card-text small">{classItem.topic}</p>
                                      <span className="badge bg-primary text-dark">{classItem.time}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // --- VISTA DIARIA (CON NAVEGACIÓN Y MULTI-HORA) ---
                <div className="day-view">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Horario de {weekDays[currentDayIndex]}</h2>
                    <div>
                      <button 
                        className="btn btn-outline-secondary me-2" 
                        onClick={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))}
                        disabled={currentDayIndex === 0}
                      >
                        &larr; Anterior
                      </button>
                      <button 
                        className="btn btn-outline-secondary" 
                        onClick={() => setCurrentDayIndex(Math.min(weekDays.length - 1, currentDayIndex + 1))}
                        disabled={currentDayIndex === weekDays.length - 1}
                      >
                        Siguiente &rarr;
                      </button>
                    </div>
                  </div>
                  
                  <div className="container">
                    {getScheduleForDay(weekDays[currentDayIndex]).map((classItem, index) => {
                      const duration = getClassDurationInHours(classItem);
                      return (
                        <div key={index} className="card mb-3">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h5 className="card-title">{classItem.course}</h5>
                                <p className="card-text">{classItem.topic}</p>
                                <p className="text-muted small mb-0">
                                  <strong>Instructor:</strong> {classItem.instructor} | <strong>Aula:</strong> {classItem.room}
                                </p>
                              </div>
                              <div className="text-end">
                                <span className="badge bg-primary fs-6">{classItem.time}</span>
                                <p className="text-muted small mt-1 mb-0">Duración: {duration}h</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {getScheduleForDay(weekDays[currentDayIndex]).length === 0 && (
                      <p className="text-center text-muted">No hay clases programadas para este día.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Schedule;
