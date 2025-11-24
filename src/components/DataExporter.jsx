import { useState } from 'react';
import './DataExporter.css';

function DataExporter({ technologies }) {
  const [exportFormat, setExportFormat] = useState('json');
  const [includeUserData, setIncludeUserData] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Функция для экспорта данных
  const exportData = () => {
    setExporting(true);
    
    try {
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        totalTechnologies: technologies.length,
        technologies: includeUserData 
          ? technologies.map(tech => ({
              ...tech,
              userNotes: tech.notes || '',
              userStatus: tech.status || 'not-started',
              userProgress: tech.progress || 0
            }))
          : technologies.map(({ notes, status, progress, ...tech }) => tech)
      };

      let dataStr, fileType, fileName;

      if (exportFormat === 'json') {
        dataStr = JSON.stringify(exportData, null, 2);
        fileType = 'application/json';
        fileName = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      }

      // Создаем и скачиваем файл
      const blob = new Blob([dataStr], { type: fileType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setTimeout(() => {
        setExporting(false);
        alert('✅ Данные успешно экспортированы!');
      }, 500);

    } catch (error) {
      setExporting(false);
      alert('❌ Ошибка при экспорте данных');
      console.error('Export error:', error);
    }
  };

  // Валидация перед экспортом
  const canExport = technologies && technologies.length > 0;

  return (
    <div className="data-exporter">
      <h3>📤 Экспорт данных</h3>
      
      <div className="export-options">
        <div className="form-group">
          <label htmlFor="export-format">Формат экспорта</label>
          <select
            id="export-format"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="form-select"
          >
            <option value="json">JSON</option>
            <option value="csv" disabled>CSV (скоро)</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeUserData}
              onChange={(e) => setIncludeUserData(e.target.checked)}
            />
            <span className="checkmark"></span>
            Включить мои заметки и прогресс
          </label>
          <span className="help-text">
            При включении будут экспортированы ваши личные заметки и статусы изучения
          </span>
        </div>
      </div>

      {!canExport && (
        <div className="export-warning" role="alert">
          ⚠️ Нет данных для экспорта. Добавьте технологии в трекер.
        </div>
      )}

      <button
        onClick={exportData}
        disabled={!canExport || exporting}
        className="btn btn-primary export-btn"
        aria-describedby={canExport ? 'export-help' : 'export-warning'}
      >
        {exporting ? '📥 Экспорт...' : '📥 Экспортировать данные'}
      </button>

      <div id="export-help" className="help-text">
        Данные будут сохранены в выбранном формате на вашем устройстве
      </div>

      {canExport && (
        <div className="export-stats">
          <h4>📊 Статистика экспорта:</h4>
          <ul>
            <li>Всего технологий: <strong>{technologies.length}</strong></li>
            <li>В процессе: <strong>{technologies.filter(t => t.status === 'in-progress').length}</strong></li>
            <li>Завершено: <strong>{technologies.filter(t => t.status === 'completed').length}</strong></li>
            <li>Категории: <strong>{[...new Set(technologies.map(t => t.category))].length}</strong></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DataExporter;