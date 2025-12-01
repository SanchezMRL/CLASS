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
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];
  const getScheduleForDayAndTime = (day, time) =>
    schedule.find((item) => item.day === day && item.time === time);

  return (
    <div className="schedule-container">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="schedule-content">
        <Sidebar isOpen={sidebarOpen} />
        <main
          className={`main-content ${
            sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <div className="schedule-header">
            <h1>Horario de Clases</h1>
            <div className="schedule-controls">
              <div className="view-toggle">
                <button
                  className={viewMode === "week" ? "active" : ""}
                  onClick={() => setViewMode("week")}
                >
                  Vista Semanal
                </button>
                <button
                  className={viewMode === "day" ? "active" : ""}
                  onClick={() => setViewMode("day")}
                >
                  Vista Diaria
                </button>
              </div>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="schedule-view">
              {viewMode === "week" ? (
                <div className="week-view">
                  <div className="schedule-grid">
                    <div className="time-column">
                      <div className="time-header"></div>
                      {timeSlots.map((time, index) => (
                        <div key={index} className="time-slot">
                          {time}
                        </div>
                      ))}
                    </div>
                    {weekDays.map((day, dayIndex) => (
                      <div key={dayIndex} className="day-column">
                        <div className="day-header">
                          <h3>{day}</h3>
                        </div>
                        {timeSlots.map((time, timeIndex) => {
                          const classItem = getScheduleForDayAndTime(day, time);
                          return (
                            <div key={timeIndex} className="schedule-cell">
                              {classItem && (
                                <div className="class-item">
                                  <h4>{classItem.course}</h4>
                                  <p>{classItem.topic}</p>
                                  <span className="class-time">
                                    {classItem.time}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="day-view">
                  <h2>Horario de Hoy</h2>
                  <div className="day-schedule">
                    {timeSlots.map((time, index) => {
                      const classItem = getScheduleForDayAndTime("Lunes", time);
                      return (
                        <div key={index} className="day-time-slot">
                          <div className="time-label">{time}</div>
                          <div className="time-content">
                            {classItem ? (
                              <div className="class-card">
                                <h4>{classItem.course}</h4>
                                <p>{classItem.topic}</p>
                                <div className="class-details">
                                  <span className="class-instructor">
                                    {classItem.instructor}
                                  </span>
                                  <span className="class-room">
                                    {classItem.room}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="empty-slot">Sin clases</div>
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
