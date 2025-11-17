import './ProgressHeader.css';

function ProgressHeader({ technologies, progress, stats }) {
    const total = technologies?.length || 0;
    const completed = technologies?.filter(tech => tech.status === 'completed').length || 0;
    const inProgress = technologies?.filter(tech => tech.status === 'in-progress').length || 0;
    const notStarted = technologies?.filter(tech => tech.status === 'not-started').length || 0;

    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="progress-header">
            <h2>Прогресс изучения</h2>

            <div className="progress-container">
                <div className="progress-info">
                    <span className="progress-label">Общий прогресс</span>
                    <span className="progress-percentage">{progressPercentage}%</span>
                </div>
                <div className="progress-bar-wrapper">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progressPercentage}%` }}
                    >
                        {progressPercentage > 15 && (
                            <span className="progress-bar-text">{progressPercentage}%</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-item">
                    <span className="stat-number">{total}</span>
                    <span className="stat-label">Всего технологий</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{completed}</span>
                    <span className="stat-label">Завершено</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{inProgress}</span>
                    <span className="stat-label">В процессе</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{notStarted}</span>
                    <span className="stat-label">Не начато</span>
                </div>
            </div>
        </div>
    );
}

export default ProgressHeader;