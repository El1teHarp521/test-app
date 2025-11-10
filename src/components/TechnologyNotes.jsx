import './TechnologyNotes.css';

function TechnologyNotes({ notes, onNotesChange, techId }) {
  // Обрабатываем случай, когда notes может быть undefined
  const safeNotes = notes || '';

  const handleNotesChange = (e) => {
    // Проверяем, что функция существует перед вызовом
    if (typeof onNotesChange === 'function') {
      onNotesChange(techId, e.target.value);
    } else {
      console.warn('onNotesChange is not a function');
    }
  };

  return (
    <div className="notes-section">
      <h4>Мои заметки:</h4>
      <textarea
        value={safeNotes}
        onChange={handleNotesChange}
        placeholder="Записывайте сюда важные моменты, ссылки, идеи..."
        rows="3"
        className="notes-textarea"
      />
      <div className="notes-hint">
        {safeNotes.length > 0 ?
          `Заметка сохранена (${safeNotes.length} символов)` :
          'Добавьте заметку - она сохранится автоматически'
        }
      </div>
    </div>
  );
}

export default TechnologyNotes;