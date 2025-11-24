import { useState } from 'react';
import './DeadlineForm.css';

function DeadlineForm({ technology, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    deadline: technology.deadline || '',
    priority: technology.priority || 'medium',
    estimatedHours: technology.estimatedHours || 0,
    reminderDays: technology.reminderDays || 7
  });
  
  const [errors, setErrors] = useState({});

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        newErrors.deadline = 'Срок не может быть в прошлом';
      }
    }

    if (formData.estimatedHours < 0) {
      newErrors.estimatedHours = 'Часы не могут быть отрицательными';
    }

    if (formData.estimatedHours > 1000) {
      newErrors.estimatedHours = 'Слишком большое количество часов';
    }

    if (formData.reminderDays < 1 || formData.reminderDays > 30) {
      newErrors.reminderDays = 'Напоминание должно быть от 1 до 30 дней';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...technology,
        ...formData,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const calculateProgress = () => {
    if (!formData.deadline || !formData.estimatedHours) return null;
    
    const deadline = new Date(formData.deadline);
    const today = new Date();
    const totalDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    
    if (totalDays <= 0) return { status: 'overdue', message: 'Срок истек' };
    if (totalDays <= 3) return { status: 'urgent', message: 'Срочно!' };
    if (totalDays <= 7) return { status: 'soon', message: 'Скоро дедлайн' };
    
    return { status: 'good', message: 'Есть время' };
  };

  const progressInfo = calculateProgress();

  return (
    <div className="deadline-form">
      <h3>⏰ Установка сроков для "{technology.title}"</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deadline">Срок изучения *</label>
          <input
            type="date"
            id="deadline"
            value={formData.deadline}
            onChange={(e) => handleChange('deadline', e.target.value)}
            className={errors.deadline ? 'error' : ''}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.deadline && <span className="error-text">{errors.deadline}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Приоритет</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
            <option value="critical">Критический</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="estimatedHours">
            Оценочное время (часы) *
            <span className="help-text">Сколько часов потребуется для изучения</span>
          </label>
          <input
            type="number"
            id="estimatedHours"
            value={formData.estimatedHours}
            onChange={(e) => handleChange('estimatedHours', parseInt(e.target.value) || 0)}
            min="0"
            max="1000"
            step="1"
            className={errors.estimatedHours ? 'error' : ''}
          />
          {errors.estimatedHours && <span className="error-text">{errors.estimatedHours}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reminderDays">
            Напоминание за (дней)
            <span className="help-text">За сколько дней уведомить о дедлайне</span>
          </label>
          <input
            type="number"
            id="reminderDays"
            value={formData.reminderDays}
            onChange={(e) => handleChange('reminderDays', parseInt(e.target.value) || 0)}
            min="1"
            max="30"
            className={errors.reminderDays ? 'error' : ''}
          />
          {errors.reminderDays && <span className="error-text">{errors.reminderDays}</span>}
        </div>

        {progressInfo && (
          <div className={`progress-info ${progressInfo.status}`}>
            <strong>Статус:</strong> {progressInfo.message}
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Отмена
          </button>
          <button type="submit" className="btn btn-primary">
            Сохранить сроки
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeadlineForm;