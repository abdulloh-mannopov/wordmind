const MINUTE_IN_MS = 60 * 1000;
const DAY_IN_MS = 24 * 60 * MINUTE_IN_MS;

// Review intervals in milliseconds
export const REVIEW_INTERVALS = {
  again: 10 * MINUTE_IN_MS, // 10 minutes
  hard: 1 * DAY_IN_MS,      // 1 day
  good: 3 * DAY_IN_MS,      // 3 days
  easy: 7 * DAY_IN_MS       // 7 days
};

export function getDefaultReviewData() {
  return {
    status: 'new',
    reviewCount: 0,
    correctCount: 0,
    lastReviewedAt: null,
    nextReviewAt: null
  };
}

export function isDue(word) {
  if (!word.review) return true; // Safety check
  if (word.review.status === 'new') return true;
  if (!word.review.nextReviewAt) return true;
  return word.review.nextReviewAt <= Date.now();
}

/**
 * Calculates the next review state based on the rating.
 * Rating can be: 'again', 'hard', 'good', 'easy'
 */
export function calculateNextReview(currentReview, rating) {
  const now = Date.now();
  const nextInterval = REVIEW_INTERVALS[rating];
  
  let newStatus = currentReview.status;
  if (rating === 'again' || rating === 'hard') {
    newStatus = 'learning';
  } else if (rating === 'good' || rating === 'easy') {
    newStatus = 'learned';
  }

  const isCorrect = rating === 'good' || rating === 'easy';

  return {
    ...currentReview,
    status: newStatus,
    reviewCount: currentReview.reviewCount + 1,
    correctCount: currentReview.correctCount + (isCorrect ? 1 : 0),
    lastReviewedAt: now,
    nextReviewAt: now + nextInterval
  };
}

/**
 * Sorts vocabulary for the learning session.
 * Due/New cards first, then future cards (though ideally future cards are hidden unless requested).
 */
export function getLearningQueue(words) {
  const due = [];
  const notDue = [];

  words.forEach(word => {
    if (isDue(word)) {
      due.push(word);
    } else {
      notDue.push(word);
    }
  });

  // Simple sorting: put 'new' and 'learning' cards before 'learned' if they are due.
  // We can just sort by nextReviewAt (nulls first, then oldest first).
  due.sort((a, b) => {
    const timeA = a.review?.nextReviewAt || 0;
    const timeB = b.review?.nextReviewAt || 0;
    return timeA - timeB;
  });

  return { due, notDue };
}
