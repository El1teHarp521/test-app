import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation({ apiStatus }) {
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

  const navItems = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/technologies', label: 'Все технологии', icon: '📚' },
    { path: '/statistics', label: 'Статистика', icon: '📊' },
    { path: '/add-technology', label: 'Добавить технологию', icon: '➕' },
    { path: '/steam-import', label: 'Импорт из Steam', icon: '🎮' },
    { path: '/settings', label: 'Настройки', icon: '⚙️' }
  ];

  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <Link to="/">
          <h2>🚀 Трекер технологий</h2>
        </Link>
      </div>

      <div className="nav-content">
        <ul className="nav-menu">
          {navItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
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