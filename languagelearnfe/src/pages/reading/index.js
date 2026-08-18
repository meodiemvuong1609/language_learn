import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function ReadingPage() {
  const [lessons, setLessons] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, levelsRes] = await Promise.all([
          api.getReadingLessons(),
          api.getLevels(),
        ]);
        setLessons(res.results || []);
        setLevels(levelsRes.results || []);
      } catch (err) {
        console.error('Failed to load reading:', err);
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
          📖 Đọc hiểu
        </h1>

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
                {lesson.image ? (
                  <img
                    src={lesson.image}
                    alt={lesson.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' }}>
                    <svg className="w-12 h-12" style={{ color: 'var(--success-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--gray-900)' }}>{lesson.title}</h3>
                  <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--gray-500)' }}>
                    {lesson.description}
                  </p>
                  <div className="flex items-center justify-between text-sm" style={{ color: 'var(--gray-500)' }}>
                    <span>📝 {lesson.word_count || 0} từ</span>
                    <span>⏱️ {lesson.estimated_duration || 0} phút</span>
                  </div>
                  <Link href={`/reading/${lesson.id}`} className="btn w-full mt-4" style={{ background: '#059669', color: 'white' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Đọc bài
                  </Link>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="text-5xl mb-4 opacity-60">📖</div>
                <p className="font-medium" style={{ color: 'var(--gray-600)' }}>Chưa có bài đọc nào</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

ReadingPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
