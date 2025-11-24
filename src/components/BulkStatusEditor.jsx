import { useState } from 'react';
import './BulkStatusEditor.css';

function BulkStatusEditor({ technologies, onStatusUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState('not-started');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    const categoryMatch = filterCategory === 'all' || tech.category === filterCategory;
    const searchMatch = !searchTerm || 
      tech.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Получение уникальных категорий
  const categories = ['all', ...new Set(technologies.map(tech => tech.category))];

  // Обработчик выбора технологии
  const handleTechnologySelect = (techId) => {
    setSelectedTechnologies(prev =>
      prev.includes(techId)
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    );
  };

  // Выбор всех отфильтрованных технологий
  const selectAllFiltered = () => {
    const filteredIds = filteredTechnologies.map(tech => tech.id);
    setSelectedTechnologies(filteredIds);
  };

  // Сброс выбора
  const clearSelection = () => {
    setSelectedTechnologies([]);
  };

  // Применение статуса к выбранным технологиям
  const applyStatus = () => {
    if (selectedTechnologies.length === 0) {
      alert('Пожалуйста, выберите технологии для обновления');
      return;
    }

    if (window.confirm(`Изменить статус ${selectedTechnologies.length} технологий на "${getStatusText(selectedStatus)}"?`)) {
      selectedTechnologies.forEach(techId => {
        onStatusUpdate(techId, selectedStatus);
      });
      
      alert(`✅ Статус обновлен для ${selectedTechnologies.length} технологий`);
      setSelectedTechnologies([]);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'not-started': 'Не начато',
      'in-progress': 'В процессе',
      'completed': 'Завершено',
      'on-hold': 'На паузе'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'not-started': '#6b7280',
      'in-progress': '#f59e0b',
      'completed': '#22c55e',
      'on-hold': '#ef4444'
    };
    return colorMap[status] || '#6b7280';
  };

  return (
    <div className="bulk-status-editor">
      <h3>⚡ Массовое редактирование статусов</h3>

      {/* Панель управления */}
      <div className="bulk-controls">
        <div className="control-group">
          <label>Новый статус:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-select"
            style={{ borderLeftColor: getStatusColor(selectedStatus) }}
          >
            <option value="not-started">Не начато</option>
            <option value="in-progress">В процессе</option>
            <option value="completed">Завершено</option>
            <option value="on-hold">На паузе</option>
          </select>
        </div>

        <div className="control-group">
          <label>Фильтр по категории:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Все категории' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Поиск:</label>
          <input
            type="text"
            placeholder="Название или описание..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Статистика выбора */}
      <div className="selection-stats">
        <span>Выбрано: <strong>{selectedTechnologies.length}</strong> из {filteredTechnologies.length}</span>
        <div className="selection-actions">
          <button onClick={selectAllFiltered} className="btn btn-outline">
            Выбрать все ({filteredTechnologies.length})
          </button>
          <button onClick={clearSelection} className="btn btn-outline">
            Очистить
          </button>
        </div>
      </div>

      {/* Список технологий */}
      <div className="technologies-list">
        {filteredTechnologies.map(tech => (
          <div
            key={tech.id}
            className={`technology-item ${selectedTechnologies.includes(tech.id) ? 'selected' : ''}`}
            onClick={() => handleTechnologySelect(tech.id)}
          >
            <div className="tech-select">
              <input
                type="checkbox"
                checked={selectedTechnologies.includes(tech.id)}
                onChange={() => handleTechnologySelect(tech.id)}
              />
            </div>
            
            <div className="tech-info">
              <h4>{tech.title}</h4>
              <p>{tech.description}</p>
              <div className="tech-meta">
                <span className="category">{tech.category}</span>
                <span 
                  className="current-status"
                  style={{ color: getStatusColor(tech.status) }}
                >
                  Текущий: {getStatusText(tech.status)}
                </span>
              </div>
            </div>

            <div className="new-status">
              <span style={{ color: getStatusColor(selectedStatus) }}>
                → {getStatusText(selectedStatus)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="no-results">
          🚫 Нет технологий, соответствующих фильтру
        </div>
      )}

      {/* Кнопка применения */}
      {selectedTechnologies.length > 0 && (
        <div className="apply-section">
          <button onClick={applyStatus} className="btn btn-primary apply-btn">
            Применить статус "{getStatusText(selectedStatus)}" к {selectedTechnologies.length} технологиям
          </button>
        </div>
      )}
    </div>
  );
}

export default BulkStatusEditor;