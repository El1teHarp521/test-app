import { useState, useCallback } from 'react';

// Константы вынесены в отдельный объект для экспорта
export const STEAM_CONSTANTS = {
    API_KEY: 'D6ECC2615F2D5BB166B5F3EC9CDF9C75',
    USER_ID: '76561198368559904'
};

// Прокси для обхода CORS
const STEAM_PROXY_URL = 'https://api.allorigins.win/raw?url=';

function useSteamApi() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiStatus, setApiStatus] = useState('idle');

    // Функция для создания URL с прокси
    const createSteamUrl = (endpoint) => {
        const encodedUrl = encodeURIComponent(`https://api.steampowered.com${endpoint}`);
        return `${STEAM_PROXY_URL}${encodedUrl}`;
    };

    // Получение списка игр пользователя
    const fetchUserGames = useCallback(async (steamId = STEAM_CONSTANTS.USER_ID) => {
        try {
            setLoading(true);
            setError(null);
            setApiStatus('loading');

            const url = createSteamUrl(
                `/IPlayerService/GetOwnedGames/v1/?key=${STEAM_CONSTANTS.API_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true&format=json`
            );

            console.log('Fetching Steam games from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.response || !data.response.games) {
                throw new Error('No games found in response');
            }

            console.log('Raw Steam API response:', data);
            console.log(`Total games found: ${data.response.games.length}`);

            // Убираем ограничение slice(0, 20) - загружаем все игры
            const allGames = data.response.games;

            // Получаем детали для каждой игры (можно ограничить если игр очень много)
            const gamesWithDetails = await Promise.all(
                allGames.map(async (game) => {
                    try {
                        const gameDetails = await fetchGameDetails(game.appid);
                        return {
                            ...game,
                            details: gameDetails || null
                        };
                    } catch (err) {
                        console.warn(`Could not fetch details for game ${game.appid}:`, err);
                        return {
                            ...game,
                            details: null
                        };
                    }
                })
            );

            // Сортируем игры по времени игры (от большего к меньшему)
            const sortedGames = gamesWithDetails.sort((a, b) => b.playtime_forever - a.playtime_forever);

            setGames(sortedGames);
            setApiStatus('success');

            return sortedGames;

        } catch (err) {
            const errorMsg = `Failed to fetch Steam games: ${err.message}`;
            setError(errorMsg);
            setApiStatus('error');
            console.error('Steam API error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Получение деталей игры
    const fetchGameDetails = async (appId) => {
        try {
            const url = createSteamUrl(
                `/ISteamUserStats/GetSchemaForGame/v2/?key=${STEAM_CONSTANTS.API_KEY}&appid=${appId}`
            );

            const response = await fetch(url);

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data.game || null;

        } catch (err) {
            console.warn(`Failed to fetch details for app ${appId}:`, err);
            return null;
        }
    };

    // Получение информации о пользователе
    const fetchUserProfile = useCallback(async (steamId = STEAM_CONSTANTS.USER_ID) => {
        try {
            const url = createSteamUrl(
                `/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_CONSTANTS.API_KEY}&steamids=${steamId}`
            );

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.response || !data.response.players || data.response.players.length === 0) {
                throw new Error('No player data found');
            }

            return data.response.players[0];

        } catch (err) {
            console.error('Failed to fetch user profile:', err);
            throw err;
        }
    });

    // Проверка валидности Steam ID
    const validateSteamId = (steamId) => {
        return /^7656119[0-9]{10}$/.test(steamId);
    };

    return {
        games,
        loading,
        error,
        apiStatus,
        fetchUserGames,
        fetchUserProfile,
        validateSteamId,
        STEAM_USER_ID: STEAM_CONSTANTS.USER_ID,
        STEAM_API_KEY: STEAM_CONSTANTS.API_KEY
    };
}

export default useSteamApi;