import './QuickActions.css';

function QuickActions({ 
  technologies, 
  onMarkAllCompleted, 
  onResetAll, 
  onImportFromSteam,
  onStatusUpdate // Добавляем эту функцию
}) {
  
  const handleStartRandomTech = () => {
    const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
    
    if (notStartedTechs.length === 0) {
      alert('🎉 Все технологии уже начаты или завершены!');
      return;
    }
    
    const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
    
    if (window.confirm(`🎲 Начать изучение "${randomTech.title}"?`)) {
      // Меняем статус технологии на "в процессе"
      if (onStatusUpdate) {
        onStatusUpdate(randomTech.id, 'in-progress');
        alert(`🚀 Начинаем изучение: ${randomTech.title}`);
      }
    }
  };

  const getStats = () => {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === 'completed').length;
    const inProgress = technologies.filter(t => t.status === 'in-progress').length;
    const notStarted = technologies.filter(t => t.status === 'not-started').length;
    
    return { total, completed, inProgress, notStarted };
  };

  const stats = getStats();

  return (
    <div className="quick-actions">
      <div className="actions-header">
        <h3>⚡ Быстрые действия</h3>
        <div className="stats-badge">
          📊 {stats.completed}/{stats.total} завершено
        </div>
      </div>

      <div className="actions-grid">
        <button 
          onClick={handleStartRandomTech}
          className="action-btn random-tech"
          disabled={stats.notStarted === 0}
        >
          <span className="action-icon">🎲</span>
          <span className="action-text">Случайная технология</span>
          <span className="action-count">{stats.notStarted}</span>
        </button>

        <button 
          onClick={onMarkAllCompleted}
          className="action-btn mark-all"
          disabled={stats.completed === stats.total}
        >
          <span className="action-icon">✅</span>
          <span className="action-text">Завершить все</span>
        </button>

        <button 
          onClick={onResetAll}
          className="action-btn reset-all"
          disabled={stats.notStarted === stats.total}
        >
          <span className="action-icon">🔄</span>
          <span className="action-text">Сбросить все</span>
        </button>

        <button 
          onClick={onImportFromSteam}
          className="action-btn steam-import"
        >
          <span className="action-icon">🎮</span>
          <span className="action-text">Импорт из Steam</span>
        </button>
      </div>

      <div className="progress-summary">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(stats.completed / stats.total) * 100 || 0}%` }}
          ></div>
        </div>
        <div className="progress-stats">
          <span>✅ {stats.completed} завершено</span>
          <span>🔄 {stats.inProgress} в процессе</span>
          <span>⏳ {stats.notStarted} не начато</span>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;