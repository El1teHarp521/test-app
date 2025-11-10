import './TechnologyCard.css';

function TechnologyCard({
    id,
    title,
    description,
    status,
    onStatusChange
}) {

    const handleClick = () => {
        // Проверяем, что функция существует перед вызовом
        if (typeof onStatusChange === 'function') {
            const statusOrder = ['not-started', 'in-progress', 'completed'];
            const safeStatus = status || 'not-started';
            const currentIndex = statusOrder.indexOf(safeStatus);
            const nextIndex = (currentIndex + 1) % statusOrder.length;
            const nextStatus = statusOrder[nextIndex];

            onStatusChange(id, nextStatus);
        } else {
            console.warn('onStatusChange is not a function');
        }
    };

    const getStatusClass = () => {
        const safeStatus = status || 'not-started';
        switch (safeStatus) {
            case 'completed':
                return 'status-completed';
            case 'in-progress':
                return 'status-in-progress';
            case 'not-started':
                return 'status-not-started';
            default:
                return 'status-not-started';
        }
    };

    const getStatusIcon = () => {
        const safeStatus = status || 'not-started';
        switch (safeStatus) {
            case 'completed':
                return '✅';
            case 'in-progress':
                return '🔄';
            case 'not-started':
                return '⏳';
            default:
                return '⏳';
        }
    };

    const getStatusText = () => {
        const safeStatus = status || 'not-started';
        switch (safeStatus) {
            case 'completed':
                return 'Завершено';
            case 'in-progress':
                return 'В процессе';
            case 'not-started':
                return 'Не начато';
            default:
                return 'Не начато';
        }
    };

    return (
        <div
            className={`technology-card ${getStatusClass()}`}
            onClick={handleClick}
            title="Кликните для изменения статуса"
        >
            <div className="card-header">
                <h3>{title}</h3>
                <span className="status-icon">{getStatusIcon()}</span>
            </div>
            <p>{description}</p>
            <div className="status-badge">
                Статус: <strong>{getStatusText()}</strong>
            </div>
        </div>
    );
}

export default TechnologyCard;