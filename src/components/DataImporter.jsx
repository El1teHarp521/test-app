import { useState } from 'react';
import './DataImporter.css';

function DataImporter({ onImport }) {
  const [importError, setImportError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);

  // Валидация импортируемых данных
  const validateImportData = (data) => {
    if (!data.technologies || !Array.isArray(data.technologies)) {
      throw new Error('Неверный формат файла: отсутствует массив technologies');
    }

    if (data.technologies.length === 0) {
      throw new Error('Файл не содержит данных о технологиях');
    }

    data.technologies.forEach((tech, index) => {
      if (!tech.title || typeof tech.title !== 'string') {
        throw new Error(`Технология #${index + 1}: отсутствует название`);
      }

      if (!tech.description || typeof tech.description !== 'string') {
        throw new Error(`Технология "${tech.title}": отсутствует описание`);
      }

      if (tech.title.length > 50) {
        throw new Error(`Технология "${tech.title}": название слишком длинное (макс. 50 символов)`);
      }

      if (tech.description.length > 500) {
        throw new Error(`Технология "${tech.title}": описание слишком длинное (макс. 500 символов)`);
      }
    });

    return true;
  };

  // Обработка загруженного файла
  const handleFileUpload = (file) => {
    setImportError('');
    setImporting(true);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        const importedData = JSON.parse(fileContent);
        
        validateImportData(importedData);
        
        // Преобразуем данные к нашему формату
        const formattedTechnologies = importedData.technologies.map(tech => ({
          id: tech.id || `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: tech.title,
          description: tech.description,
          category: tech.category || 'other',
          difficulty: tech.difficulty || 'beginner',
          status: tech.userStatus || tech.status || 'not-started',
          notes: tech.userNotes || tech.notes || '',
          resources: tech.resources || [],
          tags: tech.tags || [],
          estimatedHours: tech.estimatedHours || 0,
          prerequisites: tech.prerequisites || [],
          createdAt: tech.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          source: 'import'
        }));

        onImport(formattedTechnologies);
        setImporting(false);
        
        setTimeout(() => {
          alert(`✅ Успешно импортировано ${formattedTechnologies.length} технологий!`);
        }, 500);

      } catch (error) {
        setImportError(`Ошибка импорта: ${error.message}`);
        setImporting(false);
      }
    };

    reader.onerror = () => {
      setImportError('Ошибка чтения файла');
      setImporting(false);
    };

    reader.readAsText(file);
  };

  // Обработчик выбора файла
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        handleFileUpload(file);
      } else {
        setImportError('Поддерживаются только JSON файлы');
      }
    }
  };

  // Обработчики drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="data-importer">
      <h3>📥 Импорт данных</h3>

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${importError ? 'error' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-zone-content">
          {importing ? (
            <div className="importing-state">
              <div className="spinner"></div>
              <p>Импорт данных...</p>
            </div>
          ) : (
            <>
              <p>📁 Перетащите JSON файл сюда или</p>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                id="file-input"
                className="file-input"
                disabled={importing}
              />
              <label htmlFor="file-input" className="btn btn-secondary">
                Выберите файл
              </label>
            </>
          )}
        </div>
      </div>

      {importError && (
        <div className="import-error" role="alert">
          ❌ {importError}
        </div>
      )}

      <div className="import-help">
        <h4>📋 Требования к файлу:</h4>
        <ul>
          <li>Формат: JSON</li>
          <li>Обязательные поля: title, description</li>
          <li>Максимальная длина названия: 50 символов</li>
          <li>Максимальная длина описания: 500 символов</li>
          <li>Поддерживаются пользовательские заметки и статусы</li>
        </ul>
        
        <details>
          <summary>Пример структуры файла</summary>
          <pre className="example-structure">
{`{
  "technologies": [
    {
      "title": "React",
      "description": "Библиотека для UI",
      "category": "frontend",
      "difficulty": "beginner",
      "userStatus": "in-progress",
      "userNotes": "Изучаю хуки"
    }
  ]
}`}
          </pre>
        </details>
      </div>
    </div>
  );
}

export default DataImporter;