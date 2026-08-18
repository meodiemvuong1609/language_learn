import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import Link from 'next/link';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function ListeningPage() {
  const [lessons, setLessons] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsRes, levelsRes] = await Promise.all([
          api.getAudioLessons(),
          api.getLevels(),
        ]);
        setLessons(lessonsRes.results || []);
        setLevels(levelsRes.results || []);
      } catch (err) {
        console.error('Failed to load listening:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = selectedLevel
    ? lessons.filter((l) => l.level === parseInt(selectedLevel))
    : lessons;

  return (
    <div className="min-h-screen" style={{ background: 'var(--gray-50)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6 animate-fade-in" style={{ color: 'var(--gray-900)' }}>
          🎧 Luyện nghe
        </h1>

        {/* Filter */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="input max-w-xs"
          >
            <option value="">Tất cả trình độ</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name} ({level.code})
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <LoadingIndicator message="Đang tải bài học..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {filtered.map((lesson) => (
              <div key={lesson.id} className="card card-interactive overflow-hidden">
                {/* Header with audio icon */}
                <div className="p-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' }}>
                  <svg className="w-12 h-12" style={{ color: 'var(--success-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--gray-900)' }}>{lesson.title}</h3>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--gray-500)' }}>
                    {lesson.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--gray-500)' }}>
                      {lesson.duration > 0 && (
                        <span>⏱️ {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}</span>
                      )}
                    </div>
                    {lesson.level_details && (
                      <span className="badge badge-success">{lesson.level_details.code}</span>
                    )}
                  </div>
                  <Link href={`/listening/${lesson.id}`} className="btn btn-success w-full mt-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Nghe bài học
                  </Link>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="text-5xl mb-4 opacity-60">🎧</div>
                <p className="font-medium" style={{ color: 'var(--gray-600)' }}>Chưa có bài học nào</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

ListeningPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
