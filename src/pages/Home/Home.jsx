import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Flashcard from '../../components/Flashcard/Flashcard';
import { useWords } from '../../context/WordsContext';
import { getLearningQueue, calculateNextReview, isDue } from '../../utils/reviewUtils';
import './Home.css';

function Home() {
  const { words, updateWord } = useWords();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewAllMode, setReviewAllMode] = useState(false);
  const cardRef = useRef(null);

  // Compute the learning queue
  const { due, notDue } = useMemo(() => getLearningQueue(words), [words]);

  // Which list to use
  const activeWords = reviewAllMode ? words : (due.length > 0 ? due : notDue);
  const total = activeWords.length;
  
  // Track reviewed today
  const reviewedTodayCount = useMemo(() => {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    return words.filter(w => w.review && w.review.lastReviewedAt >= todayStart).length;
  }, [words]);

  /* Clamp index if words were deleted while on Learn page */
  useEffect(() => {
    if (total > 0 && currentIndex >= total) {
      setCurrentIndex(total - 1);
    }
  }, [total, currentIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  /* Global keyboard shortcuts */
  useEffect(() => {
    if (total === 0) return;

    function handleKey(e) {
      if (e.target.tagName.toLowerCase() === 'textarea' || e.target.tagName.toLowerCase() === 'input') return;

      if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === ' ' && !e.target.closest('.flashcard-wrapper')) {
        // Only flip via global space if we aren't already focused on the card 
        // (to avoid double flipping when space is hit while card has focus)
        e.preventDefault();
        if (cardRef.current) {
          const wrapper = cardRef.current.querySelector('.flashcard-wrapper');
          if (wrapper) wrapper.click();
        }
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, total]);

  const handleStartReviewAll = () => {
    setReviewAllMode(true);
    setCurrentIndex(0);
  };

  /* Empty state */
  if (words.length === 0) {
    return (
      <section className="home">
        <div className="home__heading">
          <h1 className="home__title">WordMind</h1>
          <p className="home__subtitle">Personal Vocabulary Learning</p>
        </div>
        <div className="home__empty">
          <div className="home__empty-icon" aria-hidden="true">📚</div>
          <p className="home__empty-title">No words to learn</p>
          <p className="home__empty-text">
            Go to <strong>Vocabulary</strong> and add some words first.
          </p>
        </div>
      </section>
    );
  }

  /* Caught up state */
  if (due.length === 0 && !reviewAllMode) {
    return (
       <section className="home">
        <div className="home__heading">
          <h1 className="home__title">WordMind</h1>
          <p className="home__subtitle">Personal Vocabulary Learning</p>
        </div>
        <div className="home__empty">
          <div className="home__empty-icon" aria-hidden="true">🎉</div>
          <p className="home__empty-title">You're all caught up!</p>
          <p className="home__empty-text">
            You have reviewed all your due words.
          </p>
          <button className="home__review-all-btn" onClick={handleStartReviewAll}>
            Review All
          </button>
        </div>
      </section>
    );
  }

  const currentItem = activeWords[currentIndex];

  const handleSaveImagination = useCallback((newImagination) => {
    updateWord(currentItem.id, { ...currentItem, imagination: newImagination });
  }, [updateWord, currentItem]);

  const handleRate = useCallback((rating) => {
    if (!currentItem) return;
    const newReview = calculateNextReview(currentItem.review, rating);
    updateWord(currentItem.id, { ...currentItem, review: newReview });
    
    // Auto-advance
    if (currentIndex < total - 1) {
      setTimeout(() => {
        goNext();
      }, 300); // short delay for visual feedback
    }
  }, [currentItem, updateWord, currentIndex, total, goNext]);


  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    
    if (document.activeElement && (document.activeElement.tagName.toLowerCase() === 'textarea' || document.activeElement.tagName.toLowerCase() === 'input')) {
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goNext();
    } else if (isRightSwipe) {
      goPrev();
    }
  };

  return (
    <section className="home">
      <div className="home__heading home__session-header">
        <div>
          <h1 className="home__title">TODAY'S SESSION</h1>
          <p className="home__session-count">{due.length} words remaining</p>
        </div>
        <p className="home__subtitle">Personal Vocabulary Learning</p>
      </div>

      <div 
        className="home__card-area" 
        ref={cardRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
        {/* key forces re-mount on index change so flip resets */}
        <Flashcard 
          key={currentItem.id + '-' + currentIndex} // stable remount
          word={currentItem.word} 
          translation={currentItem.translation} 
          example={currentItem.example}
          imagination={currentItem.imagination}
          onSaveImagination={handleSaveImagination}
          onRate={handleRate}
        />
      </div>

      <div className="home__controls">
        <button
          className="home__nav-btn"
          onClick={goPrev}
          disabled={currentIndex === 0}
          aria-label="Previous card"
        >
          ← Previous
        </button>

        <div className="home__progress" aria-live="polite">
          <div className="home__progress-main">{currentIndex + 1} / {total}</div>
          <div className="home__progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(((currentIndex + 1) / Math.max(total, 1)) * 100)} aria-label={`Session progress ${currentIndex + 1} of ${total}`}>
            <div
              className="home__progress-fill"
              style={{ width: `${Math.round(((currentIndex + 1) / Math.max(total, 1)) * 100)}%` }}
            />
          </div>
          <div className="home__progress-sub">Today: {reviewedTodayCount} reviewed</div>
        </div>

        <button
          className="home__nav-btn home__nav-btn--next"
          onClick={goNext}
          disabled={currentIndex === total - 1}
          aria-label="Next card"
        >
          Next →
        </button>
      </div>

      <div className="home__kbd-hint" aria-hidden="true">
        <span><kbd>Space</kbd> Flip</span>
        <span><kbd>←</kbd> Previous</span>
        <span><kbd>→</kbd> Next</span>
        <span><kbd>1-4</kbd> Rate</span>
      </div>
    </section>
  );
}

export default Home;
