// Simulación de servicio de autenticación
const users = [
  {
    id: 1,
    name: "Profesor Demo",
    email: "profesor@aulavirtual.com",
    password: "profesor123",
    phone: "+51 912 345 678",
    bio: "Profesor de ejemplo en el Aula Virtual",
    role: "profesor",
  },
  {
    id: 2,
    name: "Alumno Demo",
    email: "alumno@aulavirtual.com",
    password: "alumno123",
    phone: "+51 912 345 678",
    bio: "Estudiante de ejemplo en el Aula Virtual",
    role: "alumno",
  },
];

const authService = {
  login: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const token = "fake-jwt-token-" + Date.now();
          resolve({
            success: true,
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              bio: user.bio,
              role: user.role,
            },
          });
        } else {
          resolve({
            success: false,
            message: "Credenciales incorrectas",
          });
        }
      }, 1000);
    });
  },

  verifyToken: async (token) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token && token.startsWith("fake-jwt-token")) {
          const userData = localStorage.getItem('userData');
          if (userData) {
            resolve(JSON.parse(userData));
          } else {
            resolve(users[0]);
          }
        } else {
          reject(new Error("Token inválido"));
        }
      }, 500);
    });
  },

  updateProfile: async (profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userIndex = users.findIndex((u) => u.id === 1);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...profileData };
          resolve({
            success: true,
            user: {
              id: users[userIndex].id,
              name: users[userIndex].name,
              email: users[userIndex].email,
              phone: users[userIndex].phone,
              bio: users[userIndex].bio,
            },
          });
        } else {
          resolve({
            success: false,
            message: "Usuario no encontrado",
          });
        }
      }, 1000);
    });
  },
};

export { authService };
