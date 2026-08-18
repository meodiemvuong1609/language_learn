import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import { useToast } from '@/components/Toast';
import StatCard from '@/components/ui/StatCard';

export default function FlashcardPage() {
  const { addToast } = useToast();
  const [decks, setDecks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeck, setNewDeck] = useState({ name: '', description: '', is_public: false });
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [decksData, statsData] = await Promise.all([
        api.getMyFlashcardDecks(),
        api.getFlashcardProgressStats(),
      ]);
      setDecks(decksData.results || []);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load flashcard decks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeck.name.trim()) return;
    setCreating(true);
    try {
      await api.createFlashcardDeck(newDeck);
      setNewDeck({ name: '', description: '', is_public: false });
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      addToast('Không tạo được bộ thẻ: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteDeck = async (id) => {
    if (!confirm('Are you sure you want to delete this deck?')) return;
    try {
      await api.deleteFlashcardDeck(id);
      fetchData();
    } catch (err) {
      addToast('Không xóa được bộ thẻ', 'error');
    }
  };

  if (loading) return <LoadingIndicator message="Đang tải bộ thẻ..." />;

  return (
    <div className="min-h-screen" style={{ background: 'var(--gray-50)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--gray-900)' }}>
              Flashcard
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--gray-500)' }}>
              Học từ vựng hiệu quả với hệ thống flashcard thông minh
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo bộ thẻ mới
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border animate-fade-in" style={{ background: 'var(--error-50)', borderColor: 'var(--error-100)' }}>
            <p style={{ color: 'var(--error-600)' }}>{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
            <ColoredStat title="Tổng thẻ" value={stats.total_cards || 0} icon="cards" color="primary" />
            <ColoredStat title="Đã thuộc" value={stats.mastered || 0} icon="star" color="success" />
            <ColoredStat title="Đang học" value={stats.learning || 0} icon="book" color="warning" />
            <ColoredStat title="Cần ôn" value={stats.due_for_review || 0} icon="arrows-clockwise" color="accent" />
          </div>
        )}

        {/* Quick Study Banner */}
        {stats && stats.due_for_review > 0 && (
          <div className="mb-8 animate-fade-in-up">
            <Link
              href="/flashcard/study"
              className="block rounded-2xl p-6 text-white relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">Ôn tập ngay</h3>
                  <p className="text-white/80 text-sm">
                    Bạn có <strong>{stats.due_for_review} thẻ</strong> cần ôn hôm nay
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Deck List */}
        <div className="card animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="p-6 border-b" style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="text-lg font-bold" style={{ color: 'var(--gray-900)' }}>
              Bộ thẻ của bạn
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--gray-500)' }}>
              {decks.length} bộ thẻ
            </p>
          </div>

          {decks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4 opacity-60">📭</div>
              <p className="font-medium" style={{ color: 'var(--gray-600)' }}>
                Chưa có bộ thẻ nào
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--gray-400)' }}>
                Tạo bộ thẻ đầu tiên để bắt đầu học!
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--gray-100)' }}>
              {decks.map((deck, idx) => (
                <div
                  key={deck.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors group animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <Link href={`/flashcard/deck/${deck.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'var(--primary-100)' }}>
                      📚
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary-600 transition-colors" style={{ color: 'var(--gray-900)' }}>
                        {deck.name}
                      </h3>
                      <p className="text-sm truncate" style={{ color: 'var(--gray-500)' }}>
                        {deck.card_count || 0} thẻ
                        {deck.level_details && ` • ${deck.level_details.name}`}
                      </p>
                      {deck.description && (
                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--gray-400)' }}>
                          {deck.description}
                        </p>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <Link
                      href={`/flashcard/study/${deck.id}`}
                      className="btn btn-success btn-sm"
                    >
                      Học
                    </Link>
                    <button
                      onClick={() => handleDeleteDeck(deck.id)}
                      className="btn btn-ghost btn-sm"
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
      </div>

      {/* Create Deck Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b" style={{ borderColor: 'var(--gray-100)' }}>
              <h2 className="text-xl font-bold" style={{ color: 'var(--gray-900)' }}>Tạo bộ thẻ mới</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>Tạo bộ thẻ để tổ chức và học từ vựng</p>
            </div>
            <form onSubmit={handleCreateDeck} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--gray-700)' }}>Tên bộ thẻ</label>
                <input
                  type="text"
                  value={newDeck.name}
                  onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
                  className="input"
                  placeholder="Ví dụ: Từ vựng TOEIC"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--gray-700)' }}>Mô tả</label>
                <textarea
                  value={newDeck.description}
                  onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                  className="input"
                  rows={3}
                  placeholder="Mô tả ngắn về bộ thẻ..."
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={newDeck.is_public}
                    onChange={(e) => setNewDeck({ ...newDeck, is_public: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${newDeck.is_public ? 'bg-primary-500' : 'bg-gray-300'}`} style={newDeck.is_public ? { background: 'var(--primary-500)' } : { background: 'var(--gray-300)' }}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${newDeck.is_public ? 'translate-x-4' : ''}`} />
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--gray-700)' }}>Công khai</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" disabled={creating} className="btn btn-primary">
                  {creating ? 'Đang tạo...' : 'Tạo bộ thẻ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ColoredStat({ title, value, icon, color }) {
  const colorMap = {
    primary: { bg: 'var(--primary-100)', text: 'var(--primary-700)' },
    success: { bg: 'var(--success-100)', text: 'var(--success-600)' },
    warning: { bg: 'var(--accent-100)', text: 'var(--accent-600)' },
    accent: { bg: '#fff7ed', text: '#ea580c' },
  };
  const c = colorMap[color] || colorMap.primary;
  return (
    <StatCard
      title={title}
      value={value}
      icon={
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
          <Icon name={icon} color={c.text} />
        </div>
      }
    />
  );
}

function Icon({ name, color }) {
  const icons = {
    cards: <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    star: <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
    book: <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    'arrows-clockwise': <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  };
  return icons[name] || null;
}

FlashcardPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
