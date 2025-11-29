// Simulación de servicio de recursos del curso
let courseResources = {
  1: { // courseId
    weeks: {
      1: {
        weekNumber: 1,
        topics: [
          {
            id: 1,
            name: "Tema 1",
            resources: [
              {
                id: 1,
                type: "pdf",
                title: "S01 - Material",
                description: "Material · PDF",
                status: "reviewed",
                deadline: null,
                url: "#"
              }
            ]
          }
        ]
      },
      3: {
        weekNumber: 3,
        topics: [
          {
            id: 1,
            name: "Tema 3",
            resources: [
              {
                id: 1,
                type: "pdf",
                title: "S03 - Propuesta de valor",
                description: "Material · PDF",
                status: "reviewed",
                deadline: null,
                url: "#"
              },
              {
                id: 2,
                type: "pdf",
                title: "Propuesta de valor OXXO",
                description: "Material · WORD",
                status: "reviewed",
                deadline: null,
                url: "#"
              },
              {
                id: 3,
                type: "assignment",
                title: "S03 - Tarea Propuesta de Valor",
                description: "Tarea no calificada",
                status: "submitted",
                deadline: {
                  from: "2025-08-27T17:24:00",
                  to: "2025-09-03T16:00:00"
                },
                submissions: [],
                instructions: "Presenta la propuesta de valor de la empresa aliada del curso cumpliendo con las indicaciones del docente.",
                deliverables: "Archivo en Ms Word",
                url: "#"
              }
            ]
          }
        ]
      }
    }
  }
};

const resourceService = {
  getCourseResources: async (courseId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(courseResources[courseId] || { weeks: {} });
      }, 500);
    });
  },

  addResource: async (courseId, weekNumber, topicId, resourceData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!courseResources[courseId]) {
          courseResources[courseId] = { weeks: {} };
        }
        if (!courseResources[courseId].weeks[weekNumber]) {
          courseResources[courseId].weeks[weekNumber] = {
            weekNumber,
            topics: []
          };
        }
        
        let topic = courseResources[courseId].weeks[weekNumber].topics.find(t => t.id === topicId);
        if (!topic) {
          topic = { id: topicId, name: `Tema ${weekNumber}`, resources: [] };
          courseResources[courseId].weeks[weekNumber].topics.push(topic);
        }

        const newResource = {
          id: Date.now(),
          ...resourceData,
          status: resourceData.type === 'assignment' ? 'pending' : 'new'
        };

        topic.resources.push(newResource);
        resolve(newResource);
      }, 500);
    });
  },

  updateResource: async (courseId, weekNumber, topicId, resourceId, resourceData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const week = courseResources[courseId]?.weeks[weekNumber];
        if (!week) {
          reject(new Error('Semana no encontrada'));
          return;
        }

        const topic = week.topics.find(t => t.id === topicId);
        if (!topic) {
          reject(new Error('Tema no encontrado'));
          return;
        }

        const resourceIndex = topic.resources.findIndex(r => r.id === resourceId);
        if (resourceIndex === -1) {
          reject(new Error('Recurso no encontrado'));
          return;
        }

        topic.resources[resourceIndex] = {
          ...topic.resources[resourceIndex],
          ...resourceData
        };

        resolve(topic.resources[resourceIndex]);
      }, 500);
    });
  },

  deleteResource: async (courseId, weekNumber, topicId, resourceId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const week = courseResources[courseId]?.weeks[weekNumber];
        if (!week) {
          reject(new Error('Semana no encontrada'));
          return;
        }

        const topic = week.topics.find(t => t.id === topicId);
        if (!topic) {
          reject(new Error('Tema no encontrado'));
          return;
        }

        const resourceIndex = topic.resources.findIndex(r => r.id === resourceId);
        if (resourceIndex === -1) {
          reject(new Error('Recurso no encontrado'));
          return;
        }

        topic.resources.splice(resourceIndex, 1);
        resolve();
      }, 500);
    });
  },

  submitAssignment: async (courseId, weekNumber, topicId, resourceId, submissionData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const week = courseResources[courseId]?.weeks[weekNumber];
        if (!week) {
          reject(new Error('Semana no encontrada'));
          return;
        }

        const topic = week.topics.find(t => t.id === topicId);
        if (!topic) {
          reject(new Error('Tema no encontrado'));
          return;
        }

        const resource = topic.resources.find(r => r.id === resourceId);
        if (!resource || resource.type !== 'assignment') {
          reject(new Error('Tarea no encontrada'));
          return;
        }

        if (!resource.submissions) {
          resource.submissions = [];
        }

        const submission = {
          id: Date.now(),
          studentId: submissionData.studentId,
          studentName: submissionData.studentName,
          submittedAt: new Date().toISOString(),
          file: submissionData.file,
          comments: submissionData.comments
        };

        resource.submissions.push(submission);
        resource.status = 'submitted';

        resolve(submission);
      }, 500);
    });
  }
};

export { resourceService };
