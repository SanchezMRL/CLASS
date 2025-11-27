// Simulación de servicio de cursos
const courses = [
  {
    id: 1,
    name: 'Introducción a React',
    instructor: 'Prof. Juan Pérez',
    duration: '8 semanas',
    students: 125,
    progress: 75,
    completed: false,
    image: 'https://picsum.photos/seed/react/300/200.jpg',
    description: 'Aprende los fundamentos de React y crea aplicaciones web interactivas.'
  },
  {
    id: 2,
    name: 'JavaScript Avanzado',
    instructor: 'Prof. María García',
    duration: '10 semanas',
    students: 98,
    progress: 60,
    completed: false,
    image: 'https://picsum.photos/seed/javascript/300/200.jpg',
    description: 'Domina los conceptos avanzados de JavaScript y patrones de diseño.'
  },
  {
    id: 3,
    name: 'CSS y Diseño Responsivo',
    instructor: 'Prof. Ana López',
    duration: '6 semanas',
    students: 150,
    progress: 100,
    completed: true,
    image: 'https://picsum.photos/seed/css/300/200.jpg',
    description: 'Crea diseños web atractivos y adaptables a cualquier dispositivo.'
  },
  {
    id: 4,
    name: 'Node.js y Express',
    instructor: 'Prof. Carlos Martínez',
    duration: '8 semanas',
    students: 87,
    progress: 40,
    completed: false,
    image: 'https://picsum.photos/seed/nodejs/300/200.jpg',
    description: 'Desarrolla aplicaciones del lado del servidor con Node.js y Express.'
  },
  {
    id: 5,
    name: 'Bases de Datos SQL',
    instructor: 'Prof. Laura Rodríguez',
    duration: '7 semanas',
    students: 110,
    progress: 90,
    completed: false,
    image: 'https://picsum.photos/seed/sql/300/200.jpg',
    description: 'Aprende a diseñar y gestionar bases de datos relacionales con SQL.'
  }
];

const courseService = {
  getAllCourses: async () => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(courses);
      }, 800);
    });
  },

  getCourseById: async (id) => {
    // Simulación de llamada a API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const course = courses.find(c => c.id === parseInt(id));
        if (course) {
          resolve(course);
        } else {
          reject(new Error('Curso no encontrado'));
        }
      }, 500);
    });
  },

  createCourse: async (courseData) => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCourse = {
          id: courses.length + 1,
          ...courseData,
          progress: 0,
          completed: false,
          students: 0
        };
        courses.push(newCourse);
        resolve(newCourse);
      }, 1000);
    });
  },

  updateCourse: async (id, courseData) => {
    // Simulación de llamada a API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const courseIndex = courses.findIndex(c => c.id === parseInt(id));
        if (courseIndex !== -1) {
          courses[courseIndex] = { ...courses[courseIndex], ...courseData };
          resolve(courses[courseIndex]);
        } else {
          reject(new Error('Curso no encontrado'));
        }
      }, 1000);
    });
  },

  deleteCourse: async (id) => {
    // Simulación de llamada a API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const courseIndex = courses.findIndex(c => c.id === parseInt(id));
        if (courseIndex !== -1) {
          courses.splice(courseIndex, 1);
          resolve();
        } else {
          reject(new Error('Curso no encontrado'));
        }
      }, 800);
    });
  }
};

export { courseService };