import { useState, useMemo, useCallback, useEffect } from 'react';
import { useWords } from '../../context/WordsContext';
import WordForm from '../../components/WordForm/WordForm';
import WordItem from '../../components/WordItem/WordItem';
import './Vocabulary.css';

function Vocabulary() {
  const { words, addWord, updateWord, deleteWord } = useWords();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState('');

  /* Filtered word list */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return words;
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q),
    );
  }, [words, search]);

  /* Toast auto-dismiss */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  function showToast(msg) {
    setToast(msg);
  }

  /* Handlers */
  const handleAdd = useCallback(() => {
    setEditingItem(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setFormOpen(true);
  }, []);

  const handleSave = useCallback(
    (data) => {
      if (editingItem) {
        updateWord(editingItem.id, data);
        showToast('Word updated');
      } else {
        addWord(data);
        showToast('Word added');
      }
      setFormOpen(false);
      setEditingItem(null);
    },
    [editingItem, addWord, updateWord],
  );

  const handleDelete = useCallback(
    (id) => {
      deleteWord(id);
      showToast('Word deleted');
    },
    [deleteWord],
  );

  const handleCancel = useCallback(() => {
    setFormOpen(false);
    setEditingItem(null);
  }, []);

  /* Empty state — no words at all */
  if (words.length === 0) {
    return (
      <section className="vocab">
        <div className="vocab__empty">
          <div className="vocab__empty-icon" aria-hidden="true">📖</div>
          <h1 className="vocab__empty-title">No words yet</h1>
          <p className="vocab__empty-text">
            Add your first word to start learning.
          </p>
          <button className="vocab__add-btn" onClick={handleAdd}>
            + Add Word
          </button>
        </div>

        {formOpen && (
          <WordForm onSave={handleSave} onCancel={handleCancel} />
        )}
      </section>
    );
  }

  return (
    <section className="vocab">
      {/* Top bar */}
      <div className="vocab__top">
        <h1 className="vocab__title">
          Vocabulary
          <span className="vocab__count">{words.length} word{words.length !== 1 ? 's' : ''}</span>
        </h1>
        <button className="vocab__add-btn" onClick={handleAdd}>
          + Add Word
        </button>
      </div>

      {/* Search */}
      <div className="vocab__search">
        <span className="vocab__search-icon" aria-hidden="true">🔍</span>
        <input
          className="vocab__search-input"
          type="text"
          placeholder="Search words…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search vocabulary"
        />
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="vocab__list" role="list">
          {filtered.map((item) => (
            <WordItem
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="vocab__no-results">No words found.</p>
      )}

      {/* Form modal */}
      {formOpen && (
        <WordForm
          initialData={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Toast */}
      {toast && <div className="vocab__toast" role="status">{toast}</div>}
    </section>
  );
}

export default Vocabulary;
