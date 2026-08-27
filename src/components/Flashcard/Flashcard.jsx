import { useState, useCallback, useEffect } from 'react';
import './Flashcard.css';

function Flashcard({ word, translation, example, imagination, onSaveImagination, onRate }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Imagination state
  const [isEditingImagination, setIsEditingImagination] = useState(false);
  const [imaginationText, setImaginationText] = useState(imagination || '');
  const [imaginationError, setImaginationError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync prop changes
  useEffect(() => {
    setImaginationText(imagination || '');
    setIsEditingImagination(false);
    // When word changes, flip back to front
    setIsFlipped(false);
  }, [word, imagination]);

  const handleFlip = useCallback((e) => {
    // Prevent flip if clicking inside interactive sections
    if (e.target.closest('.flashcard__interactive')) {
      return;
    }
    setIsFlipped((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      // Don't intercept if user is typing
      if (e.target.tagName.toLowerCase() === 'textarea' || e.target.tagName.toLowerCase() === 'input') return;

      if (e.target.closest('.flashcard__interactive') && (e.key === 'Enter' || e.key === ' ')) {
         // allow buttons inside to work naturally
         return;
      }
      
      // Flip on Space/Enter
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
        return;
      }

      // Rating shortcuts ONLY if flipped
      if (isFlipped && onRate) {
        if (e.key === '1') { e.preventDefault(); onRate('again'); }
        else if (e.key === '2') { e.preventDefault(); onRate('hard'); }
        else if (e.key === '3') { e.preventDefault(); onRate('good'); }
        else if (e.key === '4') { e.preventDefault(); onRate('easy'); }
      }
    },
    [isFlipped, onRate]
  );

  const handleSaveImagination = (e) => {
    e.stopPropagation();
    const trimmed = imaginationText.trim();
    if (!trimmed) {
      setImaginationError('Write something first.');
      return;
    }
    setImaginationError('');
    onSaveImagination(trimmed);
    setIsEditingImagination(false);
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleCancelImagination = (e) => {
    e.stopPropagation();
    setImaginationText(imagination || '');
    setImaginationError('');
    setIsEditingImagination(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditingImagination(true);
  };

  const handleRate = (e, rating) => {
    e.stopPropagation();
    if (onRate) onRate(rating);
  };

  return (
    <div
      className="flashcard-wrapper"
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={
        isFlipped
          ? `${word} — ${translation}. Click to show front.`
          : `${word}. Click to reveal translation.`
      }
    >
      <div className={`flashcard__inner${isFlipped ? ' flashcard__inner--flipped' : ''}`}>
        {/* Front */}
        <div className="flashcard__face flashcard__front" aria-hidden={isFlipped}>
          <span className="flashcard__word">{word}</span>
          <span className="flashcard__hint">Click to reveal</span>
        </div>

        {/* Back */}
        <div className="flashcard__face flashcard__back" aria-hidden={!isFlipped}>
          <div className="flashcard__back-content">
            <div className="flashcard__main-info">
              <span className="flashcard__word">{word}</span>
              <span className="flashcard__translation">{translation}</span>
              {example && <span className="flashcard__example">{example}</span>}
            </div>

            <div className="flashcard__imagination">
              <div className="flashcard__imagination-header">
                <span className="flashcard__imagination-title">🧠 My Imagination</span>
                {imagination && !isEditingImagination && (
                  <button 
                    className="flashcard__imagination-edit flashcard__interactive"
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                )}
                {saveSuccess && <span className="flashcard__imagination-success">Saved!</span>}
              </div>

              {(!imagination || isEditingImagination) ? (
                <div className="flashcard__imagination-form flashcard__interactive" onClick={e => e.stopPropagation()}>
                  <textarea
                    className="flashcard__imagination-input"
                    placeholder="How do you imagine this word?"
                    value={imaginationText}
                    onChange={(e) => {
                      setImaginationText(e.target.value);
                      if (imaginationError) setImaginationError('');
                    }}
                    onKeyDown={e => e.stopPropagation()}
                  />
                  {imaginationError && <span className="flashcard__imagination-error">{imaginationError}</span>}
                  <div className="flashcard__imagination-actions">
                    {imagination && (
                      <button className="flashcard__imagination-btn" onClick={handleCancelImagination}>Cancel</button>
                    )}
                    <button className="flashcard__imagination-btn flashcard__imagination-btn--save" onClick={handleSaveImagination}>
                      Save Imagination
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flashcard__imagination-text">
                  {imagination}
                </div>
              )}
            </div>

            {/* Rating Buttons */}
            <div className="flashcard__rating-section flashcard__interactive" onClick={e => e.stopPropagation()}>
              <p className="flashcard__rating-title">How well did you know this?</p>
              <div className="flashcard__rating-buttons">
                <button className="flashcard__rating-btn flashcard__rating-btn--again" onClick={(e) => handleRate(e, 'again')}>
                  <span className="flashcard__rating-icon">❌</span>
                  <span className="flashcard__rating-label">Again</span>
                </button>
                <button className="flashcard__rating-btn flashcard__rating-btn--hard" onClick={(e) => handleRate(e, 'hard')}>
                  <span className="flashcard__rating-icon">😐</span>
                  <span className="flashcard__rating-label">Hard</span>
                </button>
                <button className="flashcard__rating-btn flashcard__rating-btn--good" onClick={(e) => handleRate(e, 'good')}>
                  <span className="flashcard__rating-icon">✅</span>
                  <span className="flashcard__rating-label">Good</span>
                </button>
                <button className="flashcard__rating-btn flashcard__rating-btn--easy" onClick={(e) => handleRate(e, 'easy')}>
                  <span className="flashcard__rating-icon">🟢</span>
                  <span className="flashcard__rating-label">Easy</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
