import { useState } from 'react';
import { WordsProvider } from './context/WordsContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import Vocabulary from './pages/Vocabulary/Vocabulary';
import Statistics from './pages/Statistics/Statistics';

function App() {
  const [page, setPage] = useState('learn');

  return (
    <WordsProvider>
      <MainLayout currentPage={page} onNavigate={setPage}>
        {page === 'learn' && <Home />}
        {page === 'vocabulary' && <Vocabulary />}
        {page === 'statistics' && <Statistics onNavigate={setPage} />}
      </MainLayout>
    </WordsProvider>
  );
}

export default App;
