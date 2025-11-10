import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyFilter from './components/TechnologyFilter';
import TechnologyNotes from './components/TechnologyNotes';
import useTechnologies from './hooks/useTechnologies';

function App() {
  const {
    technologies,
    updateStatus,
    updateNotes,
    updateAllStatuses,
    progress,
    stats
  } = useTechnologies();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация технологий по статусу и поисковому запросу
  const filteredTechnologies = technologies.filter(tech => {
    // Фильтр по статусу
    const statusMatch = activeFilter === 'all' || tech.status === activeFilter;

    // Фильтр по поисковому запросу
    const searchMatch = searchQuery === '' ||
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tech.notes && tech.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return statusMatch && searchMatch;
  });

  const handleMarkAllCompleted = () => {
    updateAllStatuses('completed');
  };

  const handleResetAll = () => {
    updateAllStatuses('not-started');
  };

  const handleRandomSelect = (techId) => {
    updateStatus(techId, 'in-progress');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Мой Трекер Изучения Технологий</h1>
        <p>Отслеживай свой прогресс в освоении новых технологий</p>
      </header>

      <ProgressHeader
        technologies={technologies}
        progress={progress}
        stats={stats}
      />

      <QuickActions
        technologies={technologies}
        onMarkAllCompleted={handleMarkAllCompleted}
        onResetAll={handleResetAll}
        onRandomSelect={handleRandomSelect}
      />

      {/* Компонент поиска */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Поиск по названию, описанию или заметкам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-results">Найдено: {filteredTechnologies.length}</span>
      </div>

      <TechnologyFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <main className="main-content">
        {filteredTechnologies.map(tech => (
          <div key={tech.id} className="technology-with-notes">
            <TechnologyCard
              id={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
              onStatusChange={updateStatus}
            />
            <TechnologyNotes
              notes={tech.notes}
              onNotesChange={updateNotes}
              techId={tech.id}
            />
          </div>
        ))}

        {filteredTechnologies.length === 0 && (
          <div className="no-results">
            <p>🚫 Нет технологий, соответствующих выбранному фильтру или поисковому запросу</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;