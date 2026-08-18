import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import { useToast } from '@/components/Toast';

export default function FlashcardStudyPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { id } = router.query;
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyMode, setStudyMode] = useState('learn');
  const [reviewing, setReviewing] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    const fetchDeck = async () => {
      setLoading(true);
      setError(null);
      try {
        const deckData = await api.getFlashcardDeck(id);
        setDeck(deckData);
        setCards(deckData.cards || []);
      } catch (err) {
        setError(err.message || 'Failed to load deck');
      } finally {
        setLoading(false);
      }
    };
    fetchDeck();
  }, [id]);

  const initProgress = useCallback(async () => {
    try {
      await api.bulkCreateProgress(id);
    } catch {
      // Progress may already exist
    }
  }, [id]);

  const startStudy = useCallback(async () => {
    await initProgress();
    setStudyMode('learn');
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    setReviewedCount(0);
    setCorrectCount(0);
    setStarted(true);
  }, [initProgress]);

  const startReview = useCallback(async () => {
    await initProgress();
    try {
      const dueData = await api.getDueFlashcards();
      const dueCards = (dueData.results || []).map(p => p.flashcard_details);
      if (dueCards.length === 0) {
        addToast('Không có thẻ nào cần ôn! Hãy học thêm thẻ mới.', 'info');
        return;
      }
      setCards(dueCards);
      setStudyMode('review');
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionComplete(false);
      setReviewedCount(0);
      setCorrectCount(0);
      setStarted(true);
    } catch (err) {
      addToast('Không tải được thẻ đến hạn: ' + (err.message || 'Unknown error'), 'error');
    }
  }, [initProgress, addToast]);

  const handleFlip = () => {
    if (cardRef.current) {
      cardRef.current.classList.toggle('flipped');
    }
    setIsFlipped(!isFlipped);
  };

  const handleReview = async (isCorrect) => {
    if (currentIndex >= cards.length) return;
    setReviewing(true);
    try {
      const progressData = await api.getFlashcardProgress();
      const progressList = progressData.results || [];
      const cardProgress = progressList.find(p => p.flashcard === cards[currentIndex].id);

      if (cardProgress) {
        await api.reviewFlashcard(cardProgress.id, isCorrect);
      }

      setReviewedCount(prev => prev + 1);
      if (isCorrect) setCorrectCount(prev => prev + 1);

      if (currentIndex + 1 >= cards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      }
    } catch (err) {
      console.error('Review failed:', err);
    } finally {
      setReviewing(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= cards.length) {
      setSessionComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  if (loading) return <LoadingIndicator message="Đang tải thẻ..." />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gray-50)' }}>
        <div className="text-center p-8">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-lg font-medium" style={{ color: 'var(--gray-900)' }}>{error}</p>
          <Link href="/flashcard" className="btn btn-primary mt-4 inline-flex">Quay lại</Link>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    const accuracy = reviewedCount > 0 ? Math.round((correctCount / reviewedCount) * 100) : 0;
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gray-50)' }}>
        <div className="text-center p-8 animate-bounce-in max-w-md">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--gray-900)' }}>Hoàn thành!</h1>
          <p className="mb-2" style={{ color: 'var(--gray-600)' }}>
            Bạn đã {studyMode === 'review' ? 'ôn' : 'học'} {reviewedCount} thẻ
          </p>
          {studyMode === 'review' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: accuracy >= 70 ? 'var(--success-100)' : 'var(--accent-100)' }}>
              <span className="text-2xl font-bold" style={{ color: accuracy >= 70 ? 'var(--success-600)' : 'var(--accent-600)' }}>
                {accuracy}%
              </span>
              <span className="text-sm" style={{ color: 'var(--gray-600)' }}>độ chính xác</span>
            </div>
          )}
          <div className="flex justify-center gap-3">
            <button onClick={startStudy} className="btn btn-primary">
              📖 Học lại
            </button>
            <Link href={`/flashcard/deck/${id}`} className="btn btn-secondary">
              ← Quay lại
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gray-50)' }}>
        <div className="text-center p-8 animate-fade-in-up max-w-md">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--gray-900)' }}>
            {deck?.name || 'Bộ thẻ'}
          </h1>
          <p className="mb-8" style={{ color: 'var(--gray-500)' }}>
            {cards.length} thẻ sẵn sàng. Chọn chế độ học của bạn!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={startStudy} className="btn btn-primary btn-lg">
              📖 Học tất cả
            </button>
            <button onClick={startReview} className="btn btn-lg" style={{ background: '#f97316', color: 'white' }}>
              🔄 Ôn thẻ cần nhắc
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gray-50)' }}>
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--gray-900)' }}>Chưa có thẻ nào</h2>
          <p className="mb-6" style={{ color: 'var(--gray-500)' }}>Hãy thêm thẻ vào bộ thẻ trước khi học</p>
          <Link href={`/flashcard/deck/${id}`} className="btn btn-primary">Thêm thẻ</Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: 'var(--gray-50)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <Link href={`/flashcard/deck/${id}`} className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--primary-600)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {deck?.name || 'Bộ thẻ'}
          </Link>
          <div className="flex items-center gap-3">
            <span className="badge badge-primary">
              {currentIndex + 1} / {cards.length}
            </span>
            {studyMode === 'review' && (
              <span className="badge badge-warning">Ôn tập</span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full mb-8" style={{ background: 'var(--gray-200)' }}>
          <div
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, background: 'var(--stamp)' }}
          />
        </div>

        {/* Flashcard with 3D flip */}
        <div className="flip-card-container mx-auto" style={{ maxWidth: '600px', height: '320px' }}>
          <div
            ref={cardRef}
            className="flip-card cursor-pointer"
            onClick={handleFlip}
          >
            {/* Front */}
            <div className="flip-card-front card p-8 flex-col text-center" style={{ boxShadow: 'var(--shadow-xl)' }}>
              <span className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--gray-400)' }}>
                {isFlipped ? 'Đáp án' : 'Câu hỏi'}
              </span>
              <p className="text-2xl font-bold leading-relaxed" style={{ color: isFlipped ? 'var(--success-600)' : 'var(--gray-900)' }}>
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
              {!isFlipped && (
                <p className="text-xs mt-6" style={{ color: 'var(--gray-400)' }}>
                  Click để lật thẻ
                </p>
              )}
              {isFlipped && currentCard.example_sentence && (
                <div className="mt-6 p-4 rounded-xl w-full" style={{ background: 'var(--gray-50)' }}>
                  <p className="text-sm italic" style={{ color: 'var(--gray-600)' }}>
                    &ldquo;{currentCard.example_sentence}&rdquo;
                  </p>
                </div>
              )}
              {isFlipped && currentCard.part_of_speech && (
                <span className="badge badge-primary mt-4">{currentCard.part_of_speech}</span>
              )}
            </div>

            {/* Back */}
            <div className="flip-card-back card p-8 flex-col text-center" style={{ boxShadow: 'var(--shadow-xl)', background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)' }}>
              <span className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--success-500)' }}>
                Đáp án
              </span>
              <p className="text-2xl font-bold leading-relaxed" style={{ color: 'var(--success-700)' }}>
                {currentCard.back}
              </p>
              {currentCard.example_sentence && (
                <div className="mt-6 p-4 rounded-xl w-full" style={{ background: 'rgba(255,255,255,0.6)' }}>
                  <p className="text-sm italic" style={{ color: 'var(--gray-600)' }}>
                    &ldquo;{currentCard.example_sentence}&rdquo;
                  </p>
                </div>
              )}
              {currentCard.part_of_speech && (
                <span className="badge badge-success mt-4">{currentCard.part_of_speech}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isFlipped && (
          <div className="flex justify-center gap-4 mt-8 animate-fade-in">
            {studyMode === 'review' ? (
              <>
                <button
                  onClick={() => handleReview(false)}
                  disabled={reviewing}
                  className="btn btn-lg flex-1 max-w-[200px]"
                  style={{ background: '#f43f5e', color: 'white' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Sai
                </button>
                <button
                  onClick={() => handleReview(true)}
                  disabled={reviewing}
                  className="btn btn-success btn-lg flex-1 max-w-[200px]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Đúng
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="btn btn-primary btn-lg px-12"
              >
                {currentIndex + 1 >= cards.length ? 'Hoàn thành ✓' : 'Thẻ tiếp theo →'}
              </button>
            )}
          </div>
        )}

        {/* Keyboard hint */}
        {!isFlipped && started && (
          <p className="text-center text-xs mt-6" style={{ color: 'var(--gray-400)' }}>
            Nhấn Space hoặc click vào thẻ để lật
          </p>
        )}
      </div>
    </div>
  );
}

FlashcardStudyPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
