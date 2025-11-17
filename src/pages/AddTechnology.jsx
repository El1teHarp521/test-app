import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTechnology.css';

function AddTechnology() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'not-started',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Пожалуйста, введите название технологии');
            return;
        }

        const newTechnology = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };

        const saved = localStorage.getItem('technologies');
        const technologies = saved ? JSON.parse(saved) : [];
        const updated = [...technologies, newTechnology];

        localStorage.setItem('technologies', JSON.stringify(updated));

        alert('Технология успешно добавлена!');
        navigate('/technologies');
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Добавить новую технологию</h1>
                <p>Заполните информацию о технологии, которую хотите изучить</p>
            </div>

            <form onSubmit={handleSubmit} className="technology-form">
                <div className="form-group">
                    <label htmlFor="title">Название технологии *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Например: React, JavaScript, Node.js..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Описание</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Опишите, что вы планируете изучить..."
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status">Начальный статус</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="not-started">⏳ Не начато</option>
                        <option value="in-progress">🔄 В процессе</option>
                        <option value="completed">✅ Завершено</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Заметки</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Добавьте дополнительные заметки..."
                        rows="3"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Добавить технологию
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/technologies')}
                        className="btn btn-secondary"
                    >
                        Все технологии
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddTechnology;