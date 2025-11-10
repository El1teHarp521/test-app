import { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

function QuickActions({
    onMarkAllCompleted,
    onResetAll,
    onRandomSelect,
    technologies
}) {
    const [showExportModal, setShowExportModal] = useState(false);
    const [showRandomModal, setShowRandomModal] = useState(false);
    const [randomTech, setRandomTech] = useState(null);

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies: technologies,
            stats: {
                total: technologies.length,
                completed: technologies.filter(t => t.status === 'completed').length,
                inProgress: technologies.filter(t => t.status === 'in-progress').length,
                notStarted: technologies.filter(t => t.status === 'not-started').length
            }
        };
        const dataStr = JSON.stringify(data, null, 2);

        // Создаем blob и ссылку для скачивания
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setShowExportModal(true);
    };

    const handleRandomSelect = () => {
        const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
        if (notStartedTech.length === 0) {
            alert('Все технологии уже начаты или завершены!');
            return;
        }
        const random = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
        setRandomTech(random);
        setShowRandomModal(true);
    };

    const handleStartRandomTech = () => {
        if (randomTech) {
            onRandomSelect(randomTech.id);
        }
        setShowRandomModal(false);
        setRandomTech(null);
    };

    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="actions-grid">
                <button
                    onClick={onMarkAllCompleted}
                    className="action-btn complete-all"
                >
                    ✅ Отметить все как выполненные
                </button>

                <button
                    onClick={onResetAll}
                    className="action-btn reset-all"
                >
                    🔄 Сбросить все статусы
                </button>

                <button
                    onClick={handleRandomSelect}
                    className="action-btn random-select"
                >
                    🎲 Случайный выбор технологии
                </button>

                <button
                    onClick={handleExport}
                    className="action-btn export-btn"
                >
                    📤 Экспорт данных
                </button>
            </div>

            {/* Модальное окно экспорта */}
            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Экспорт данных"
                size="small"
            >
                <div className="export-modal-content">
                    <p>✅ Данные успешно экспортированы!</p>
                    <p>Файл был скачан автоматически.</p>
                    <button
                        onClick={() => setShowExportModal(false)}
                        className="modal-confirm-btn"
                    >
                        Закрыть
                    </button>
                </div>
            </Modal>

            {/* Модальное окно случайного выбора */}
            <Modal
                isOpen={showRandomModal}
                onClose={() => setShowRandomModal(false)}
                title="Случайный выбор технологии"
                size="small"
            >
                {randomTech && (
                    <div className="random-tech-modal">
                        <h4>Выбрана технология:</h4>
                        <div className="random-tech-info">
                            <strong>{randomTech.title}</strong>
                            <p>{randomTech.description}</p>
                        </div>
                        <div className="modal-actions">
                            <button
                                onClick={handleStartRandomTech}
                                className="modal-confirm-btn"
                            >
                                Начать изучение
                            </button>
                            <button
                                onClick={() => setShowRandomModal(false)}
                                className="modal-cancel-btn"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default QuickActions;