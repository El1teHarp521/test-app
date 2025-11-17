import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './TechnologyList.css';

function TechnologyList() {
    const [technologies, setTechnologies] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            setTechnologies(JSON.parse(saved));
        }
    }, []);

    const filteredTechnologies = technologies.filter(tech => {
        if (filter === 'all') return true;
        return tech.status === filter;
    });

    const deleteTechnology = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
            const updated = technologies.filter(tech => tech.id !== id);
            setTechnologies(updated);
            localStorage.setItem('technologies', JSON.stringify(updated));
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return '✅ Завершено';
            case 'in-progress': return '🔄 В процессе';
            case 'not-started': return '⏳ Не начато';
            default: return status;
        }
    };

    const getStatusClass = (status) => {
        return `status-${status}`;
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Все технологии</h1>
                <Link to="/add-technology" className="btn btn-primary">
                    + Добавить технологию
                </Link>
            </div>

            <div className="filter-tabs">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    Все ({technologies.length})
                </button>
                <button
                    className={filter === 'not-started' ? 'active' : ''}
                    onClick={() => setFilter('not-started')}
                >
                    Не начатые ({technologies.filter(t => t.status === 'not-started').length})
                </button>
                <button
                    className={filter === 'in-progress' ? 'active' : ''}
                    onClick={() => setFilter('in-progress')}
                >
                    В процессе ({technologies.filter(t => t.status === 'in-progress').length})
                </button>
                <button
                    className={filter === 'completed' ? 'active' : ''}
                    onClick={() => setFilter('completed')}
                >
                    Завершённые ({technologies.filter(t => t.status === 'completed').length})
                </button>
            </div>

            <div className="technologies-grid">
                {filteredTechnologies.map(tech => (
                    <div key={tech.id} className={`technology-item ${getStatusClass(tech.status)}`}>
                        <div className="technology-content">
                            <h3>{tech.title}</h3>
                            <p>{tech.description}</p>
                            <div className="technology-meta">
                                <span className={`status ${getStatusClass(tech.status)}`}>
                                    {getStatusText(tech.status)}
                                </span>
                                <div className="technology-actions">
                                    <Link to={`/technology/${tech.id}`} className="btn-link">
                                        Подробнее →
                                    </Link>
                                    <button
                                        onClick={() => deleteTechnology(tech.id)}
                                        className="btn-danger"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTechnologies.length === 0 && (
                <div className="empty-state">
                    {technologies.length === 0 ? (
                        <>
                            <p>Технологий пока нет.</p>
                            <Link to="/add-technology" className="btn btn-primary">
                                Добавить первую технологию
                            </Link>
                        </>
                    ) : (
                        <>
                            <p>Нет технологий с выбранным статусом.</p>
                            <button
                                onClick={() => setFilter('all')}
                                className="btn btn-secondary"
                            >
                                Показать все технологии
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default TechnologyList;