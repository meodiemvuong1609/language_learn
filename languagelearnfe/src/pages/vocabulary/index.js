import SearchInput from '@/components/SearchInput';
import { useEffect, useState, useMemo } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import StatCard from '@/components/ui/StatCard';

export default function VocabularyPage() {
  const [words, setWords] = useState([]);
  const [levels, setLevels] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wordsRes, levelsRes, topicsRes, statsRes] = await Promise.all([
          api.getVocabularies(),
          api.getLevels(),
          api.getTopics(),
          api.getUserVocabularyStats(),
        ]);
        setWords(wordsRes.results || []);
        setLevels(levelsRes.results || []);
        setTopics(topicsRes.results || []);
        setStats(statsRes);
      } catch (err) {
        console.error('Failed to load vocabulary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let result = words;
    if (selectedLevel) {
      result = result.filter((w) => w.level === parseInt(selectedLevel));
    }
    if (selectedTopic) {
      result = result.filter((w) => w.topics?.some((t) => t.id === parseInt(selectedTopic)));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.word?.toLowerCase().includes(q) ||
          w.meaning?.toLowerCase().includes(q) ||
          w.example_sentence?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [words, selectedLevel, selectedTopic, search]);

  const getMasteryColor = (level) => {
    if (level >= 4) return 'var(--success-500)';
    if (level >= 2) return 'var(--warning-500)';
    if (level >= 1) return 'var(--primary-500)';
    return 'var(--gray-300)';
  };

  const getMasteryLabel = (level) => {
    const labels = ['Mới', 'Mới', 'Đang học', 'Đang học', 'Gần nắm', 'Thành thạo'];
    return labels[level] || 'Mới';
  };

  const getPOSColor = (pos) => {
    const colors = {
      noun: { bg: 'var(--blue-50)', text: 'var(--blue-700)' },
      verb: { bg: 'var(--green-50)', text: 'var(--green-700)' },
      adjective: { bg: 'var(--purple-50)', text: 'var(--purple-700)' },
      adverb: { bg: 'var(--orange-50)', text: 'var(--orange-700)' },
      preposition: { bg: 'var(--cyan-50)', text: 'var(--cyan-700)' },
      conjunction: { bg: 'var(--pink-50)', text: 'var(--pink-700)' },
      pronoun: { bg: 'var(--yellow-50)', text: 'var(--yellow-700)' },
      interjection: { bg: 'var(--red-50)', text: 'var(--red-700)' },
    };
    return colors[pos] || { bg: 'var(--gray-100)', text: 'var(--gray-600)' };
  };

  const VocabStat = ({ icon, label, value, color, bgColor }) => (
    <StatCard
      title={label}
      value={value}
      icon={
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: bgColor, color }}
        >
          {icon}
        </div>
      }
    />
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--gray-50)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--gray-900)' }}>
              Từ vựng
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--gray-500)' }}>
              Học và ôn tập từ vựng mỗi ngày
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              style={{ color: viewMode === 'grid' ? 'var(--primary-600)' : 'var(--gray-400)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              style={{ color: viewMode === 'list' ? 'var(--primary-600)' : 'var(--gray-400)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
            <VocabStat
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              }
              label="Tổng từ vựng"
              value={stats.total_words || 0}
              color="var(--primary-600)"
              bgColor="var(--primary-50)"
            />
            <VocabStat
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
              label="Đã thành thạo"
              value={stats.mastered_words || 0}
              color="var(--success-600)"
              bgColor="var(--success-50)"
            />
            <VocabStat
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              label="Đang học"
              value={stats.learning_words || 0}
              color="var(--warning-600)"
              bgColor="var(--warning-50)"
            />
            <VocabStat
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
              }
              label="Từ mới"
              value={stats.new_words || 0}
              color="var(--gray-600)"
              bgColor="var(--gray-100)"
            />
          </div>
        )}

        {/* Filters */}
        <div className="card p-4 mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ zIndex: 1 }}>
                <svg className="w-5 h-5" style={{ color: 'var(--gray-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm từ vựng, nghĩa, ví dụ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-11 w-full"
              />
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="input w-full lg:w-48"
            >
              <option value="">Tất cả trình độ</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name} ({level.code})
                </option>
              ))}
            </select>

            {/* Topic Filter */}
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="input w-full lg:w-48"
            >
              <option value="">Tất cả chủ đề</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>

            {/* Clear filters */}
            {(selectedLevel || selectedTopic || search) && (
              <button
                onClick={() => { setSelectedLevel(''); setSelectedTopic(''); setSearch(''); }}
                className="btn btn-ghost text-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Xóa lọc
              </button>
            )}
          </div>

          {/* Active filter tags */}
          {(selectedLevel || selectedTopic) && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--gray-100)' }}>
              {selectedLevel && (
                <span className="badge badge-primary">
                  Trình độ: {levels.find((l) => l.id === parseInt(selectedLevel))?.name}
                </span>
              )}
              {selectedTopic && (
                <span className="badge">
                  Chủ đề: {topics.find((t) => t.id === parseInt(selectedTopic))?.name}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
            Hiển thị <strong style={{ color: 'var(--gray-700)' }}>{filtered.length}</strong> từ vựng
          </p>
        </div>

        {loading ? (
          <LoadingIndicator message="Đang tải từ vựng..." />
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16 animate-fade-in">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--primary-50)' }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium" style={{ color: 'var(--gray-700)' }}>
              Không tìm thấy từ vựng
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--gray-500)' }}>
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {filtered.map((word) => {
              const posColor = getPOSColor(word.part_of_speech);
              return (
                <div
                  key={word.id}
                  className="card card-hover p-5 animate-fade-in group"
                >
                  {/* Word header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold truncate" style={{ color: 'var(--gray-900)' }}>
                        {word.word}
                      </h3>
                      {word.phonetic && (
                        <p className="text-sm mt-0.5" style={{ color: 'var(--gray-400)' }}>
                          {word.phonetic}
                        </p>
                      )}
                    </div>
                    {word.audio && (
                      <button
                        className="p-2 rounded-lg transition-colors flex-shrink-0 ml-2"
                        style={{ color: 'var(--primary-500)', background: 'var(--primary-50)' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Meaning */}
                  <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                    {word.meaning}
                  </p>

                  {/* Example sentence */}
                  {word.example_sentence && (
                    <div
                      className="p-3 rounded-lg mb-4"
                      style={{ background: 'var(--gray-50)', borderLeft: '3px solid var(--primary-200)' }}
                    >
                      <p className="text-sm italic leading-relaxed" style={{ color: 'var(--gray-600)' }}>
                        &ldquo;{word.example_sentence}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {word.part_of_speech && (
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: posColor.bg, color: posColor.text }}
                      >
                        {word.part_of_speech}
                      </span>
                    )}
                    {word.level_details && (
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: 'var(--primary-50)', color: 'var(--primary-700)' }}
                      >
                        {word.level_details.name}
                      </span>
                    )}
                    {word.topics_details?.map((topic) => (
                      <span
                        key={topic.id}
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}
                      >
                        {topic.name}
                      </span>
                    ))}
                  </div>

                  {/* Mastery progress bar */}
                  <div
                    className="pt-3"
                    style={{ borderTop: '1px solid var(--gray-100)' }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium" style={{ color: 'var(--gray-500)' }}>
                        Mức độ thành thạo
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: getMasteryColor(word.mastery_level || 0) }}
                      >
                        {getMasteryLabel(word.mastery_level || 0)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--gray-100)' }}>
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${((word.mastery_level || 0) / 5) * 100}%`,
                          background: getMasteryColor(word.mastery_level || 0),
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3 stagger-children">
            {filtered.map((word) => {
              const posColor = getPOSColor(word.part_of_speech);
              return (
                <div
                  key={word.id}
                  className="card card-hover p-4 animate-fade-in"
                >
                  <div className="flex items-center gap-4">
                    {/* Word */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold truncate" style={{ color: 'var(--gray-900)' }}>
                          {word.word}
                        </h3>
                        {word.phonetic && (
                          <span className="text-sm flex-shrink-0" style={{ color: 'var(--gray-400)' }}>
                            {word.phonetic}
                          </span>
                        )}
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: posColor.bg, color: posColor.text }}
                        >
                          {word.part_of_speech}
                        </span>
                      </div>
                      <p className="text-sm mt-1 truncate" style={{ color: 'var(--gray-600)' }}>
                        {word.meaning}
                      </p>
                    </div>

                    {/* Level */}
                    {word.level_details && (
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 hidden sm:inline-block"
                        style={{ background: 'var(--primary-50)', color: 'var(--primary-700)' }}
                      >
                        {word.level_details.name}
                      </span>
                    )}

                    {/* Mastery */}
                    <div className="flex items-center gap-2 flex-shrink-0 w-32">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--gray-100)' }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${((word.mastery_level || 0) / 5) * 100}%`,
                            background: getMasteryColor(word.mastery_level || 0),
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-medium w-8 text-right"
                        style={{ color: getMasteryColor(word.mastery_level || 0) }}
                      >
                        {word.mastery_level || 0}/5
                      </span>
                    </div>

                    {/* Audio button */}
                    {word.audio && (
                      <button
                        className="p-2 rounded-lg transition-colors flex-shrink-0"
                        style={{ color: 'var(--primary-500)', background: 'var(--primary-50)' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

VocabularyPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
