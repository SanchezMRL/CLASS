import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { resourceService } from '../../services/resourceService';

const AssignmentDetailModal = ({ isOpen, onClose, assignment, onSubmit }) => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar submissions cuando se abre el modal
  useEffect(() => {
    const loadSubmissions = async () => {
      if (!isOpen || !assignment) {
        setSubmissions([]);
        return;
      }

      console.log('🎯 AssignmentDetailModal - assignment:', assignment);
      console.log('📦 Submissions en assignment.submissions:', assignment.submissions);

      // Intentar primero con las submissions del assignment
      if (assignment.submissions && Array.isArray(assignment.submissions) && assignment.submissions.length > 0) {
        console.log('✅ Usando submissions del assignment');
        setSubmissions(assignment.submissions);
      } else {
        // Si no hay submissions en el assignment, cargarlas directamente
        console.log('⏳ Cargando submissions desde la BD...');
        setLoading(true);
        try {
          const subs = await resourceService.getSubmissions(assignment.id);
          console.log('✅ Submissions cargadas:', subs);
          setSubmissions(subs || []);
        } catch (err) {
          console.error('❌ Error al cargar entregas:', err);
          setSubmissions([]);
        }
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [isOpen, assignment]);

  if (!isOpen || !assignment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({
      studentId: user.id,
      studentName: user.name,
      file,
      comments
    });

    setFile(null);
    setComments('');
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verificar si el usuario actual (alumno) ya entregó
  const userSubmission = user.role === 'alumno' 
    ? submissions.find(s => s.studentId === user.id) 
    : null;
  const isSubmitted = !!userSubmission;

  console.log('👤 Usuario:', user.id, user.name, user.role);
  console.log('📝 userSubmission:', userSubmission);
  console.log('✅ isSubmitted:', isSubmitted);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content assignment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{assignment.title}</h2>
            <p className="assignment-subtitle">
              {assignment.description} · {' '}
              <span className={`status-badge ${assignment.status}`}>
                {assignment.status === 'submitted' ? '✓ Entregado' : 
                 assignment.status === 'pending' ? '⏳ Pendiente' : '📝 Nueva'}
              </span>
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="assignment-details">
          {user.role === 'alumno' && (
            <div className="assignment-info-cards">
              <div className="info-card">
                <span className="info-icon">📅</span>
                <div>
                  <strong>Fecha límite</strong>
                  {assignment.deadline ? (
                    <>
                      <p>Desde: {formatDate(assignment.deadline.from)}</p>
                      <p>Hasta: {formatDate(assignment.deadline.to)}</p>
                    </>
                  ) : (
                    <p>Sin fecha límite</p>
                  )}
                </div>
              </div>

              <div className="info-card">
                <span className="info-icon">📊</span>
                <div>
                  <strong>Criterio de la nota final</strong>
                  <p>La nota aún no reciente.</p>
                </div>
              </div>
            </div>
          )}

          <div className="assignment-section">
            <h3>Indicaciones de la tarea</h3>
            <p>{assignment.instructions || 'No hay instrucciones disponibles.'}</p>
          </div>

          <div className="assignment-section">
            <h3>Entregables esperados:</h3>
            <p>{assignment.deliverables || 'No especificado'}</p>
          </div>

          {assignment.deadline && (
            <div className="assignment-section">
              <h3>Fecha de entrega de la actividad:</h3>
              <p>Del {formatDate(assignment.deadline.from)} al {formatDate(assignment.deadline.to)}</p>
            </div>
          )}

          {user.role === 'alumno' && !isSubmitted && (
            <div className="assignment-section">
              <h3>Tu entrega</h3>
              <form onSubmit={handleSubmit} className="submission-form">
                <div className="form-group">
                  <label>Archivo a entregar</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Comentarios (opcional)</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Agrega comentarios sobre tu entrega..."
                    rows="3"
                  />
                </div>

                <button type="submit" className="submit-button">
                  Entregar Tarea
                </button>
              </form>
            </div>
          )}

          {user.role === 'alumno' && isSubmitted && userSubmission && (
            <div className="assignment-section submitted-section">
              <h3>✓ Tarea Entregada</h3>
              <div className="submission-details">
                <p><strong>Fecha de entrega:</strong> {formatDate(userSubmission.submittedAt)}</p>
                <p><strong>Archivo:</strong> {userSubmission.file?.name || 'Archivo entregado'}</p>
                {userSubmission.comments && (
                  <p><strong>Comentarios:</strong> {userSubmission.comments}</p>
                )}
              </div>
            </div>
          )}

          {user.role === 'profesor' && (
            <div className="assignment-section">
              <h3>Entregas de estudiantes ({submissions.length})</h3>
              {submissions.length > 0 ? (
                <div className="submissions-list">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="submission-item">
                      <div>
                        <strong>{submission.studentName || 'Sin nombre'}</strong>
                        <p className="submission-email">{submission.studentEmail || ''}</p>
                        <p>Entregado: {formatDate(submission.submittedAt)}</p>
                        {submission.comments && <p>Comentarios: {submission.comments}</p>}
                      </div>
                      {submission.file && (
                        <button 
                          className="view-button"
                          onClick={() => window.open(submission.file, '_blank')}
                        >
                          Descargar entrega
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay entregas aún.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailModal;
