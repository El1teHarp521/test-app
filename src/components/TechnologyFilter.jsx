import './TechnologyFilter.css';

function TechnologyFilter({ activeFilter, onFilterChange }) {
    const filters = [
        { key: 'all', label: 'Все', emoji: '📚' },
        { key: 'not-started', label: 'Не начатые', emoji: '⏳' },
        { key: 'in-progress', label: 'В процессе', emoji: '🔄' },
        { key: 'completed', label: 'Завершенные', emoji: '✅' }
    ];

    return (
        <div className="technology-filter">
            <h3>Фильтр технологий</h3>
            <div className="filter-buttons">
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
                        onClick={() => onFilterChange(filter.key)}
                    >
                        <span className="filter-emoji">{filter.emoji}</span>
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TechnologyFilter;