import { supabase } from '../lib/supabaseClient';

const courseService = {
  getAllCourses: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      let coursesData = [];

      if (userData.role === 'alumno') {
        const { data, error } = await supabase
          .from('enrollments')
          .select(`
            course_id,
            courses (
              id,
              name,
              description,
              duration,
              image_url,
              created_at
            )
          `)
          .eq('student_id', user.id);

        if (error) throw error;
        coursesData = data.map(enrollment => enrollment.courses);
      } else if (userData.role === 'profesor') {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('instructor_id', user.id);

        if (error) throw error;
        coursesData = data;
      }

      const coursesWithCounts = await Promise.all(
        coursesData.map(async (course) => {
          const { count } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          return {
            id: course.id,
            name: course.name,
            instructor: 'Profesor Demo',
            duration: course.duration || '18 semanas',
            students: count || 0,
            progress: 0,
            completed: false,
            image: course.image_url || "https://img.freepik.com/vector-premium/estudiantes-estan-estudiando-obtener-titulo_118167-2421.jpg",
            description: course.description,
          };
        })
      );

      return coursesWithCounts;
    } catch (err) {
      console.error('Error al obtener cursos:', err);
      return [];
    }
  },

  getCourseById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const { count } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', id);

      return {
        id: data.id,
        name: data.name,
        instructor: 'Profesor Demo',
        duration: data.duration || '18 semanas',
        students: count || 0,
        progress: 0,
        completed: false,
        image: data.image_url || "https://img.freepik.com/vector-premium/estudiantes-estan-estudiando-obtener-titulo_118167-2421.jpg",
        description: data.description,
      };
    } catch (err) {
      console.error('Error al obtener curso:', err);
      throw new Error("Curso no encontrado");
    }
  },

  createCourse: async (courseData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data: userData } = await supabase
        .from('users')
        .select('name, role')
        .eq('id', user.id)
        .single();

      if (userData.role !== 'profesor') {
        throw new Error('Solo los profesores pueden crear cursos');
      }

      const { data, error } = await supabase
        .from('courses')
        .insert({
          name: courseData.name,
          description: courseData.description,
          duration: courseData.duration || '18 semanas',
          instructor_id: user.id,
          image_url: courseData.image || "https://img.freepik.com/vector-premium/estudiantes-estan-estudiando-obtener-titulo_118167-2421.jpg",
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        instructor: 'Profesor Demo',
        duration: data.duration,
        students: 0,
        progress: 0,
        completed: false,
        image: data.image_url,
        description: data.description,
      };
    } catch (err) {
      console.error('Error al crear curso:', err);
      throw err;
    }
  },

  updateCourse: async (id, courseData) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({
          name: courseData.name,
          description: courseData.description,
          duration: courseData.duration,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        instructor: 'Profesor Demo',
        duration: data.duration,
        description: data.description,
        image: data.image_url,
        progress: courseData.progress,
        completed: courseData.completed,
        students: courseData.students,
      };
    } catch (err) {
      console.error('Error al actualizar curso:', err);
      throw new Error("Curso no encontrado");
    }
  },

  deleteCourse: async (id) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error al eliminar curso:', err);
      throw new Error("Curso no encontrado");
    }
  },
};

export { courseService };
