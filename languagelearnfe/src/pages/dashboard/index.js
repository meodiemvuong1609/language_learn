import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import StatCard from '@/components/ui/StatCard';

export default function DashboardPage() {
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [recentProgress, setRecentProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const res = await api.getDashboardStats();
        setStats(res.stats || {});
        setRecentProgress(res.recent_progress || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <LoadingIndicator message="Đang tải dashboard..." />;

  if (error && !stats) {
    return (
      <ErrorState
        title="Không thể tải dashboard"
        message="Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại."
        onRetry={() => window.location.reload()}
        retryText="Thử lại"
      />
    );
  }

  const statCards = [
    { title: 'Từ vựng', value: stats?.vocabulary_count || 0, icon: 'book', color: 'blue', href: '/vocabulary' },
    { title: 'Nghe', value: stats?.listening_count || 0, icon: 'headphones', color: 'green', href: '/listening' },
    { title: 'Nói', value: stats?.speaking_count || 0, icon: 'microphone', color: 'purple', href: '/speaking' },
    { title: 'Quiz', value: stats?.quiz_count || 0, icon: 'clipboard', color: 'orange', href: '/quizzes' },
    { title: 'Đọc hiểu', value: stats?.reading_count || 0, icon: 'book-open', color: 'emerald', href: '/reading' },
    { title: 'Ngữ pháp', value: stats?.sentence_count || 0, icon: 'pencil', color: 'yellow', href: '/sentence' },
  ];

  const iconMap = {
    book: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    headphones: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
    microphone: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
    clipboard: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    'book-open': <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    pencil: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  };

  const colorMap = {
    blue: { bg: 'var(--primary-100)', text: 'var(--primary-700)' },
    green: { bg: 'var(--success-100)', text: 'var(--success-600)' },
    purple: { bg: '#f3e8ff', text: '#9333ea' },
    orange: { bg: '#fff7ed', text: '#ea580c' },
    emerald: { bg: '#ecfdf5', text: '#059669' },
    yellow: { bg: 'var(--accent-100)', text: 'var(--accent-600)' },
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gray-50)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--gray-900)' }}>Dashboard</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--gray-500)' }}>Tổng quan tiến độ học tập của bạn</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 stagger-children">
          {statCards.map((card) => (
            <Link key={card.title} href={card.href} className="block">
              <StatCard
                title={card.title}
                value={card.value}
                className="card-interactive"
                icon={
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: colorMap[card.color]?.bg, color: colorMap[card.color]?.text }}>
                    {iconMap[card.icon]}
                  </div>
                }
              />
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-bold p-6 border-b" style={{ color: 'var(--gray-900)', borderColor: 'var(--gray-100)' }}>
            Hoạt động gần đây
          </h2>
    {recentProgress.length === 0 ? (
      <div className="p-12">
        <EmptyState
          icon="📊"
          title="Chưa có hoạt động nào"
          message="Hãy bắt đầu học để xem tiến độ của bạn ở đây!"
        />
      </div>
    ) : (
            <div className="divide-y" style={{ borderColor: 'var(--gray-100)' }}>
              {recentProgress.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gray-100)' }}>
                      <span className="text-lg">📌</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--gray-900)' }}>
                        {item.content_type?.name || 'Nội dung'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--gray-500)' }}>
                        Điểm: {item.score ?? 0} • {item.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--gray-400)' }}>
                    {item.last_reviewed ? new Date(item.last_reviewed).toLocaleDateString('vi-VN') : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

DashboardPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
