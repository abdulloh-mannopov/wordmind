import { useState, useEffect, useRef } from 'react';
import './WordForm.css';

function WordForm({ initialData, onSave, onCancel }) {
  const [word, setWord] = useState(initialData?.word || '');
  const [translation, setTranslation] = useState(initialData?.translation || '');
  const [example, setExample] = useState(initialData?.example || '');
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    // remember opener to return focus on close
    openerRef.current = document.activeElement;
    firstInputRef.current?.focus();
    return () => {
      try { openerRef.current?.focus(); } catch (err) {}
    };
  }, []);

  /* Close on Escape */
  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();

    function esc(e) {
      if (e.key === 'Escape') onCancel();
    }

    // simple focus trap: keep focus inside dialog
    function trap(e) {
      if (!dialogRef.current) return;
      if (!dialogRef.current.contains(document.activeElement)) {
        firstInputRef.current && firstInputRef.current.focus();
      }
    }

    window.addEventListener('keydown', esc);
    window.addEventListener('focusin', trap);
    return () => {
      window.removeEventListener('keydown', esc);
      window.removeEventListener('focusin', trap);
    };
  }, [onCancel]);

  function validate() {
    const next = {};
    if (!word.trim()) next.word = 'English word is required.';
    if (!translation.trim()) next.translation = 'Translation is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSave({ word: word.trim(), translation: translation.trim(), example: example.trim() });
  }

  /* Close when clicking overlay backdrop */
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onCancel();
  }

  return (
    <div className="word-form-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="wordform-title" ref={dialogRef}>
      <form className="word-form" onSubmit={handleSubmit} noValidate>
        <h2 id="wordform-title">{isEdit ? 'Edit Word' : 'Add New Word'}</h2>

        <div className="word-form__field">
          <label className="word-form__label" htmlFor="wf-word">English Word</label>
          <input
            id="wf-word"
            ref={firstInputRef}
            className="word-form__input"
            type="text"
            placeholder="e.g. Courage"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          {errors.word && <span className="word-form__error">{errors.word}</span>}
        </div>

        <div className="word-form__field">
          <label className="word-form__label" htmlFor="wf-translation">Uzbek Translation</label>
          <input
            id="wf-translation"
            className="word-form__input"
            type="text"
            placeholder="e.g. Jasorat"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
          />
          {errors.translation && <span className="word-form__error">{errors.translation}</span>}
        </div>

        <div className="word-form__field">
          <label className="word-form__label" htmlFor="wf-example">Example Sentence <span style={{ color: 'var(--color-text-muted)' }}>(optional)</span></label>
          <textarea
            id="wf-example"
            className="word-form__textarea"
            placeholder="e.g. She showed great courage."
            value={example}
            onChange={(e) => setExample(e.target.value)}
          />
        </div>

        <div className="word-form__actions">
          <button type="button" className="word-form__btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="word-form__btn word-form__btn--primary">
            {isEdit ? 'Save Changes' : 'Save Word'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WordForm;
