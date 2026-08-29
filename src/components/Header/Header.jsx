import './Header.css';

function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__logo">
          <div className="header__logo-icon" aria-hidden="true">W</div>
          <span className="header__logo-text">WordMind</span>
        </div>

        <nav className="header__nav" aria-label="Main navigation">
          <button
            className={`header__nav-link${currentPage === 'learn' ? ' header__nav-link--active' : ''}`}
            onClick={() => onNavigate('learn')}
            aria-current={currentPage === 'learn' ? 'page' : undefined}
          >
            Learn
          </button>
          <button
            className={`header__nav-link${currentPage === 'vocabulary' ? ' header__nav-link--active' : ''}`}
            onClick={() => onNavigate('vocabulary')}
            aria-current={currentPage === 'vocabulary' ? 'page' : undefined}
          >
            Vocabulary
          </button>
          <button
            className={`header__nav-link${currentPage === 'statistics' ? ' header__nav-link--active' : ''}`}
            onClick={() => onNavigate('statistics')}
            aria-current={currentPage === 'statistics' ? 'page' : undefined}
          >
            Statistics
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
