import React, { useState } from 'react';

const AddResourceModal = ({ isOpen, onClose, onAdd, weekNumber, topicId }) => {
  const [resourceType, setResourceType] = useState('pdf');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    deadline: {
      from: '',
      to: ''
    },
    instructions: '',
    deliverables: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const resourceData = {
      type: resourceType,
      title: formData.title,
      description: resourceType === 'pdf' ? `Material · ${formData.description}` : formData.description,
      file: formData.file, // Pasar el archivo real, no la URL temporal
      deadline: resourceType === 'assignment' && formData.deadline.from && formData.deadline.to 
        ? formData.deadline 
        : null,
      instructions: resourceType === 'assignment' ? formData.instructions : undefined,
      deliverables: resourceType === 'assignment' ? formData.deliverables : undefined,
      submissions: resourceType === 'assignment' ? [] : undefined
    };

    console.log('Enviando recurso con archivo:', resourceData.file);
    onAdd(resourceData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      file: null,
      deadline: { from: '', to: '' },
      instructions: '',
      deliverables: ''
    });
    setResourceType('pdf');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agregar Recurso - Semana {weekNumber < 10 ? '0' + weekNumber : weekNumber}</h2>
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="resource-form">
          <div className="form-group">
            <label>Tipo de Recurso</label>
            <select 
              value={resourceType} 
              onChange={(e) => setResourceType(e.target.value)}
              required
            >
              <option value="pdf">Material (PDF/Documento)</option>
              <option value="assignment">Tarea Entregable</option>
            </select>
          </div>

          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={resourceType === 'pdf' ? 'S01 - Material' : 'S01 - Tarea'}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={resourceType === 'pdf' ? 'PDF, WORD, etc.' : 'Tarea no calificada'}
              required
            />
          </div>

          <div className="form-group">
            <label>Archivo</label>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
              accept={resourceType === 'pdf' ? '.pdf,.doc,.docx,.ppt,.pptx' : '*'}
            />
          </div>

          {resourceType === 'assignment' && (
            <>
              <div className="form-group">
                <label>Instrucciones</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Describe las instrucciones de la tarea..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Entregables esperados</label>
                <input
                  type="text"
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  placeholder="Archivo en Ms Word"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de inicio</label>
                  <input
                    type="datetime-local"
                    value={formData.deadline.from}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      deadline: { ...formData.deadline, from: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Fecha de entrega</label>
                  <input
                    type="datetime-local"
                    value={formData.deadline.to}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      deadline: { ...formData.deadline, to: e.target.value }
                    })}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Agregar Recurso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;
