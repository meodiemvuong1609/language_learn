import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';

export default function VocabularyReviewPage() {
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState({ total: 0, correct: 0, incorrect: 0 });

  useEffect(() => {
    setLoading(true);
    api.getDueVocabulary()
      .then((res) => {
        const rows = Array.isArray(res) ? res : (res.results || []);
        const words = rows.map((r) => r.vocabulary || r).filter((w) => w && w.word);
        if (words.length) {
          setCards(words);
        } else {
          return api.getVocabularies({ page_size: 20 }).then((v) => setCards(v.results || []));
        }
      })
      .catch(() => api.getVocabularies({ page_size: 20 }).then((v) => setCards(v.results || [])).catch(() => {}))
      .finally(() => setLoading(false));
  }, []);

  const handleFlip = () => setFlipped(!flipped);

  const handleNext = async (correct) => {
    try {
      if (cards[current]?.id) {
        await api.reviewWord(cards[current].id, correct);
      }
    } catch (e) {
      console.error(e);
    }
    setStats((prev) => ({
      ...prev,
      total: prev.total + 1,
      ...(correct ? { correct: prev.correct + 1 } : { incorrect: prev.incorrect + 1 }),
    }));
    setFlipped(false);
    if (current + 1 < cards.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Đang tải thẻ từ vựng...</div>;

  if (finished) {
    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-6xl mb-4">🎉</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Hoàn thành!</h2>
          <p className="text-xl mb-2">Tổng: {stats.total} thẻ</p>
          <p className="text-lg text-green-600 mb-2">Đúng: {stats.correct}</p>
          <p className="text-lg text-red-600 mb-2">Sai: {stats.incorrect}</p>
          <p className="text-lg text-gray-700 mb-8">Tỷ lệ: {pct}%</p>
          <button
            onClick={() => { setCurrent(0); setFinished(false); setStats({ total: 0, correct: 0, incorrect: 0 }); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Làm lại
          </button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) return <div className="text-center py-20 text-gray-500">Chưa có từ vựng để ôn</div>;

  const card = cards[current];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">📚 Ôn tập từ vựng</h1>
          <span className="text-gray-500">{current + 1} / {cards.length}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${((current) / cards.length) * 100}%` }} />
        </div>

        {/* Flashcard */}
        <div
          onClick={handleFlip}
          className="bg-white rounded-xl shadow-lg p-8 min-h-[280px] flex flex-col items-center justify-center cursor-pointer mb-8"
        >
          {!flipped ? (
            <>
              <p className="text-3xl font-bold text-gray-900 mb-4">{card.word}</p>
              {card.phonetic && <p className="text-gray-500 italic mb-2">{card.phonetic}</p>}
              {card.part_of_speech && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{card.part_of_speech}</span>}
              <p className="text-gray-400 mt-6 text-sm">👆 Click để xem đáp án</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-900 mb-4">{card.meaning}</p>
              {card.example_sentence && (
                <p className="text-gray-600 italic text-center">{card.example_sentence}</p>
              )}
              <p className="text-gray-400 mt-6 text-sm">👆 Click để xem từ</p>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => handleNext(false)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium"
          >
            ❌ Chưa nhớ
          </button>
          <button
            onClick={() => handleNext(true)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
          >
            ✅ Đã nhớ
          </button>
        </div>
      </div>
    </div>
  );
}

VocabularyReviewPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
