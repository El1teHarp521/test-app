import ProgressBar from './ProgressBar';
import './ProgressHeader.css';

function ProgressHeader({ technologies, progress, stats }) {
    return (
        <div className="progress-header">
            <h2>Прогресс изучения</h2>

            <ProgressBar
                progress={progress}
                label="Общий прогресс"
                color="#4ecdc4"
                height={25}
                showPercentage={true}
            />

            <div className="stats-grid">
                <div className="stat-item">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Всего технологий</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{stats.completed}</span>
                    <span className="stat-label">Завершено</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{stats.inProgress}</span>
                    <span className="stat-label">В процессе</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{stats.notStarted}</span>
                    <span className="stat-label">Не начато</span>
                </div>
            </div>
        </div>
    );
}

export default ProgressHeader;