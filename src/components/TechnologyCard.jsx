import './TechnologyCard.css';

function TechnologyCard({
    id,
    title,
    description,
    status,
    onStatusChange
}) {

    const handleClick = () => {
        const statusOrder = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        const nextStatus = statusOrder[nextIndex];

        onStatusChange(id, nextStatus);
    };

    const getStatusClass = () => {
        switch (status) {
            case 'completed':
                return 'status-completed';
            case 'in-progress':
                return 'status-in-progress';
            case 'not-started':
                return 'status-not-started';
            default:
                return '';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'completed':
                return '✅';
            case 'in-progress':
                return '🔄';
            case 'not-started':
                return '⏳';
            default:
                return '';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'completed':
                return 'Завершено';
            case 'in-progress':
                return 'В процессе';
            case 'not-started':
                return 'Не начато';
            default:
                return status;
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