import { useState } from 'react';
import { Link } from 'react-router-dom';
import TechnologyCard from '../components/TechnologyCard';
import TechnologyNotes from '../components/TechnologyNotes';
import ProgressHeader from '../components/ProgressHeader';
import QuickActions from '../components/QuickActions';
import TechnologyFilter from '../components/TechnologyFilter';
import useTechnologies from '../hooks/useTechnologies';
import './Home.css';

function Home() {
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
        const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
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

    const recentTechnologies = technologies.slice(0, 3);

    return (
        <div className="home-page">
            <header className="home-header">
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

            {/* Быстрый доступ */}
            <div className="quick-access">
                <h2>Быстрый доступ</h2>
                <div className="access-buttons">
                    <Link to="/technologies" className="access-btn">
                        📚 Все технологии
                    </Link>
                    <Link to="/add-technology" className="access-btn">
                        ➕ Добавить технологию
                    </Link>
                    <Link to="/statistics" className="access-btn">
                        📊 Статистика
                    </Link>
                </div>
            </div>

            {/* Поиск и фильтры */}
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

            {/* Основной контент */}
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
                        <Link to="/add-technology" className="btn btn-primary">
                            Добавить первую технологию
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;