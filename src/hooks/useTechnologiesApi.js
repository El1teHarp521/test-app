import { useState, useEffect, useCallback } from 'react';

// Имитация реального API endpoints
const API_BASE_URL = 'https://api.tech-tracker.com/v1';

function useTechnologiesApi() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiStatus, setApiStatus] = useState('checking');

    // Проверка статуса API
    const checkApiStatus = useCallback(async () => {
        try {
            setApiStatus('checking');
            // Имитация проверки API
            await new Promise(resolve => setTimeout(resolve, 500));
            setApiStatus('online');
        } catch (err) {
            setApiStatus('offline');
        }
    }, []);

    // Загрузка технологий из API
    const fetchTechnologies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setApiStatus('loading');

            // Имитация API запроса с реальной структурой
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock данные с расширенной структурой
            const mockTechnologies = [
                {
                    id: 1,
                    title: 'React',
                    description: 'Библиотека для создания пользовательских интерфейсов',
                    category: 'frontend',
                    difficulty: 'beginner',
                    status: 'not-started',
                    resources: [
                        {
                            title: 'Официальная документация',
                            url: 'https://react.dev',
                            type: 'documentation'
                        },
                        {
                            title: 'Русская документация',
                            url: 'https://ru.reactjs.org',
                            type: 'documentation'
                        }
                    ],
                    tags: ['javascript', 'ui', 'components'],
                    estimatedHours: 40,
                    prerequisites: ['HTML', 'CSS', 'JavaScript'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: 'Node.js',
                    description: 'Среда выполнения JavaScript на сервере',
                    category: 'backend',
                    difficulty: 'intermediate',
                    status: 'not-started',
                    resources: [
                        {
                            title: 'Официальный сайт',
                            url: 'https://nodejs.org',
                            type: 'website'
                        },
                        {
                            title: 'Документация',
                            url: 'https://nodejs.org/ru/docs/',
                            type: 'documentation'
                        }
                    ],
                    tags: ['javascript', 'server', 'runtime'],
                    estimatedHours: 60,
                    prerequisites: ['JavaScript', 'npm'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: 'TypeScript',
                    description: 'Типизированное надмножество JavaScript',
                    category: 'language',
                    difficulty: 'intermediate',
                    status: 'not-started',
                    resources: [
                        {
                            title: 'Официальный сайт',
                            url: 'https://www.typescriptlang.org',
                            type: 'website'
                        },
                        {
                            title: 'Handbook',
                            url: 'https://www.typescriptlang.org/docs/',
                            type: 'documentation'
                        }
                    ],
                    tags: ['javascript', 'types', 'compiler'],
                    estimatedHours: 35,
                    prerequisites: ['JavaScript'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 4,
                    title: 'Docker',
                    description: 'Платформа для контейнеризации приложений',
                    category: 'devops',
                    difficulty: 'intermediate',
                    status: 'not-started',
                    resources: [
                        {
                            title: 'Официальный сайт',
                            url: 'https://www.docker.com',
                            type: 'website'
                        },
                        {
                            title: 'Документация',
                            url: 'https://docs.docker.com',
                            type: 'documentation'
                        }
                    ],
                    tags: ['containers', 'deployment', 'virtualization'],
                    estimatedHours: 25,
                    prerequisites: ['Linux basics'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];

            setTechnologies(mockTechnologies);
            setApiStatus('online');

        } catch (err) {
            setError('Не удалось загрузить технологии из API');
            setApiStatus('error');
            console.error('Ошибка загрузки:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Поиск технологий с debounce
    const searchTechnologies = useCallback(async (query) => {
        if (!query.trim()) {
            return technologies;
        }

        try {
            setLoading(true);
            // Имитация API поиска
            await new Promise(resolve => setTimeout(resolve, 300));

            const filtered = technologies.filter(tech =>
                tech.title.toLowerCase().includes(query.toLowerCase()) ||
                tech.description.toLowerCase().includes(query.toLowerCase()) ||
                tech.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
                tech.category.toLowerCase().includes(query.toLowerCase())
            );

            return filtered;
        } catch (err) {
            console.error('Ошибка поиска:', err);
            return technologies;
        } finally {
            setLoading(false);
        }
    }, [technologies]);

    // Добавление новой технологии
    const addTechnology = async (techData) => {
        try {
            setLoading(true);
            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 500));

            const newTech = {
                id: Date.now(),
                ...techData,
                status: techData.status || 'not-started',
                resources: techData.resources || [],
                tags: techData.tags || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            setTechnologies(prev => [...prev, newTech]);
            return newTech;

        } catch (err) {
            throw new Error('Не удалось добавить технологию');
        } finally {
            setLoading(false);
        }
    };

    // Обновление технологии
    const updateTechnology = async (id, updates) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 300));

            setTechnologies(prev =>
                prev.map(tech =>
                    tech.id === id
                        ? { ...tech, ...updates, updatedAt: new Date().toISOString() }
                        : tech
                )
            );

        } catch (err) {
            throw new Error('Не удалось обновить технологию');
        } finally {
            setLoading(false);
        }
    };

    // Удаление технологии
    const deleteTechnology = async (id) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 300));

            setTechnologies(prev => prev.filter(tech => tech.id !== id));

        } catch (err) {
            throw new Error('Не удалось удалить технологию');
        } finally {
            setLoading(false);
        }
    };

    // Загрузка дополнительных ресурсов для технологии
    const fetchAdditionalResources = async (techId) => {
        try {
            // Имитация загрузки дополнительных ресурсов из API
            await new Promise(resolve => setTimeout(resolve, 500));

            const mockResources = {
                1: [
                    {
                        title: 'React Tutorial',
                        url: 'https://react-tutorial.app',
                        type: 'tutorial',
                        description: 'Интерактивный учебник по React'
                    },
                    {
                        title: 'React Patterns',
                        url: 'https://reactpatterns.com',
                        type: 'patterns',
                        description: 'Паттерны React'
                    }
                ],
                2: [
                    {
                        title: 'Node.js Best Practices',
                        url: 'https://github.com/goldbergyoni/nodebestpractices',
                        type: 'best-practices',
                        description: 'Лучшие практики Node.js'
                    }
                ],
                3: [
                    {
                        title: 'TypeScript Exercises',
                        url: 'https://typescript-exercises.github.io',
                        type: 'exercises',
                        description: 'Упражнения по TypeScript'
                    }
                ]
            };

            return mockResources[techId] || [];
        } catch (err) {
            console.error('Ошибка загрузки ресурсов:', err);
            return [];
        }
    };

    // Загружаем технологии при монтировании
    useEffect(() => {
        checkApiStatus();
        fetchTechnologies();
    }, [fetchTechnologies, checkApiStatus]);

    return {
        technologies,
        loading,
        error,
        apiStatus,
        refetch: fetchTechnologies,
        addTechnology,
        updateTechnology,
        deleteTechnology,
        searchTechnologies,
        fetchAdditionalResources,
        checkApiStatus
    };
}

export default useTechnologiesApi;