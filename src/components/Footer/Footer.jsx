import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__text">
          © {year} <span>WordMind</span>
        </p>
        <p className="footer__text">Personal Vocabulary Learning</p>
      </div>
    </footer>
  );
}

export default Footer;
