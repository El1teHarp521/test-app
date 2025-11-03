import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyFilter from './components/TechnologyFilter';

function App() {
  const [technologies, setTechnologies] = useState([
    {
      id: 1,
      title: 'React Components',
      description: 'Изучение базовых компонентов',
      status: 'not-started'
    },
    {
      id: 2,
      title: 'JSX Syntax',
      description: 'Освоение синтаксиса JSX',
      status: 'not-started'
    },
    {
      id: 3,
      title: 'State Management',
      description: 'Работа с состоянием компонентов',
      status: 'not-started'
    },
    {
      id: 4,
      title: 'HTTP & APIs',
      description: 'Научиться получать данные из API',
      status: 'not-started'
    },
    {
      id: 5,
      title: 'React Hooks',
      description: 'Изучение встроенных хуков React',
      status: 'not-started'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  const handleStatusChange = (id, newStatus) => {
    setTechnologies(prevTech =>
      prevTech.map(tech =>
        tech.id === id ? { ...tech, status: newStatus } : tech
      )
    );
  };

  const handleUpdateAllStatuses = (status) => {
    setTechnologies(prevTech =>
      prevTech.map(tech => ({ ...tech, status }))
    );
  };

  const handleRandomSelect = (id) => {
    handleStatusChange(id, 'in-progress');
  };

  const filteredTechnologies = technologies.filter(tech => {
    if (activeFilter === 'all') return true;
    return tech.status === activeFilter;
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Мой Трекер Изучения Технологий</h1>
        <p>Отслеживай свой прогресс в освоении новых технологий</p>
      </header>

      <ProgressHeader technologies={technologies} />
      <QuickActions
        technologies={technologies}
        onUpdateAllStatuses={handleUpdateAllStatuses}
        onRandomSelect={handleRandomSelect}
      />
      <TechnologyFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <main className="main-content">
        {filteredTechnologies.map(tech => (
          <TechnologyCard
            key={tech.id}
            id={tech.id}
            title={tech.title}
            description={tech.description}
            status={tech.status}
            onStatusChange={handleStatusChange}
          />
        ))}

        {filteredTechnologies.length === 0 && (
          <div className="no-results">
            <p>🚫 Нет технологий, соответствующих выбранному фильтру</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;