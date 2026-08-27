import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import mockWords from '../data/mockWords';
import { getDefaultReviewData } from '../utils/reviewUtils';

const STORAGE_KEY = 'wordmind_words_v1';
const WordsContext = createContext(null);

function loadWords() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.map(w => ({
          ...w,
          review: w.review || getDefaultReviewData()
        }));
      }
    }
  } catch (err) {
    console.error('Failed to parse words from localStorage:', err);
  }

  // Fallback to mock initial data
  return mockWords.map((w) => ({
    id: generateId(),
    word: w.word,
    translation: w.translation,
    example: '',
    imagination: '',
    review: getDefaultReviewData(),
  }));
}

function saveWords(words) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch (err) {
    console.error('Failed to save words to localStorage:', err);
  }
}

function generateId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Provides shared vocabulary state to the entire app with localStorage persistence.
 */
export function WordsProvider({ children }) {
  const [words, setWords] = useState(loadWords);

  // Persist to localStorage whenever words state changes
  useEffect(() => {
    saveWords(words);
  }, [words]);

  const addWord = useCallback((entry) => {
    setWords((prev) => [
      ...prev,
      {
        id: generateId(),
        word: entry.word.trim(),
        translation: entry.translation.trim(),
        example: (entry.example || '').trim(),
        imagination: '',
        review: getDefaultReviewData(),
      },
    ]);
  }, []);

  const updateWord = useCallback((id, entry) => {
    setWords((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              word: entry.word.trim(),
              translation: entry.translation.trim(),
              example: (entry.example || '').trim(),
              imagination: entry.imagination !== undefined ? entry.imagination : w.imagination,
              review: entry.review !== undefined ? entry.review : w.review,
            }
          : w,
      ),
    );
  }, []);

  const deleteWord = useCallback((id) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
  }, []);

  return (
    <WordsContext.Provider value={{ words, addWord, updateWord, deleteWord }}>
      {children}
    </WordsContext.Provider>
  );
}

export function useWords() {
  const ctx = useContext(WordsContext);
  if (!ctx) {
    throw new Error('useWords must be used within a WordsProvider');
  }
  return ctx;
}
