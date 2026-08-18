import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import StatCard from '@/components/ui/StatCard';
import PendingBanner from '@/components/lms/PendingBanner';
import SessionMonthList from '@/components/lms/SessionMonthList';
import { isPendingStudent, isTeacher, listResults } from '@/lib/lms';

export default function DashboardPage() {
  const { token, user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const res = await api.getClassroomDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
    else setLoading(false);
  }, [token]);

  if (loading) return <LoadingIndicator message="Đang tải tổng quan..." />;

  if (error && !data) {
    return (
      <ErrorState
        title="Không thể tải tổng quan"
        message="Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại."
        onRetry={() => window.location.reload()}
        retryText="Thử lại"
      />
    );
  }

  const sessions = data?.upcoming_sessions || [];
  const teacher = isTeacher(user) || data?.role === 'teacher';

  return (
    <div>
      <div className="mb-8">
        <p className="font-plex text-[11px] tracking-[0.14em] uppercase mb-2" style={{ color: 'var(--stamp)' }}>
          {teacher ? 'cô giáo' : 'học viên'}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          {teacher ? 'Lớp, lịch và học sinh đang chờ duyệt.' : 'Lịch học và khóa của bạn.'}
        </p>
      </div>

      {isPendingStudent(user) && <PendingBanner />}

      {teacher && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/students?status=pending" className="block">
            <StatCard title="Chờ duyệt" value={data?.pending_students || 0} />
          </Link>
          <Link href="/students" className="block">
            <StatCard title="Học sinh" value={data?.student_count || 0} />
          </Link>
          <Link href="/courses" className="block">
            <StatCard title="Khóa học" value={data?.course_count || 0} />
          </Link>
          <Link href="/classes" className="block">
            <StatCard title="Lớp" value={data?.class_group_count || 0} />
          </Link>
        </div>
      )}

      {!teacher && user?.status === 'active' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatCard title="Khóa đang học" value={data?.course_count || 0} />
          <StatCard title="Buổi sắp tới" value={sessions.length} />
        </div>
      )}

      <div className="card mb-8">
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--line)' }}>
          <div>
            <h2 className="text-lg font-bold">Lịch tháng này</h2>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {data?.month?.label || 'Tháng hiện tại'} — buổi được gán theo ngày
            </p>
          </div>
          <Link href="/schedule" className="text-sm" style={{ color: 'var(--moss)' }}>Xem lịch đầy đủ</Link>
        </div>
        <div className="p-4">
          <SessionMonthList
            sessions={sessions}
            teacher={teacher}
            empty={
              <EmptyState
                icon="📅"
                title="Chưa có buổi trong tháng"
                message={teacher ? 'Tạo buổi trên trang Lịch học.' : 'Khi cô xếp lịch tháng này, buổi sẽ hiện ở đây.'}
              />
            }
          />
        </div>
      </div>

      {!teacher && listResults({ results: data?.courses }).length > 0 && (
        <div className="card">
          <h2 className="text-lg font-bold p-6 border-b" style={{ borderColor: 'var(--line)' }}>Khóa của bạn</h2>
          <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
            {(data.courses || []).map((c) => (
              <li key={c.id} className="p-4">
                <Link href={`/courses/${c.id}`} className="font-semibold">{c.title}</Link>
                {c.target_band && (
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Band {c.target_band}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
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
