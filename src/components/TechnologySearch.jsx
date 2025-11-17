import { useState, useEffect, useCallback } from 'react';
import './TechnologySearch.css';

function TechnologySearch({ onSearch, onClear, placeholder = "Поиск технологий..." }) {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Debounce функция
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    };

    // Обработчик поиска с debounce
    const handleSearch = useCallback(
        debounce(async (searchQuery) => {
            if (searchQuery.trim()) {
                setIsSearching(true);
                await onSearch(searchQuery);
                setIsSearching(false);
            } else {
                onClear();
            }
        }, 500),
        [onSearch, onClear]
    );

    // Обработчик изменения input
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        handleSearch(value);
    };

    // Очистка поиска
    const handleClear = () => {
        setQuery('');
        onClear();
    };

    return (
        <div className="technology-search">
            <div className="search-container">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className="search-input"
                    />
                    {isSearching && (
                        <div className="search-spinner"></div>
                    )}
                    {query && !isSearching && (
                        <button
                            onClick={handleClear}
                            className="clear-button"
                            title="Очистить поиск"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="search-info">
                    {query && (
                        <span className="search-status">
                            {isSearching ? 'Поиск...' : 'Введите для поиска'}
                        </span>
                    )}
                </div>
            </div>

            {/* Расширенные фильтры поиска */}
            <div className="search-filters">
                <div className="filter-tags">
                    <span className="filter-label">Быстрый поиск:</span>
                    <button
                        onClick={() => setQuery('frontend')}
                        className="filter-tag"
                    >
                        frontend
                    </button>
                    <button
                        onClick={() => setQuery('backend')}
                        className="filter-tag"
                    >
                        backend
                    </button>
                    <button
                        onClick={() => setQuery('javascript')}
                        className="filter-tag"
                    >
                        javascript
                    </button>
                    <button
                        onClick={() => setQuery('beginner')}
                        className="filter-tag"
                    >
                        beginner
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TechnologySearch;