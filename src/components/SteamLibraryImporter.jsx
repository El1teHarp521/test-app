import { useState, useEffect, useCallback } from 'react';
import useSteamApi from '../hooks/useSteamApi';
import './SteamLibraryImporter.css';

function SteamLibraryImporter({ onGamesImported, existingTechnologies = [] }) {
  const { 
    games, 
    loading, 
    error, 
    apiStatus, 
    fetchUserGames, 
    fetchUserProfile,
    validateSteamId,
    STEAM_USER_ID 
  } = useSteamApi();

  const [userProfile, setUserProfile] = useState(null);
  const [selectedGames, setSelectedGames] = useState([]);
  const [importing, setImporting] = useState(false);
  const [customSteamId, setCustomSteamId] = useState('');
  const [showOnlyNotImported, setShowOnlyNotImported] = useState(false);
  const [sortBy, setSortBy] = useState('playtime');

  const loadUserProfile = useCallback(async () => {
    try {
      const profile = await fetchUserProfile(STEAM_USER_ID);
      setUserProfile(profile);
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  }, [fetchUserProfile, STEAM_USER_ID]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const loadGames = async () => {
    try {
      const idToUse = customSteamId.trim() || STEAM_USER_ID;
      if (!validateSteamId(idToUse)) {
        alert('Пожалуйста, введите корректный Steam ID');
        return;
      }
      
      await fetchUserGames(idToUse);
      setSelectedGames([]);
    } catch (err) {
      console.error('Failed to load games:', err);
    }
  };

  const handleGameSelect = (gameId) => {
    setSelectedGames(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const selectAllGames = () => {
    const filteredGames = getFilteredGames();
    if (filteredGames.length === 0) return;
    
    if (selectedGames.length === filteredGames.length) {
      setSelectedGames([]);
    } else {
      setSelectedGames(filteredGames.map(game => game.appid));
    }
  };

  const handleImportGames = async () => {
    if (selectedGames.length === 0) {
      alert('Пожалуйста, выберите игры для импорта');
      return;
    }

    try {
      setImporting(true);

      const gamesToImport = games
        .filter(game => selectedGames.includes(game.appid))
        .map(game => {
          const playtimeHours = Math.round(game.playtime_forever / 60);
          const isFreeGame = game.playtime_forever === 0;
          
          return {
            id: `steam_${game.appid}`,
            title: game.name,
            description: `Игра из Steam. ${isFreeGame ? 'Бесплатная игра' : `Время в игре: ${playtimeHours} часов`}.`,
            category: 'gaming',
            difficulty: getDifficultyLevel(playtimeHours),
            status: playtimeHours > 0 ? 'in-progress' : 'not-started',
            resources: [
              {
                title: 'Steam Store',
                url: `https://store.steampowered.com/app/${game.appid}/`,
                type: 'store'
              }
            ],
            tags: ['steam', 'gaming', ...getGameTags(game)],
            estimatedHours: playtimeHours || 10,
            notes: `Импортировано из Steam. AppID: ${game.appid}. ${isFreeGame ? 'Бесплатная игра' : `Время игры: ${playtimeHours}ч`}.`,
            source: 'steam',
            steamData: {
              appid: game.appid,
              playtime_forever: game.playtime_forever,
              playtime_hours: playtimeHours,
              img_icon_url: game.img_icon_url,
              has_community_visible_stats: game.has_community_visible_stats
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        });

      if (onGamesImported) {
        onGamesImported(gamesToImport);
      }

      setTimeout(() => {
        alert(`✅ Успешно импортировано ${gamesToImport.length} игр из Steam!`);
        setSelectedGames([]);
      }, 500);

    } catch (err) {
      alert(`❌ Ошибка импорта: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const getDifficultyLevel = (playtimeHours) => {
    if (playtimeHours === 0) return 'beginner';
    if (playtimeHours < 10) return 'beginner';
    if (playtimeHours < 50) return 'intermediate';
    if (playtimeHours < 100) return 'advanced';
    return 'expert';
  };

  const getGameTags = (game) => {
    const tags = [];
    if (game.playtime_forever === 0) tags.push('free');
    if (game.playtime_forever > 3000) tags.push('played-a-lot');
    if (game.has_community_visible_stats) tags.push('has-stats');
    return tags;
  };

  const isGameAlreadyImported = (appid) => {
    return existingTechnologies.some(tech => 
      tech.steamData?.appid === appid || tech.id === `steam_${appid}`
    );
  };

  const getFilteredGames = () => {
    let filtered = games;

    if (showOnlyNotImported) {
      filtered = filtered.filter(game => !isGameAlreadyImported(game.appid));
    }

    switch (sortBy) {
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        filtered = [...filtered].sort((a, b) => b.playtime_forever - a.playtime_forever);
        break;
      case 'playtime':
      default:
        break;
    }

    return filtered;
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'loading': return '🔄 Загрузка игр из Steam...';
      case 'success': return `✅ Загружено ${games.length} игр`;
      case 'error': return '❌ Ошибка загрузки';
      default: return '⚪ Готов к загрузке';
    }
  };

  const filteredGames = getFilteredGames();

  return (
    <div className="steam-library-importer">
      <div className="importer-header">
        <h3>🎮 Импорт игр из Steam</h3>
        <div className="api-status">
          Статус: <span className={`status-${apiStatus}`}>{getStatusText()}</span>
        </div>
      </div>

      {userProfile && (
        <div className="user-profile">
          <img 
            src={userProfile.avatarfull} 
            alt="Avatar" 
            className="user-avatar"
          />
          <div className="user-info">
            <h4>{userProfile.personaname}</h4>
            <p>SteamID: {userProfile.steamid}</p>
          </div>
        </div>
      )}

      <div className="steam-id-section">
        <label htmlFor="steamId">Steam ID (опционально):</label>
        <input
          id="steamId"
          type="text"
          placeholder="Введите ваш Steam ID..."
          value={customSteamId}
          onChange={(e) => setCustomSteamId(e.target.value)}
          className="steam-id-input"
        />
        <small>
          Оставьте пустым для использования вашего ID: {STEAM_USER_ID}
        </small>
      </div>

      <div className="controls">
        <button 
          onClick={loadGames}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? '🔄 Загрузка...' : '🎮 Загрузить мои игры'}
        </button>
      </div>

      {games.length > 0 && (
        <div className="games-section">
          <div className="games-header">
            <div>
              <h4>Ваши игры ({filteredGames.length} из {games.length})</h4>
              <span>Выбрано: {selectedGames.length}</span>
            </div>
            
            <div className="games-controls">
              <div className="filter-controls">
                <label>
                  <input
                    type="checkbox"
                    checked={showOnlyNotImported}
                    onChange={(e) => setShowOnlyNotImported(e.target.checked)}
                  />
                  Только не импортированные
                </label>
                
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="playtime">Сортировка: по времени</option>
                  <option value="name">Сортировка: по названию</option>
                  <option value="recent">Сортировка: по активности</option>
                </select>
              </div>

              <div className="selection-controls">
                <button 
                  onClick={selectAllGames}
                  className="btn btn-secondary"
                >
                  {selectedGames.length === filteredGames.length ? '❌ Снять выделение' : '✅ Выбрать все'}
                </button>
              </div>
            </div>
          </div>

          <div className="games-grid">
            {filteredGames.map((game) => {
              const isImported = isGameAlreadyImported(game.appid);
              const playtimeHours = Math.round(game.playtime_forever / 60);
              
              return (
                <div 
                  key={game.appid}
                  className={`game-card ${selectedGames.includes(game.appid) ? 'selected' : ''} ${isImported ? 'imported' : ''}`}
                >
                  <div className="game-select">
                    <input
                      type="checkbox"
                      checked={selectedGames.includes(game.appid)}
                      onChange={() => handleGameSelect(game.appid)}
                      disabled={isImported}
                    />
                  </div>

                  <div className="game-icon">
                    {game.img_icon_url ? (
                      <img 
                        src={`https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                        alt={game.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <div className="game-icon-fallback">🎮</div>
                  </div>

                  <div className="game-info">
                    <h5 className="game-title">{game.name}</h5>
                    <div className="game-meta">
                      {playtimeHours > 0 ? (
                        <span className="playtime">⏱️ {playtimeHours}ч</span>
                      ) : (
                        <span className="playtime free">🆓 Бесплатная</span>
                      )}
                      <span className="difficulty">
                        Сложность: {getDifficultyLevel(playtimeHours)}
                      </span>
                    </div>
                    
                    {isImported && (
                      <div className="imported-badge">✅ Импортировано</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedGames.length > 0 && (
            <div className="import-actions">
              <button 
                onClick={handleImportGames}
                disabled={importing}
                className="btn btn-success import-btn"
              >
                {importing ? '📥 Импорт...' : `📥 Импортировать выбранные (${selectedGames.length})`}
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          <h4>❌ Ошибка</h4>
          <p>{error}</p>
          <details>
            <summary>Подробности</summary>
            <small>
              Это может быть связано с:<br/>
              • Неправильным Steam ID<br/>
              • Приватным профилем<br/>
              • Проблемами с Steam API<br/>
              • Ограничениями CORS<br/>
              <br/>
              Ваш Steam ID: {STEAM_USER_ID}<br/>
              Ключ API: ✅ Установлен
            </small>
          </details>
        </div>
      )}

      <div className="info-section">
        <h4>💡 Информация</h4>
        <ul>
          <li>Игры импортируются как технологии с категорией "gaming"</li>
          <li>Время в игре влияет на уровень сложности</li>
          <li>Уже импортированные игры помечены ✅</li>
          <li>Для приватных профилей импорт может не работать</li>
          <li>Игры отсортированы по времени игры (от большего к меньшему)</li>
        </ul>
      </div>
    </div>
  );
}

export default SteamLibraryImporter;