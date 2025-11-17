import { useState } from 'react';
import useSteamApi from '../hooks/useSteamApi';
import './SteamImporter.css';

function SteamImporter({ onGamesImported }) {
    const { games, loading, error, apiStatus, fetchUserGames, searchGames, addGame } = useSteamApi();
    const [importing, setImporting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [steamId, setSteamId] = useState('');
    const [importedCount, setImportedCount] = useState(0);

    const handleImportSteamLibrary = async () => {
        try {
            setImporting(true);
            await fetchUserGames(steamId || undefined);

            if (games.length > 0) {
                setImportedCount(games.length);

                // Если передан колбэк, вызываем его с импортированными играми
                if (onGamesImported) {
                    onGamesImported(games);
                }

                setTimeout(() => {
                    alert(`✅ Успешно загружено ${games.length} игр из вашей библиотеки Steam`);
                }, 500);
            }
        } catch (err) {
            alert(`⚠️ ${err.message}`);
        } finally {
            setImporting(false);
        }
    };

    const handleSearchGames = async () => {
        if (!searchQuery.trim()) return;

        try {
            setImporting(true);
            const results = await searchGames(searchQuery);
            setSearchResults(results);
        } catch (err) {
            alert(`⚠️ Ошибка поиска: ${err.message}`);
        } finally {
            setImporting(false);
        }
    };

    const handleAddGame = async (game) => {
        try {
            await addGame(game);

            if (onGamesImported) {
                onGamesImported([game]);
            }

            alert(`🎮 Игра "${game.title}" добавлена в трекер`);

            // Обновляем счетчик
            setImportedCount(prev => prev + 1);
        } catch (err) {
            alert(`⚠️ Ошибка добавления: ${err.message}`);
        }
    };

    const handleSteamIdSubmit = (e) => {
        e.preventDefault();
        if (steamId.trim()) {
            handleImportSteamLibrary();
        } else {
            // Используем дефолтный Steam ID
            handleImportSteamLibrary();
        }
    };

    const getStatusMessage = () => {
        switch (apiStatus) {
            case 'online': return '🟢 Steam API доступен';
            case 'offline': return '🟡 Используем демо-данные (Steam API недоступен)';
            case 'loading': return '🟡 Загрузка данных...';
            case 'error': return '🔴 Ошибка загрузки';
            default: return '⚪ Проверка статуса...';
        }
    };

    return (
        <div className="steam-importer">
            <h3>🎮 Импорт из Steam</h3>

            <div className="steam-status">
                <span className="status-message">{getStatusMessage()}</span>
            </div>

            {/* Импорт библиотеки игр */}
            <div className="import-section">
                <h4>Импорт вашей библиотеки Steam</h4>
                <form onSubmit={handleSteamIdSubmit} className="steam-id-form">
                    <input
                        type="text"
                        placeholder="Введите ваш Steam ID (оставьте пустым для демо)"
                        value={steamId}
                        onChange={(e) => setSteamId(e.target.value)}
                        className="steam-id-input"
                    />
                    <button
                        type="submit"
                        disabled={importing}
                        className="btn btn-primary"
                    >
                        {importing ? '📥 Загрузка...' : '📥 Загрузить библиотеку'}
                    </button>
                </form>
                <p className="help-text">
                    Steam ID можно найти в вашем профиле Steam. Оставьте поле пустым для демо-данных.
                </p>
            </div>

            {/* Поиск игр */}
            <div className="search-section">
                <h4>Поиск игр в Steam Store</h4>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Название игры..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button
                        onClick={handleSearchGames}
                        disabled={importing || !searchQuery.trim()}
                        className="btn btn-secondary"
                    >
                        {importing ? '🔍 Поиск...' : '🔍 Найти'}
                    </button>
                </div>

                {searchResults.length > 0 && (
                    <div className="search-results">
                        <h5>Результаты поиска:</h5>
                        {searchResults.map(game => (
                            <div key={game.id} className="search-result-item">
                                <div className="game-info">
                                    <strong>{game.title}</strong>
                                    <span className="game-description">{game.description}</span>
                                </div>
                                <button
                                    onClick={() => handleAddGame(game)}
                                    className="btn btn-outline"
                                >
                                    ➕ Добавить
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Статистика */}
            {games.length > 0 && (
                <div className="steam-stats">
                    <h4>📊 Статистика Steam</h4>
                    <div className="stats-grid">
                        <div className="stat">
                            <span className="stat-number">{games.length}</span>
                            <span className="stat-label">Всего игр</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">
                                {games.filter(g => g.status === 'in-progress').length}
                            </span>
                            <span className="stat-label">В процессе</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">
                                {Math.round(games.reduce((total, game) => total + (game.playtime || 0), 0))}
                            </span>
                            <span className="stat-label">Часов всего</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">{importedCount}</span>
                            <span className="stat-label">Импортировано</span>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}

            {/* Демо-информация */}
            <div className="demo-info">
                <h4>💡 Информация</h4>
                <p>Из-за ограничений CORS Steam API может быть недоступно в браузере.</p>
                <p>Приложение использует демо-данные популярных игр для тестирования функционала.</p>
                <p>Для полной функциональности рекомендуется запускать приложение с сервера.</p>
            </div>
        </div>
    );
}

export default SteamImporter;