import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import { useToast } from '@/components/Toast';

export default function FlashcardDeckDetailPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { id } = router.query;
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCards, setNewCards] = useState('');
  const [adding, setAdding] = useState(false);

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

  const handleAddCards = async (e) => {
    e.preventDefault();
    if (!newCards.trim()) return;
    setAdding(true);
    try {
      const lines = newCards.trim().split('\n');
      const cardsData = lines.map((line) => {
        const parts = line.split('|');
        return {
          front: (parts[0] || '').trim(),
          back: (parts[1] || '').trim(),
          part_of_speech: (parts[2] || '').trim(),
          example_sentence: (parts[3] || '').trim(),
        };
      }).filter(c => c.front && c.back);

      if (cardsData.length === 0) {
        addToast('Vui lòng nhập ít nhất 1 thẻ hợp lệ. Format: front | back | part_of_speech | example', 'warning');
        setAdding(false);
        return;
      }

      await api.addCardsToDeck(id, cardsData);
      setNewCards('');
      setShowAddModal(false);
      const deckData = await api.getFlashcardDeck(id);
      setDeck(deckData);
      setCards(deckData.cards || []);
    } catch (err) {
      addToast('Không thêm được thẻ: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Delete this card?')) return;
    try {
      await api.removeCardsFromDeck(id, [cardId]);
      setCards(cards.filter(c => c.id !== cardId));
    } catch (err) {
      addToast('Không xóa được thẻ', 'error');
    }
  };

  if (loading) return <LoadingIndicator message="Đang tải bộ thẻ..." />;

  return (
    <div className="min-h-screen" style={{ background: 'var(--gray-50)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 animate-fade-in">
          <Link href="/flashcard" className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--primary-600)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại Flashcard
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border animate-fade-in" style={{ background: 'var(--error-50)', borderColor: 'var(--error-100)' }}>
            <p style={{ color: 'var(--error-600)' }}>{error}</p>
          </div>
        )}

        {deck && (
          <>
            {/* Deck Header Card */}
            <div className="card p-6 mb-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--gray-900)' }}>
                    {deck.name}
                  </h1>
                  {deck.description && (
                    <p className="mt-2" style={{ color: 'var(--gray-600)' }}>{deck.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <span className="badge badge-gray">
                      🃏 {cards.length} thẻ
                    </span>
                    {deck.level_details && (
                      <span className="badge badge-primary">
                        📊 {deck.level_details.name}
                      </span>
                    )}
                    <span className="badge badge-gray">
                      {deck.is_public ? '🌐 Công khai' : '🔒 Riêng tư'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <Link
                    href={`/flashcard/study/${deck.id}`}
                    className="btn btn-success"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Học ngay
                  </Link>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm thẻ
                  </button>
                </div>
              </div>
            </div>

            {/* Cards List */}
            <div className="card animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="p-6 border-b" style={{ borderColor: 'var(--gray-100)' }}>
                <h2 className="text-lg font-bold" style={{ color: 'var(--gray-900)' }}>
                  Danh sách thẻ
                </h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--gray-500)' }}>
                  {cards.length} thẻ trong bộ
                </p>
              </div>

              {cards.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-5xl mb-4 opacity-60">📭</div>
                  <p className="font-medium" style={{ color: 'var(--gray-600)' }}>
                    Chưa có thẻ nào
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--gray-400)' }}>
                    Thêm thẻ để bắt đầu học!
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: 'var(--gray-100)' }}>
                  {cards.map((card, index) => (
                    <div key={card.id} className="p-4 flex items-center justify-between gap-4 group hover:bg-gray-50/60 transition-colors">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <span className="text-xs font-mono w-8 text-center flex-shrink-0" style={{ color: 'var(--gray-400)' }}>
                          #{index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold truncate" style={{ color: 'var(--gray-900)' }}>{card.front}</p>
                            <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gray-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <p className="font-medium truncate" style={{ color: 'var(--primary-600)' }}>{card.back}</p>
                          </div>
                          {card.example_sentence && (
                            <p className="text-sm mt-1 truncate italic" style={{ color: 'var(--gray-400)' }}>
                              &ldquo;{card.example_sentence}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {card.part_of_speech && (
                          <span className="badge badge-primary">{card.part_of_speech}</span>
                        )}
                        <span className="badge badge-gray">Lv.{card.difficulty}</span>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                          style={{ color: 'var(--error-500)' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Add Cards Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b" style={{ borderColor: 'var(--gray-100)' }}>
                <h2 className="text-xl font-bold" style={{ color: 'var(--gray-900)' }}>Thêm thẻ vào bộ</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>Nhập mỗi thẻ trên một dòng</p>
              </div>
              <form onSubmit={handleAddCards} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--gray-700)' }}>
                    Format: <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}>front | back | part_of_speech | example</code>
                  </label>
                  <textarea
                    value={newCards}
                    onChange={(e) => setNewCards(e.target.value)}
                    className="input font-mono text-sm"
                    rows={8}
                    placeholder={`hello | xin chào | interjection | Hello! How are you?`}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Hủy</button>
                  <button type="submit" disabled={adding} className="btn btn-primary">
                    {adding ? 'Đang thêm...' : 'Thêm thẻ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

FlashcardDeckDetailPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
