import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesRes, levelsRes] = await Promise.all([
          api.getQuizzes(),
          api.getLevels(),
        ]);
        setQuizzes(quizzesRes.results || []);
        setLevels(levelsRes.results || []);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = selectedLevel
    ? quizzes.filter((q) => q.level === parseInt(selectedLevel))
    : quizzes;

  const handleStartQuiz = (quizId) => {
    router.push(`/quizzes/${quizId}`);
  };

  const getDifficultyLabel = (d) => {
    if (d >= 3) return 'Khó';
    if (d === 2) return 'Trung bình';
    return 'Dễ';
  };

  const getDifficultyColor = (d) => {
    if (d >= 3) return 'var(--red-100)';
    if (d === 2) return 'var(--yellow-100)';
    return 'var(--green-100)';
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gray-50)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--gray-900)' }}>
              Quiz & Kiểm tra
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--gray-500)' }}>
              Thử thách kiến thức của bạn với các bài quiz
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="badge badge-info">{filtered.length} bài quiz</span>
          </div>
        </div>

        {/* Level Filter */}
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
          <LoadingIndicator message="Đang tải quiz..." />
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16 animate-fade-in">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--gray-100)' }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <p className="text-lg font-medium" style={{ color: 'var(--gray-700)' }}>
              Chưa có quiz nào
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--gray-500)' }}>
              Hãy thử chọn trình độ khác hoặc quay lại sau
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {filtered.map((quiz) => (
              <div
                key={quiz.id}
                className="card card-hover cursor-pointer group animate-fade-in"
                onClick={() => handleStartQuiz(quiz.id)}
              >
                {/* Quiz Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg, var(--orange-500), var(--orange-600))' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-600 transition-colors" style={{ color: 'var(--gray-900)' }}>
                  {quiz.title}
                </h3>

                {/* Description */}
                {quiz.description && (
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--gray-500)' }}>
                    {quiz.description}
                  </p>
                )}

                {/* Quiz Info */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge badge-info">
                    {quiz.questions_count || 0} câu hỏi
                  </span>
                  {quiz.time_limit > 0 ? (
                    <span className="badge badge-warning">
                      {quiz.time_limit} phút
                    </span>
                  ) : (
                    <span className="badge">Không giới hạn</span>
                  )}
                  <span className="badge badge-success">
                    Đạt: {quiz.passing_score}%
                  </span>
                </div>

                {/* Level & Topics */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {quiz.level_details && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)' }}>
                      {quiz.level_details.name}
                    </span>
                  )}
                  {quiz.topics_details?.map((topic) => (
                    <span
                      key={topic.id}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}
                    >
                      {topic.name}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <div className="pt-3" style={{ borderTop: '1px solid var(--gray-100)' }}>
                  <span className="text-sm font-medium text-orange-600 group-hover:underline">
                    Bắt đầu làm bài →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--gray-500)' }}
          >
            ← Quay lại Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

QuizzesPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
