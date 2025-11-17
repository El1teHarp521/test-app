import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation({ apiStatus = 'checking' }) {
  const location = useLocation();

  const getApiStatusIcon = () => {
    switch (apiStatus) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      case 'loading': return '🟡';
      case 'checking': return '⚪';
      default: return '⚪';
    }
  };

  const getApiStatusText = () => {
    switch (apiStatus) {
      case 'online': return 'API онлайн';
      case 'offline': return 'API оффлайн';
      case 'loading': return 'Загрузка...';
      case 'checking': return 'Проверка...';
      default: return 'Проверка...';
    }
  };

  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <Link to="/">
          <h2>🚀 Трекер технологий</h2>
        </Link>
      </div>

      <div className="nav-content">
        <ul className="nav-menu">
          <li>
            <Link
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
            >
              Главная
            </Link>
          </li>
          <li>
            <Link
              to="/technologies"
              className={location.pathname === '/technologies' ? 'active' : ''}
            >
              Все технологии
            </Link>
          </li>
          <li>
            <Link
              to="/statistics"
              className={location.pathname === '/statistics' ? 'active' : ''}
            >
              Статистика
            </Link>
          </li>
          <li>
            <Link
              to="/add-technology"
              className={location.pathname === '/add-technology' ? 'active' : ''}
            >
              Добавить технологию
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={location.pathname === '/settings' ? 'active' : ''}
            >
              ⚙️ Настройки
            </Link>
          </li>
        </ul>

        <div
          className="api-status-indicator"
          data-status={apiStatus}
        >
          <span className="api-status-icon">{getApiStatusIcon()}</span>
          <span className="api-status-text">{getApiStatusText()}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;