import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Statistics.css';

function Statistics() {
    const [technologies, setTechnologies] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            setTechnologies(JSON.parse(saved));
        }
    }, []);

    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
    const total = technologies.length;

    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const inProgressPercentage = total > 0 ? Math.round((inProgress / total) * 100) : 0;
    const notStartedPercentage = total > 0 ? Math.round((notStarted / total) * 100) : 0;

    return (
        <div className="page">
            <div className="page-header">
                <h1>📊 Статистика изучения</h1>
                <p>Обзор вашего прогресса в изучении технологий</p>
            </div>

            {total === 0 ? (
                <div className="empty-state">
                    <p>Нет данных для отображения статистики.</p>
                    <Link to="/add-technology" className="btn btn-primary">
                        Добавить первую технологию
                    </Link>
                </div>
            ) : (
                <>
                    <div className="stats-overview">
                        <div className="main-stat">
                            <h3>Общий прогресс</h3>
                            <div className="progress-circle">
                                <div className="circle">
                                    <span className="percentage">{progressPercentage}%</span>
                                </div>
                            </div>
                            <p>{completed} из {total} технологий изучено</p>
                        </div>

                        <div className="stats-details">
                            <div className="stat-item">
                                <span className="stat-label">✅ Завершено</span>
                                <span className="stat-value">{completed}</span>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill completed"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                                <span className="stat-percentage">{progressPercentage}%</span>
                            </div>

                            <div className="stat-item">
                                <span className="stat-label">🔄 В процессе</span>
                                <span className="stat-value">{inProgress}</span>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill in-progress"
                                        style={{ width: `${inProgressPercentage}%` }}
                                    ></div>
                                </div>
                                <span className="stat-percentage">{inProgressPercentage}%</span>
                            </div>

                            <div className="stat-item">
                                <span className="stat-label">⏳ Не начато</span>
                                <span className="stat-value">{notStarted}</span>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill not-started"
                                        style={{ width: `${notStartedPercentage}%` }}
                                    ></div>
                                </div>
                                <span className="stat-percentage">{notStartedPercentage}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="chart-section">
                        <h2>Распределение по статусам</h2>
                        <div className="chart">
                            <div
                                className="chart-segment completed"
                                style={{ flex: completed }}
                                title={`Завершено: ${completed} (${progressPercentage}%)`}
                            >
                                {completed > 0 && <span>✅ {completed}</span>}
                            </div>
                            <div
                                className="chart-segment in-progress"
                                style={{ flex: inProgress }}
                                title={`В процессе: ${inProgress} (${inProgressPercentage}%)`}
                            >
                                {inProgress > 0 && <span>🔄 {inProgress}</span>}
                            </div>
                            <div
                                className="chart-segment not-started"
                                style={{ flex: notStarted }}
                                title={`Не начато: ${notStarted} (${notStartedPercentage}%)`}
                            >
                                {notStarted > 0 && <span>⏳ {notStarted}</span>}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Statistics;