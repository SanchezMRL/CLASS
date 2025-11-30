import { supabase } from '../lib/supabaseClient';

const resourceService = {
  getCourseResources: async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('course_id', courseId)
        .order('week_number', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('📚 Recursos obtenidos de BD:', data);

      // Organizar recursos por semanas
      const weeks = {};
      
      for (const resource of data) {
        const weekNum = resource.week_number;
        if (!weeks[weekNum]) {
          weeks[weekNum] = {
            weekNumber: weekNum,
            topics: []
          };
        }

        // Buscar o crear el tema
        let topic = weeks[weekNum].topics.find(t => t.id === 1);
        if (!topic) {
          topic = { id: 1, name: `Tema ${weekNum}`, resources: [] };
          weeks[weekNum].topics.push(topic);
        }

        // Cargar entregas para este recurso (solo para assignments)
        let resourceSubmissions = [];
        if (resource.type === 'assignment') {
          console.log(`📋 Cargando entregas para recurso ${resource.id} (${resource.title})`);
          resourceSubmissions = await resourceService.getSubmissions(resource.id);
          console.log(`✅ Entregas cargadas para ${resource.title}:`, resourceSubmissions);
          console.log(`📊 Total de entregas: ${resourceSubmissions.length}`);
        }

        // Agregar recurso al tema (usar directamente file_url que ahora es URL pública)
        const resourceObj = {
          id: resource.id,
          type: resource.type,
          title: resource.title,
          description: resource.description,
          status: resource.type === 'assignment' ? 'pending' : 'reviewed',
          deadline: resource.deadline_to ? {
            from: resource.deadline_from || resource.created_at,
            to: resource.deadline_to
          } : null,
          url: resource.file_url || '#',
          maxScore: null,
          submissions: resourceSubmissions
        };
        
        console.log(`🔍 Recurso creado (${resource.title}):`, resourceObj);
        topic.resources.push(resourceObj);
      }

      return { weeks };
    } catch (err) {
      console.error('Error al obtener recursos:', err);
      return { weeks: {} };
    }
  },

  addResource: async (courseId, weekNumber, topicId, resourceData) => {
    try {
      let fileUrl = null;

      if (resourceData.file) {
        const fileExt = resourceData.file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${courseId}/${fileName}`;

        console.log('=== INICIANDO SUBIDA ===');
        console.log('Archivo:', resourceData.file);
        console.log('Nombre:', resourceData.file.name);
        console.log('Tamaño:', resourceData.file.size);
        console.log('Tipo:', resourceData.file.type);
        console.log('Path destino:', filePath);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('course-materials')
          .upload(filePath, resourceData.file, {
            contentType: resourceData.file.type,
            upsert: true
          });

        console.log('=== RESPUESTA DE SUBIDA ===');
        console.log('Data:', uploadData);
        console.log('Error:', uploadError);

        if (uploadError) {
          console.error('❌ Error al subir archivo:', uploadError);
          alert('Error al subir archivo: ' + uploadError.message);
          throw uploadError;
        }

        console.log('✅ Archivo subido exitosamente');
        
        // Obtener URL pública del archivo
        const { data: urlData } = supabase.storage
          .from('course-materials')
          .getPublicUrl(filePath);
        
        fileUrl = urlData.publicUrl;
        console.log('URL pública:', fileUrl);
      }

      const { data, error } = await supabase
        .from('resources')
        .insert({
          course_id: courseId,
          week_number: weekNumber,
          topic_name: `Tema ${weekNumber}`,
          type: resourceData.type,
          title: resourceData.title,
          description: resourceData.description,
          file_url: fileUrl,
          deadline_from: resourceData.deadline?.from || null,
          deadline_to: resourceData.deadline?.to || null,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        type: data.type,
        title: data.title,
        description: data.description,
        status: data.type === 'assignment' ? 'pending' : 'new',
        deadline: data.deadline_to ? {
          from: data.deadline_from || data.created_at,
          to: data.deadline_to
        } : null,
        url: data.file_url || '#',
        maxScore: null
      };
    } catch (err) {
      console.error('Error al añadir recurso:', err);
      throw err;
    }
  },

  updateResource: async (courseId, weekNumber, topicId, resourceId, resourceData) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update({
          title: resourceData.title,
          description: resourceData.description,
          deadline_from: resourceData.deadline?.from || null,
          deadline_to: resourceData.deadline?.to || null,
        })
        .eq('id', resourceId)
        .eq('course_id', courseId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        type: data.type,
        title: data.title,
        description: data.description,
        status: resourceData.status,
        deadline: data.deadline_to ? {
          from: data.deadline_from || data.created_at,
          to: data.deadline_to
        } : null,
        url: data.file_url || '#',
        maxScore: null
      };
    } catch (err) {
      console.error('Error al actualizar recurso:', err);
      throw new Error('Recurso no encontrado');
    }
  },

  deleteResource: async (courseId, weekNumber, topicId, resourceId) => {
    try {
      const { data: resource } = await supabase
        .from('resources')
        .select('file_url')
        .eq('id', resourceId)
        .single();

      if (resource?.file_url) {
        const urlParts = resource.file_url.split('/');
        const filePath = `${courseId}/${urlParts[urlParts.length - 1]}`;
        
        await supabase.storage
          .from('course-materials')
          .remove([filePath]);
      }

      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId)
        .eq('course_id', courseId);

      if (error) throw error;
    } catch (err) {
      console.error('Error al eliminar recurso:', err);
      throw new Error('Recurso no encontrado');
    }
  },

  submitAssignment: async (courseId, weekNumber, topicId, resourceId, submissionData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Verificar si ya existe una entrega de este alumno
      const { data: existingSubmission } = await supabase
        .from('submissions')
        .select('id')
        .eq('resource_id', resourceId)
        .eq('student_id', user.id)
        .single();

      if (existingSubmission) {
        throw new Error('Ya has entregado esta tarea anteriormente');
      }

      let fileUrl = null;

      if (submissionData.file) {
        const fileExt = submissionData.file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${resourceId}/${fileName}`;

        console.log('=== SUBIENDO ENTREGA ===');
        console.log('Archivo:', submissionData.file.name);
        console.log('Tipo:', submissionData.file.type);
        console.log('Path:', filePath);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('student-submissions')
          .upload(filePath, submissionData.file, {
            contentType: submissionData.file.type || 'application/octet-stream',
            upsert: true
          });

        console.log('Resultado:', uploadData, uploadError);

        if (uploadError) {
          console.error('Error al subir:', uploadError);
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('student-submissions')
          .getPublicUrl(filePath);

        fileUrl = urlData.publicUrl;
        console.log('✅ Entrega subida:', fileUrl);
      }

      const { data, error } = await supabase
        .from('submissions')
        .insert({
          resource_id: resourceId,
          student_id: user.id,
          comments: submissionData.comments,
          file_url: fileUrl,
          status: 'submitted'
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Entrega registrada en BD:', data);

      return {
        id: data.id,
        studentId: data.student_id,
        studentName: submissionData.studentName,
        submittedAt: data.submitted_at,
        file: data.file_url,
        comments: data.comments
      };
    } catch (err) {
      console.error('Error al enviar tarea:', err);
      throw err;
    }
  },

  hasSubmitted: async (resourceId, studentId) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('id')
        .eq('resource_id', resourceId)
        .eq('student_id', studentId)
        .single();

      return !error && data !== null;
    } catch (err) {
      return false;
    }
  },

  getSubmissions: async (resourceId) => {
    try {
      console.log('Obteniendo entregas para recurso:', resourceId);
      
      // Primero obtener las submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('resource_id', resourceId)
        .order('submitted_at', { ascending: false });

      console.log('Submissions obtenidas:', submissions, submissionsError);

      if (submissionsError) {
        console.error('Error en query submissions:', submissionsError);
        throw submissionsError;
      }

      if (!submissions || submissions.length === 0) {
        console.log('No hay submissions para este recurso');
        return [];
      }

      // Obtener los datos de usuario para cada submission
      const submissionsWithUsers = await Promise.all(
        submissions.map(async (submission) => {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', submission.student_id)
            .single();

          if (userError || !userData) {
            console.warn('No se encontró usuario para submission:', submission.student_id);
            return {
              id: submission.id,
              studentId: submission.student_id,
              studentName: 'Usuario desconocido',
              studentEmail: '',
              comments: submission.comments || '',
              file: submission.file_url,
              submittedAt: submission.submitted_at,
              status: submission.status || 'pending',
              grade: submission.grade,
              feedback: submission.feedback,
            };
          }
          
          return {
            id: submission.id,
            studentId: submission.student_id,
            studentName: userData.name || 'Usuario desconocido',
            studentEmail: userData.email || '',
            comments: submission.comments || '',
            file: submission.file_url,
            submittedAt: submission.submitted_at,
            status: submission.status || 'pending',
            grade: submission.grade,
            feedback: submission.feedback,
          };
        })
      );

      console.log('Submissions con usuarios:', submissionsWithUsers);
      return submissionsWithUsers;
    } catch (err) {
      console.error('Error al obtener entregas:', err);
      return [];
    }
  },

  getFileUrl: async (filePath) => {
    try {
      if (!filePath || filePath === '#') return '#';
      
      const { data, error } = await supabase.storage
        .from('course-materials')
        .createSignedUrl(filePath, 3600);

      if (error) {
        console.error('Error al generar URL:', error);
        return '#';
      }

      return data.signedUrl;
    } catch (err) {
      console.error('Error al obtener URL del archivo:', err);
      return '#';
    }
  },
};

export { resourceService };
