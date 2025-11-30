import { supabase } from '../lib/supabaseClient';

const authService = {
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          message: error.message === 'Invalid login credentials' 
            ? 'Credenciales incorrectas' 
            : error.message,
        };
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        return {
          success: false,
          message: 'Error al obtener datos del usuario',
        };
      }

      return {
        success: true,
        token: data.session.access_token,
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          bio: userData.bio,
          role: userData.role,
          avatar_url: userData.avatar_url,
        },
      };
    } catch (err) {
      return {
        success: false,
        message: 'Error de conexión',
      };
    }
  },

  verifyToken: async (token) => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        throw new Error('Token inválido');
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        throw new Error('Usuario no encontrado');
      }

      return userData;
    } catch (err) {
      throw err;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          message: 'Usuario no autenticado',
        };
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          bio: profileData.bio,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: true,
        user: data,
      };
    } catch (err) {
      return {
        success: false,
        message: 'Error al actualizar perfil',
      };
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: 'Error al cerrar sesión',
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (err) {
      return null;
    }
  },
};

export { authService };
