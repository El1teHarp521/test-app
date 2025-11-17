import { useState, useEffect } from 'react';
import './ResourceLoader.css';

function ResourceLoader({ techId, techTitle, onResourcesLoaded }) {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const loadResources = async () => {
        try {
            setLoading(true);
            setError(null);

            // Имитация загрузки ресурсов из API
            const response = await fetch(`https://api.tech-tracker.com/v1/technologies/${techId}/resources`);

            if (!response.ok) {
                throw new Error('Не удалось загрузить ресурсы');
            }

            const data = await response.json();
            setResources(data.resources);

            if (onResourcesLoaded) {
                onResourcesLoaded(data.resources);
            }

        } catch (err) {
            setError(err.message);
            console.error('Ошибка загрузки ресурсов:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (expanded && resources.length === 0) {
            loadResources();
        }
    }, [expanded, techId]);

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    if (loading) {
        return (
            <div className="resource-loader">
                <button className="resource-toggle" onClick={handleToggle}>
                    📚 Дополнительные ресурсы
                    <span className="toggle-icon">{expanded ? '▲' : '▼'}</span>
                </button>
                {expanded && (
                    <div className="resources-loading">
                        <div className="loading-spinner"></div>
                        <span>Загрузка ресурсов...</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="resource-loader">
            <button className="resource-toggle" onClick={handleToggle}>
                📚 Дополнительные ресурсы ({resources.length})
                <span className="toggle-icon">{expanded ? '▲' : '▼'}</span>
            </button>

            {expanded && (
                <div className="resources-content">
                    {error ? (
                        <div className="resources-error">
                            <p>⚠️ {error}</p>
                            <button onClick={loadResources} className="retry-button">
                                Попробовать снова
                            </button>
                        </div>
                    ) : resources.length > 0 ? (
                        <div className="resources-list">
                            <h4>Ресурсы для {techTitle}:</h4>
                            {resources.map((resource, index) => (
                                <div key={index} className="resource-item">
                                    <div className="resource-header">
                                        <span className="resource-title">{resource.title}</span>
                                        <span className="resource-type">{resource.type}</span>
                                    </div>
                                    {resource.description && (
                                        <p className="resource-description">{resource.description}</p>
                                    )}
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="resource-link"
                                    >
                                        🔗 Перейти к ресурсу
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-resources">
                            <p>Дополнительные ресурсы не найдены</p>
                            <button onClick={loadResources} className="retry-button">
                                Загрузить ресурсы
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ResourceLoader;