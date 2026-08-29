import { useMemo } from 'react';
import { useWords } from '../../context/WordsContext';
import { calculateStatistics, formatRelativeTime } from '../../utils/statisticsUtils';
import './Statistics.css';

function Statistics({ onNavigate }) {
  const { words } = useWords();

  // Compute stats safely
  const stats = useMemo(() => calculateStatistics(words), [words]);

  // Derived progress bar percentage
  const progressPercent = stats.totalWords > 0 
    ? Math.round((stats.learned / stats.totalWords) * 100) 
    : 0;

  // Empty state handling
  if (stats.totalWords === 0) {
    return (
      <section className="stats empty-stats">
        <div className="empty-stats__icon" aria-hidden="true">📊</div>
        <h2 className="empty-stats__title">No vocabulary yet</h2>
        <p className="empty-stats__text">
          Add words to start tracking your progress.
        </p>
        <button 
          className="empty-stats__btn" 
          onClick={() => onNavigate('vocabulary')}
        >
          Add Word
        </button>
      </section>
    );
  }

  return (
    <section className="stats">
      <div className="stats__header">
        <h1 className="stats__title">Statistics</h1>
        <p className="stats__subtitle">Your personal learning progress</p>
      </div>

      <div className="stats__grid">
        {/* Main metrics */}
        <div className="stats__card stats__card--main">
          <div className="stats__metric">
            <span className="stats__metric-label">Total Words</span>
            <span className="stats__metric-value">{stats.totalWords}</span>
          </div>
          <div className="stats__metric">
            <span className="stats__metric-label">Accuracy</span>
            <span className="stats__metric-value">{stats.accuracy}%</span>
          </div>
          <div className="stats__metric">
            <span className="stats__metric-label">Reviewed Today</span>
            <span className="stats__metric-value">{stats.reviewedTodayCount}</span>
          </div>
          <div className="stats__metric">
            <span className="stats__metric-label">Due for Review</span>
            <span className="stats__metric-value">{stats.dueCount}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="stats__card">
          <h2 className="stats__card-title">Learning Progress</h2>
          <div className="stats__progress-info">
            <span>Learned / Total</span>
            <span>{stats.learned} / {stats.totalWords} ({progressPercent}%)</span>
          </div>
          <div className="stats__progress-bar-bg">
            <div 
              className="stats__progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
              aria-label={`Learning progress ${progressPercent} percent`}
            ></div>
          </div>
        </div>

        {/* Learning Summary */}
        <div className="stats__card">
          <h2 className="stats__card-title">Your Learning</h2>
          <div className="stats__summary-list">
             <div className="stats__summary-item">
               <span>📚 Total Words</span>
               <span className="stats__summary-val">{stats.totalWords}</span>
             </div>
             <div className="stats__summary-item">
               <span className="stats__status--learned">✓ Learned</span>
               <span className="stats__summary-val">{stats.learned}</span>
             </div>
             <div className="stats__summary-item">
               <span className="stats__status--learning">● Learning</span>
               <span className="stats__summary-val">{stats.learning}</span>
             </div>
             <div className="stats__summary-item">
               <span className="stats__status--new">● New</span>
               <span className="stats__summary-val">{stats.newWords}</span>
             </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="stats__card">
          <h2 className="stats__card-title">Recent Activity</h2>
          {stats.recentActivity.length === 0 ? (
            <p className="stats__empty-text">No review activity yet.</p>
          ) : (
            <ul className="stats__activity-list">
              {stats.recentActivity.map(act => (
                <li key={act.id} className="stats__activity-item">
                  <span className="stats__activity-word">{act.word}</span>
                  <span className="stats__activity-time">{formatRelativeTime(act.timestamp)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </section>
  );
}

export default Statistics;
