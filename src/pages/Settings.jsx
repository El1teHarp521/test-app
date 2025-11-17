import { useState } from 'react';
import './Settings.css';

function Settings() {
    const [settings, setSettings] = useState({
        theme: 'dark',
        language: 'ru',
        notifications: true,
        autoSave: true,
        steamIntegration: true
    });

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const exportData = () => {
        const data = {
            technologies: JSON.parse(localStorage.getItem('technologies') || '[]'),
            settings: settings,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('✅ Данные успешно экспортированы!');
    };

    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (data.technologies) {
                    localStorage.setItem('technologies', JSON.stringify(data.technologies));
                }

                if (data.settings) {
                    setSettings(data.settings);
                }

                alert('✅ Данные успешно импортированы! Перезагрузите страницу для применения изменений.');
            } catch (error) {
                alert('❌ Ошибка при импорте данных. Проверьте формат файла.');
            }
        };
        reader.readAsText(file);

        // Сбрасываем input
        event.target.value = '';
    };

    const clearAllData = () => {
        if (window.confirm('⚠️ Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
            localStorage.removeItem('technologies');
            alert('✅ Все данные удалены. Страница будет перезагружена.');
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    const resetSettings = () => {
        if (window.confirm('Сбросить все настройки к значениям по умолчанию?')) {
            setSettings({
                theme: 'dark',
                language: 'ru',
                notifications: true,
                autoSave: true,
                steamIntegration: true
            });
            alert('✅ Настройки сброшены!');
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>⚙️ Настройки</h1>
                <p>Управление приложением и данными</p>
            </div>

            <div className="settings-sections">
                {/* Основные настройки */}
                <section className="settings-section">
                    <h2>📋 Основные настройки</h2>

                    <div className="setting-group">
                        <label>Тема оформления</label>
                        <select
                            value={settings.theme}
                            onChange={(e) => handleSettingChange('theme', e.target.value)}
                        >
                            <option value="dark">Тёмная</option>
                            <option value="light">Светлая</option>
                            <option value="auto">Системная</option>
                        </select>
                    </div>

                    <div className="setting-group">
                        <label>Язык</label>
                        <select
                            value={settings.language}
                            onChange={(e) => handleSettingChange('language', e.target.value)}
                        >
                            <option value="ru">Русский</option>
                            <option value="en">English</option>
                        </select>
                    </div>

                    <div className="setting-group">
                        <label className="checkbox-label">
                            Уведомления
                            <input
                                type="checkbox"
                                checked={settings.notifications}
                                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>

                    <div className="setting-group">
                        <label className="checkbox-label">
                            Автосохранение
                            <input
                                type="checkbox"
                                checked={settings.autoSave}
                                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>

                    <div className="setting-group">
                        <label className="checkbox-label">
                            Интеграция с Steam
                            <input
                                type="checkbox"
                                checked={settings.steamIntegration}
                                onChange={(e) => handleSettingChange('steamIntegration', e.target.checked)}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                </section>

                {/* Управление данными */}
                <section className="settings-section">
                    <h2>💾 Управление данными</h2>

                    <div className="data-actions">
                        <button onClick={exportData} className="btn btn-primary">
                            📤 Экспорт данных
                        </button>

                        <label className="file-input-label btn btn-secondary">
                            📥 Импорт данных
                            <input
                                type="file"
                                accept=".json"
                                onChange={importData}
                                className="file-input"
                            />
                        </label>

                        <button onClick={resetSettings} className="btn btn-warning">
                            🔄 Сбросить настройки
                        </button>

                        <button onClick={clearAllData} className="btn btn-danger">
                            🗑️ Очистить все данные
                        </button>
                    </div>
                </section>

                {/* Информация о приложении */}
                <section className="settings-section">
                    <h2>ℹ️ О приложении</h2>

                    <div className="app-info">
                        <div className="info-item">
                            <strong>Версия:</strong>
                            <span>1.0.0</span>
                        </div>
                        <div className="info-item">
                            <strong>Разработчик:</strong>
                            <span>Tech Tracker Team</span>
                        </div>
                        <div className="info-item">
                            <strong>Последнее обновление:</strong>
                            <span>{new Date().toLocaleDateString('ru-RU')}</span>
                        </div>
                        <div className="info-item">
                            <strong>Технологии:</strong>
                            <span>React, LocalStorage, Steam API</span>
                        </div>
                    </div>

                    <div className="support-links">
                        <h3>🔗 Полезные ссылки</h3>
                        <div className="links">
                            <a href="/" className="support-link">
                                📚 Документация
                            </a>
                            <a href="/" className="support-link">
                                🐛 Сообщить об ошибке
                            </a>
                            <a href="/" className="support-link">
                                💡 Предложить идею
                            </a>
                        </div>
                    </div>
                </section>

                {/* Статистика хранилища */}
                <section className="settings-section">
                    <h2>📊 Статистика хранилища</h2>

                    <div className="app-info">
                        <div className="info-item">
                            <strong>Технологий сохранено:</strong>
                            <span>{JSON.parse(localStorage.getItem('technologies') || '[]').length}</span>
                        </div>
                        <div className="info-item">
                            <strong>Размер данных:</strong>
                            <span>{Math.round((localStorage.getItem('technologies') || '').length / 1024 * 100) / 100} KB</span>
                        </div>
                        <div className="info-item">
                            <strong>Последнее изменение:</strong>
                            <span>{new Date().toLocaleString('ru-RU')}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Settings;