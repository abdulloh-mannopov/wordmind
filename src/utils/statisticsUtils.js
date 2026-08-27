/**
 * Safely calculate all statistics from the vocabulary array.
 * Never returns NaN or Infinity. Returns safe defaults.
 */
export function calculateStatistics(words) {
  if (!Array.isArray(words)) return getEmptyStats();
  
  const totalWords = words.length;
  if (totalWords === 0) return getEmptyStats();

  let learned = 0;
  let learning = 0;
  let newWords = 0;
  let totalReviews = 0;
  let totalCorrect = 0;
  let reviewedTodayCount = 0;
  let dueCount = 0;

  const now = Date.now();
  const todayStart = new Date().setHours(0, 0, 0, 0);

  const recentActivity = [];

  for (const word of words) {
    // Safely get review object
    const r = word.review || {};
    const status = r.status || 'new';

    // Status counts
    if (status === 'learned') learned++;
    else if (status === 'learning') learning++;
    else newWords++;

    // Accuracy base
    totalReviews += (r.reviewCount || 0);
    totalCorrect += (r.correctCount || 0);

    // Reviewed today
    if (r.lastReviewedAt && r.lastReviewedAt >= todayStart) {
      reviewedTodayCount++;
    }

    // Due calculation
    if (status === 'new' || !r.nextReviewAt || r.nextReviewAt <= now) {
      dueCount++;
    }

    // Activity log prep
    if (r.lastReviewedAt) {
      recentActivity.push({
        id: word.id,
        word: word.word,
        timestamp: r.lastReviewedAt
      });
    }
  }

  // Calculate Accuracy
  let accuracy = 0;
  if (totalReviews > 0) {
    accuracy = Math.round((totalCorrect / totalReviews) * 100);
  }

  // Sort and slice recent activity
  recentActivity.sort((a, b) => b.timestamp - a.timestamp);
  const latestActivity = recentActivity.slice(0, 5);

  return {
    totalWords,
    learned,
    learning,
    newWords,
    accuracy,
    reviewedTodayCount,
    dueCount,
    recentActivity: latestActivity
  };
}

function getEmptyStats() {
  return {
    totalWords: 0,
    learned: 0,
    learning: 0,
    newWords: 0,
    accuracy: 0,
    reviewedTodayCount: 0,
    dueCount: 0,
    recentActivity: []
  };
}

/**
 * Format relative time for activity log safely.
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Unknown';
  
  const now = new Date();
  const then = new Date(timestamp);
  
  // Strip time for pure day difference
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thatDay = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  
  const diffTime = Math.abs(today - thatDay);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Reviewed today';
  if (diffDays === 1) return 'Reviewed yesterday';
  return `Reviewed ${diffDays} days ago`;
}
