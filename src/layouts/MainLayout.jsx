import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './MainLayout.css';

function MainLayout({ currentPage, onNavigate, children }) {
  return (
    <>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <main className="layout__main">
        <div className="container">{children}</div>
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
