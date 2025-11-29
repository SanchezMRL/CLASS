// Simulación de servicio de horarios
const scheduleItems = [
  {
    id: 1,
    course: "Introducción a React",
    topic: "Componentes y Props",
    instructor: "Prof. Juan Pérez",
    day: "Lunes",
    date: "12/06/2023",
    time: "10:00",
    room: "Aula 101",
    duration: "2 horas",
  },
  {
    id: 2,
    course: "JavaScript Avanzado",
    topic: "Closures y Scope",
    instructor: "Prof. María García",
    day: "Martes",
    date: "13/06/2023",
    time: "14:00",
    room: "Aula 205",
    duration: "2 horas",
  },
  {
    id: 3,
    course: "CSS y Diseño Responsivo",
    topic: "Flexbox y Grid",
    instructor: "Prof. Ana López",
    day: "Miércoles",
    date: "14/06/2023",
    time: "16:00",
    room: "Aula 103",
    duration: "1.5 horas",
  },
  {
    id: 4,
    course: "Node.js y Express",
    topic: "Middleware y Rutas",
    instructor: "Prof. Carlos Martínez",
    day: "Jueves",
    date: "15/06/2023",
    time: "11:00",
    room: "Aula 201",
    duration: "2 horas",
  },
  {
    id: 5,
    course: "Bases de Datos SQL",
    topic: "Consultas Avanzadas",
    instructor: "Prof. Laura Rodríguez",
    day: "Viernes",
    date: "16/06/2023",
    time: "09:00",
    room: "Aula 301",
    duration: "2 horas",
  },
  {
    id: 6,
    course: "Introducción a React",
    topic: "Estado y Ciclo de Vida",
    instructor: "Prof. Juan Pérez",
    day: "Lunes",
    date: "19/06/2023",
    time: "10:00",
    room: "Aula 101",
    duration: "2 horas",
  },
  {
    id: 7,
    course: "JavaScript Avanzado",
    topic: "Promesas y Async/Await",
    instructor: "Prof. María García",
    day: "Martes",
    date: "20/06/2023",
    time: "14:00",
    room: "Aula 205",
    duration: "2 horas",
  },
];

const scheduleService = {
  getAllSchedules: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(scheduleItems);
      }, 800);
    });
  },

  getScheduleItemById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const item = scheduleItems.find((i) => i.id === parseInt(id));
        if (item) {
          resolve(item);
        } else {
          reject(new Error("Elemento de horario no encontrado"));
        }
      }, 500);
    });
  },

  createScheduleItem: async (itemData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem = {
          id: scheduleItems.length + 1,
          ...itemData,
        };
        scheduleItems.push(newItem);
        resolve(newItem);
      }, 1000);
    });
  },

  updateScheduleItem: async (id, itemData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const itemIndex = scheduleItems.findIndex((i) => i.id === parseInt(id));
        if (itemIndex !== -1) {
          scheduleItems[itemIndex] = {
            ...scheduleItems[itemIndex],
            ...itemData,
          };
          resolve(scheduleItems[itemIndex]);
        } else {
          reject(new Error("Elemento de horario no encontrado"));
        }
      }, 1000);
    });
  },

  deleteSchedule: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const itemIndex = scheduleItems.findIndex((i) => i.id === parseInt(id));
        if (itemIndex !== -1) {
          scheduleItems.splice(itemIndex, 1);
          resolve();
        } else {
          reject(new Error("Elemento de horario no encontrado"));
        }
      }, 800);
    });
  },
};

export { scheduleService };
