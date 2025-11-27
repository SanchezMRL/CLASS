// Simulación de servicio de autenticación
const users = [
  {
    id: 1,
    name: 'Usuario Demo',
    email: 'demo@aulavirtual.com',
    password: 'demo123',
    phone: '+34 600 000 000',
    bio: 'Estudiante de ejemplo en el Aula Virtual'
  }
];

const authService = {
  login: async (email, password) => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const token = 'fake-jwt-token-' + Date.now();
          resolve({
            success: true,
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              bio: user.bio
            }
          });
        } else {
          resolve({
            success: false,
            message: 'Credenciales incorrectas'
          });
        }
      }, 1000);
    });
  },

  verifyToken: async (token) => {
    // Simulación de verificación de token
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token && token.startsWith('fake-jwt-token')) {
          resolve(users[0]);
        } else {
          reject(new Error('Token inválido'));
        }
      }, 500);
    });
  },

  updateProfile: async (profileData) => {
    // Simulación de actualización de perfil
    return new Promise((resolve) => {
      setTimeout(() => {
        const userIndex = users.findIndex(u => u.id === 1);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...profileData };
          resolve({
            success: true,
            user: {
              id: users[userIndex].id,
              name: users[userIndex].name,
              email: users[userIndex].email,
              phone: users[userIndex].phone,
              bio: users[userIndex].bio
            }
          });
        } else {
          resolve({
            success: false,
            message: 'Usuario no encontrado'
          });
        }
      }, 1000);
    });
  }
};

export { authService };