import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './TechnologyDetail.css';

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const [technology, setTechnology] = useState(null);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologies = JSON.parse(saved);
            const tech = technologies.find(t => t.id === parseInt(techId));
            setTechnology(tech);
            if (tech && tech.notes) {
                setNotes(tech.notes);
            }
        }
    }, [techId]);

    const updateStatus = (newStatus) => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologies = JSON.parse(saved);
            const updated = technologies.map(tech =>
                tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
            );
            localStorage.setItem('technologies', JSON.stringify(updated));
            setTechnology({ ...technology, status: newStatus });
        }
    };

    const saveNotes = () => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologies = JSON.parse(saved);
            const updated = technologies.map(tech =>
                tech.id === parseInt(techId) ? { ...tech, notes } : tech
            );
            localStorage.setItem('technologies', JSON.stringify(updated));
            setTechnology({ ...technology, notes });
            alert('Заметки сохранены!');
        }
    };

    const deleteTechnology = () => {
        if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
            const saved = localStorage.getItem('technologies');
            if (saved) {
                const technologies = JSON.parse(saved);
                const updated = technologies.filter(tech => tech.id !== parseInt(techId));
                localStorage.setItem('technologies', JSON.stringify(updated));
                navigate('/technologies');
            }
        }
    };

    if (!technology) {
        return (
            <div className="page">
                <h1>Технология не найдена</h1>
                <p>Технология с ID {techId} не существует.</p>
                <Link to="/technologies" className="btn">
                    ← Назад к списку
                </Link>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/technologies" className="back-link">
                    ← Назад к списку
                </Link>
                <div className="header-actions">
                    <h1>{technology.title}</h1>
                    <button onClick={deleteTechnology} className="btn btn-danger">
                        Удалить
                    </button>
                </div>
            </div>

            <div className="technology-detail">
                <div className="detail-section">
                    <h3>Описание</h3>
                    <p>{technology.description}</p>
                </div>

                <div className="detail-section">
                    <h3>Статус изучения</h3>
                    <div className="status-buttons">
                        <button
                            onClick={() => updateStatus('not-started')}
                            className={`status-btn ${technology.status === 'not-started' ? 'active not-started' : ''}`}
                        >
                            ⏳ Не начато
                        </button>
                        <button
                            onClick={() => updateStatus('in-progress')}
                            className={`status-btn ${technology.status === 'in-progress' ? 'active in-progress' : ''}`}
                        >
                            🔄 В процессе
                        </button>
                        <button
                            onClick={() => updateStatus('completed')}
                            className={`status-btn ${technology.status === 'completed' ? 'active completed' : ''}`}
                        >
                            ✅ Завершено
                        </button>
                    </div>
                    <div className="current-status">
                        Текущий статус: <strong className={`status-${technology.status}`}>
                            {technology.status === 'completed' && '✅ Завершено'}
                            {technology.status === 'in-progress' && '🔄 В процессе'}
                            {technology.status === 'not-started' && '⏳ Не начато'}
                        </strong>
                    </div>
                </div>

                <div className="detail-section">
                    <h3>Мои заметки</h3>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Добавьте свои заметки по изучению этой технологии..."
                        rows="6"
                    />
                    <button onClick={saveNotes} className="btn btn-primary">
                        Сохранить заметки
                    </button>
                </div>

                <div className="detail-section">
                    <h3>Информация</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <strong>ID:</strong>
                            <span>{technology.id}</span>
                        </div>
                        <div className="info-item">
                            <strong>Дата создания:</strong>
                            <span>{new Date(technology.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="info-item">
                            <strong>Последнее обновление:</strong>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TechnologyDetail;