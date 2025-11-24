import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import SteamLibraryImporter from './components/SteamLibraryImporter';
import TechnologySearch from './components/TechnologySearch';
import useTechnologiesWithApi from './hooks/useTechnologiesWithApi';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyFilter from './components/TechnologyFilter';
import TechnologyCard from './components/TechnologyCard';
import TechnologyNotes from './components/TechnologyNotes';

function App() {
  const {
    technologies,
    loading,
    error,
    apiStatus,
    progress,
    stats,
    refetch,
    updateStatus,
    updateNotes,
    updateAllStatuses,
    addTechnology,
    addMultipleTechnologies
  } = useTechnologiesWithApi();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSteamImporter, setShowSteamImporter] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    const results = technologies.filter(tech =>
      tech.title.toLowerCase().includes(query.toLowerCase()) ||
      tech.description.toLowerCase().includes(query.toLowerCase()) ||
      (tech.tags && tech.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) ||
      tech.category.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  const filteredTechnologies = searchResults || technologies.filter(tech => {
    const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
    const searchMatch = searchQuery === '' ||
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handleMarkAllCompleted = () => {
    updateAllStatuses('completed');
  };

  const handleResetAll = () => {
    updateAllStatuses('not-started');
  };

  const handleImportFromSteam = () => {
    setShowSteamImporter(!showSteamImporter);
  };

  const handleGamesImported = (importedGames) => {
    if (addMultipleTechnologies) {
      addMultipleTechnologies(importedGames);
    } else {
      importedGames.forEach(game => {
        addTechnology(game);
      });
    }

    setTimeout(() => {
      setShowSteamImporter(false);
      refetch();
    }, 1000);
  };

  const HomePage = () => (
    <div className="App">
      <header className="page-header">
        <h1>🚀 Мой Трекер Изучения Технологий</h1>
        <p>Отслеживай свой прогресс в освоении новых технологий и игр</p>
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
        onImportFromSteam={handleImportFromSteam}
        onStatusUpdate={updateStatus}
      />

      {showSteamImporter && (
        <SteamLibraryImporter
          onGamesImported={handleGamesImported}
          existingTechnologies={technologies}
        />
      )}

      <div className="search-box">
        <TechnologySearch
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Поиск по названию, описанию, тегам..."
        />

        <TechnologyFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {loading && (
        <div className="text-center mt-4">
          <div className="spinner"></div>
          <p className="mt-2">Загрузка технологий...</p>
        </div>
      )}

      {error && (
        <div className="error-state text-center mt-4">
          <p>⚠️ {error}</p>
          <button onClick={refetch} className="btn btn-primary mt-2">
            Попробовать снова
          </button>
        </div>
      )}

      <main className="main-content">
        {!loading && !error && filteredTechnologies.map(tech => (
          <div key={tech.id} className="technology-with-notes fade-in">
            <TechnologyCard
              id={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
              onStatusChange={updateStatus}
              category={tech.category}
              difficulty={tech.difficulty}
              tags={tech.tags}
              estimatedHours={tech.estimatedHours}
              resources={tech.resources}
              steamData={tech.steamData}
            />
            <TechnologyNotes
              notes={tech.notes}
              onNotesChange={updateNotes}
              techId={tech.id}
            />
          </div>
        ))}

        {!loading && !error && filteredTechnologies.length === 0 && (
          <div className="no-results">
            <p>🚫 Нет технологий, соответствующих выбранному фильтру или поисковому запросу</p>
            <button onClick={handleClearSearch} className="btn btn-secondary mt-2">
              Очистить поиск
            </button>
          </div>
        )}
      </main>
    </div>
  );

  return (
    <Router>
      <div className="app-container">
        <Navigation apiStatus={apiStatus} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/technologies" element={<TechnologyList technologies={technologies} />} />
          <Route path="/technology/:techId" element={<TechnologyDetail />} />
          <Route path="/add-technology" element={<AddTechnology onTechnologyAdded={addTechnology} />} />
          <Route path="/statistics" element={<Statistics technologies={technologies} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/steam-import" element={
            <div className="page">
              <div className="page-header">
                <h1>🎮 Импорт из Steam</h1>
                <p>Импортируйте ваши игры из Steam библиотеки</p>
              </div>
              <SteamLibraryImporter
                onGamesImported={handleGamesImported}
                existingTechnologies={technologies}
              />
            </div>
          } />
          <Route path="*" element={
            <div className="page">
              <div className="error-page text-center">
                <h1>404 - Страница не найдена</h1>
                <p>Запрошенная страница не существует.</p>
                <a href="/" className="btn btn-primary mt-3">Вернуться на главную</a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;