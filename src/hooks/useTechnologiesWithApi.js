import { useState, useEffect, useCallback } from 'react';

function useTechnologiesWithApi() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiStatus, setApiStatus] = useState('checking');

    // Загрузка из localStorage
    const loadFromLocalStorage = () => {
        try {
            const saved = localStorage.getItem('technologies');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (err) {
            console.error('Error loading from localStorage:', err);
        }
        return null;
    };

    // Сохранение в localStorage
    const saveToLocalStorage = (techs) => {
        try {
            localStorage.setItem('technologies', JSON.stringify(techs));
        } catch (err) {
            console.error('Error saving to localStorage:', err);
        }
    };

    // Проверка статуса API
    const checkApiStatus = useCallback(async () => {
        try {
            setApiStatus('checking');
            await new Promise(resolve => setTimeout(resolve, 500));
            setApiStatus('online');
        } catch (err) {
            setApiStatus('offline');
        }
    }, []);

    // Загрузка начальных данных
    const fetchTechnologies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Сначала проверяем, есть ли данные в localStorage
            const localData = loadFromLocalStorage();

            if (localData && localData.length > 0) {
                // Используем локальные данные
                setTechnologies(localData);
                setLoading(false);
                setApiStatus('online');
            } else {
                // Если локальных данных нет, загружаем демо-данные
                await loadDemoTechnologies();
            }

        } catch (err) {
            setError('Ошибка загрузки данных');
            console.error('Ошибка загрузки:', err);
            setLoading(false);
        }
    }, []);

    // Загрузка демо-технологий
    const loadDemoTechnologies = async () => {
        try {
            setApiStatus('loading');

            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 1000));

            const demoTechnologies = [
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
                        }
                    ],
                    tags: ['javascript', 'ui', 'components'],
                    estimatedHours: 40,
                    prerequisites: ['HTML', 'CSS', 'JavaScript'],
                    notes: '',
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
                        }
                    ],
                    tags: ['javascript', 'server', 'runtime'],
                    estimatedHours: 60,
                    prerequisites: ['JavaScript', 'npm'],
                    notes: '',
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
                        }
                    ],
                    tags: ['javascript', 'types', 'compiler'],
                    estimatedHours: 35,
                    prerequisites: ['JavaScript'],
                    notes: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];

            setTechnologies(demoTechnologies);
            saveToLocalStorage(demoTechnologies);
            setApiStatus('online');
            setLoading(false);

        } catch (err) {
            setApiStatus('offline');
            setError('Не удалось загрузить демо-данные');
            console.error('Ошибка загрузки демо-данных:', err);
            setLoading(false);
        }
    };

    // Обновление статуса технологии
    const updateStatus = useCallback((id, newStatus) => {
        setTechnologies(prev => {
            const updated = prev.map(tech =>
                tech.id === id ? {
                    ...tech,
                    status: newStatus,
                    updatedAt: new Date().toISOString()
                } : tech
            );
            saveToLocalStorage(updated);
            return updated;
        });
    }, []);

    // Обновление заметок
    const updateNotes = useCallback((id, newNotes) => {
        setTechnologies(prev => {
            const updated = prev.map(tech =>
                tech.id === id ? {
                    ...tech,
                    notes: newNotes,
                    updatedAt: new Date().toISOString()
                } : tech
            );
            saveToLocalStorage(updated);
            return updated;
        });
    }, []);

    // Массовое обновление статусов
    const updateAllStatuses = useCallback((status) => {
        setTechnologies(prev => {
            const updated = prev.map(tech => ({
                ...tech,
                status: status,
                updatedAt: new Date().toISOString()
            }));
            saveToLocalStorage(updated);
            return updated;
        });
    }, []);

    // Добавление технологии
    const addTechnology = useCallback((techData) => {
        const newTech = {
            id: techData.id || Date.now(),
            ...techData,
            status: techData.status || 'not-started',
            resources: techData.resources || [],
            tags: techData.tags || [],
            notes: techData.notes || '',
            createdAt: techData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setTechnologies(prev => {
            // Проверяем, нет ли уже технологии с таким ID
            const exists = prev.find(tech => tech.id === newTech.id);
            if (exists) {
                console.log('Technology already exists:', newTech.id);
                return prev;
            }

            const updated = [...prev, newTech];
            saveToLocalStorage(updated);
            console.log('Technology added:', newTech);
            return updated;
        });

        return newTech;
    }, []);

    // Добавление нескольких технологий
    const addMultipleTechnologies = useCallback((techsArray) => {
        setTechnologies(prev => {
            // Фильтруем технологии, которых еще нет в списке
            const newTechs = techsArray.filter(newTech =>
                !prev.find(existingTech => existingTech.id === newTech.id)
            );

            if (newTechs.length === 0) {
                console.log('No new technologies to add');
                return prev;
            }

            const updated = [...prev, ...newTechs];
            saveToLocalStorage(updated);
            console.log(`Added ${newTechs.length} technologies:`, newTechs);
            return updated;
        });
    }, []);

    // Удаление технологии
    const deleteTechnology = useCallback((id) => {
        setTechnologies(prev => {
            const updated = prev.filter(tech => tech.id !== id);
            saveToLocalStorage(updated);
            return updated;
        });
    }, []);

    // Расчет прогресса
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const total = technologies.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Статистика
    const stats = {
        total: technologies.length,
        completed: technologies.filter(tech => tech.status === 'completed').length,
        inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
        notStarted: technologies.filter(tech => tech.status === 'not-started').length,
        gaming: technologies.filter(tech => tech.category === 'gaming').length
    };

    // Загружаем данные при монтировании
    useEffect(() => {
        checkApiStatus();
        fetchTechnologies();
    }, [fetchTechnologies, checkApiStatus]);

    return {
        technologies,
        loading,
        error,
        apiStatus,
        progress,
        stats,
        refetch: fetchTechnologies,
        updateStatus,
        updateNotes,
        updateAllStatuses,
        addTechnology,
        addMultipleTechnologies,
        deleteTechnology,
        checkApiStatus
    };
}

export default useTechnologiesWithApi;