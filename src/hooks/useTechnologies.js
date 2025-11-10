import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
  {
    id: 1,
    title: 'React Components',
    description: 'Изучение базовых компонентов',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 2,
    title: 'Node.js Basics',
    description: 'Основы серверного JavaScript',
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  {
    id: 3,
    title: 'State Management',
    description: 'Работа с состоянием компонентов',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 4,
    title: 'HTTP & APIs',
    description: 'Научиться получать данные из API',
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  {
    id: 5,
    title: 'React Hooks',
    description: 'Изучение встроенных хуков React',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

  // Функция для обновления статуса технологии
  const updateStatus = useCallback((techId, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  }, [setTechnologies]);

  // Функция для обновления заметок
  const updateNotes = useCallback((techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  }, [setTechnologies]);

  // Функция для массового обновления статусов
  const updateAllStatuses = useCallback((status) => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status }))
    );
  }, [setTechnologies]);

  // Функция для расчета общего прогресса
  const calculateProgress = useCallback(() => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  }, [technologies]);

  // Функция для получения статистики
  const getStats = useCallback(() => {
    const total = technologies.length;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;

    return { total, completed, inProgress, notStarted };
  }, [technologies]);

  return {
    technologies,
    updateStatus,
    updateNotes,
    updateAllStatuses,
    progress: calculateProgress(),
    stats: getStats()
  };
}

export default useTechnologies;