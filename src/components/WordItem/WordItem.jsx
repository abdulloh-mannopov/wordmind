import { useState } from 'react';
import './WordItem.css';

function WordItem({ item, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="word-item" role="listitem">
      <div className="word-item__content">
        <div className="word-item__word">{item.word}</div>
        <div className="word-item__translation">{item.translation}</div>
        {item.example && <div className="word-item__example">{item.example}</div>}
        {item.imagination && (
          <div className="word-item__imagination-indicator" title={item.imagination}>
            🧠 Imagination added
          </div>
        )}
        {item.review && (
          <div className={`word-item__learning-status word-item__learning-status--${item.review.status}`}>
            {item.review.status === 'learned' ? '✓ ' : '● '}
            {item.review.status.charAt(0).toUpperCase() + item.review.status.slice(1)}
          </div>
        )}
      </div>

      {confirming ? (
        <div className="word-item__confirm">
          <span className="word-item__confirm-text">Delete?</span>
          <button
            className="word-item__confirm-btn word-item__confirm-btn--yes"
            onClick={() => onDelete(item.id)}
            aria-label={`Confirm delete ${item.word}`}
          >
            Delete
          </button>
          <button
            className="word-item__confirm-btn"
            onClick={() => setConfirming(false)}
            aria-label="Cancel delete"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="word-item__actions">
          <button
            className="word-item__action-btn"
            onClick={() => onEdit(item)}
            aria-label={`Edit ${item.word}`}
          >
            Edit
          </button>
          <button
            className="word-item__action-btn word-item__action-btn--delete"
            onClick={() => setConfirming(true)}
            aria-label={`Delete ${item.word}`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default WordItem;
