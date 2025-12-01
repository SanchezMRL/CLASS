import React, { useState } from "react";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import { useSchedule } from "../../hooks/useSchedule";
import Loading from "../common/Loading";

const Schedule = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState("week");
  const { schedule, loading, error } = useSchedule();
  const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00",
  ];

  const getScheduleForDayAndTime = (day, time) =>
    schedule.find((item) => item.day === day && item.time === time);

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
                <div className="week-view">
                  <div className="container-fluid text-center">
                    <div className="row g-0 border-top">
                      {/* Columna de Horas */}
                      <div className="col-1">
                        <div className="p-2 fw-bold">Hora</div>
                        {timeSlots.map((time, index) => (
                          <div key={index} className="p-2 border-bottom small">
                            {time}
                          </div>
                        ))}
                      </div>

                      {/* Columnas de Días */}
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
                <div className="day-view">
                  <h2>Horario de Hoy</h2>
                  <div className="container">
                    {timeSlots.map((time, index) => {
                      const classItem = getScheduleForDayAndTime("Lunes", time);
                      return (
                        <div key={index} className="row g-0 border-bottom align-items-center">
                          <div className="col-2 p-2 fw-bold">{time}</div>
                          <div className="col-10 p-2">
                            {classItem ? (
                              <div className="card">
                                <div className="card-body">
                                  <h5 className="card-title">{classItem.course}</h5>
                                  <p className="card-text">{classItem.topic}</p>
                                  <div className="d-flex justify-content-between">
                                    <span className="text-muted">{classItem.instructor}</span>
                                    <span className="badge bg-secondary">{classItem.room}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted">Sin clases</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
