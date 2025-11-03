import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
    const total = technologies.length;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;

    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="progress-header">
            <h2>Прогресс изучения</h2>

            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${progressPercentage}%` }}
                >
                    <span className="progress-text">{progressPercentage}%</span>
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