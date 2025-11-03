import './QuickActions.css';

function QuickActions({ technologies, onUpdateAllStatuses, onRandomSelect }) {

    const markAllCompleted = () => {
        onUpdateAllStatuses('completed');
    };

    const resetAll = () => {
        onUpdateAllStatuses('not-started');
    };

    const getRandomInProgressTech = () => {
        const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
        if (notStartedTech.length === 0) {
            alert('Все технологии уже начаты или завершены!');
            return;
        }
        const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
        onRandomSelect(randomTech.id);
    };

    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="actions-grid">
                <button
                    className="action-btn complete-all"
                    onClick={markAllCompleted}
                >
                    ✅ Отметить все как выполненные
                </button>

                <button
                    className="action-btn reset-all"
                    onClick={resetAll}
                >
                    🔄 Сбросить все статусы
                </button>

                <button
                    className="action-btn random-select"
                    onClick={getRandomInProgressTech}
                >
                    🎲 Случайный выбор технологии
                </button>
            </div>
        </div>
    );
}

export default QuickActions;