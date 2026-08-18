import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function SpeakingPage() {
  const [lessons, setLessons] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsRes, levelsRes] = await Promise.all([
          api.getSpeakingLessons(),
          api.getLevels(),
        ]);
        setLessons(lessonsRes.results || []);
        setLevels(levelsRes.results || []);
      } catch (err) {
        console.error('Failed to load speaking:', err);
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
          🎤 Luyện nói
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
                <div className="p-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)' }}>
                  <svg className="w-12 h-12" style={{ color: '#9333ea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--gray-900)' }}>{lesson.title}</h3>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--gray-500)' }}>
                    {lesson.description}
                  </p>
                  <div className="flex items-center justify-between">
                    {lesson.level_details && (
                      <span className="badge" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                        {lesson.level_details.code} - {lesson.level_details.name}
                      </span>
                    )}
                  </div>
                  <Link href={`/speaking/${lesson.id}`} className="btn w-full mt-4" style={{ background: '#9333ea', color: 'white' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Luyện nói
                  </Link>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="text-5xl mb-4 opacity-60">🎤</div>
                <p className="font-medium" style={{ color: 'var(--gray-600)' }}>Chưa có bài học nào</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

SpeakingPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
