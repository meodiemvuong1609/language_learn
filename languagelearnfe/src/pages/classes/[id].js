import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import EmptyState from '@/components/EmptyState';
import EnrollStudentsModal from '@/components/lms/EnrollStudentsModal';
import { useToast } from '@/components/Toast';
import { isTeacher, listResults } from '@/lib/lms';

export default function ClassDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useSelector((state) => state.auth);
  const teacher = isTeacher(user);
  const { addToast } = useToast();
  const [group, setGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const g = await api.getClassGroup(id);
      setGroup(g);
      if (teacher) {
        const s = await api.getStudents({ status: 'active' });
        setStudents(listResults(s));
      }
    } catch {
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [id, teacher]);

  useEffect(() => {
    load();
  }, [load]);

  const enrolled = useMemo(
    () => (group?.enrollments || []).filter((e) => e.status === 'enrolled'),
    [group]
  );
  const enrolledIds = enrolled.map((e) => e.student?.id).filter(Boolean);
  const visible = enrolled.filter((e) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const s = e.student || {};
    return `${s.full_name || ''} ${s.username || ''} ${s.email || ''}`.toLowerCase().includes(q);
  });

  const handleEnroll = async (ids) => {
    setSubmitting(true);
    try {
      const res = await api.enrollStudents(id, ids);
      const n = res?.enrolled_count ?? ids.length;
      addToast(`Đã xếp ${n} học sinh`, 'success');
      setEnrollOpen(false);
      load();
    } catch (err) {
      addToast(err.message || 'Không xếp được lớp', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnenroll = async (sid) => {
    try {
      await api.unenrollStudent(id, sid);
      addToast('Đã xóa khỏi lớp', 'success');
      load();
    } catch (err) {
      addToast(err.message || 'Không xóa được', 'error');
    }
  };

  if (loading) return <LoadingIndicator message="Đang tải lớp..." />;
  if (!group) {
    return (
      <div>
        <Link href="/classes" className="text-sm" style={{ color: 'var(--moss)' }}>← Lớp học</Link>
        <p className="mt-6" style={{ color: 'var(--muted)' }}>Không tìm thấy lớp.</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/classes" className="text-sm" style={{ color: 'var(--moss)' }}>← Lớp học</Link>
      <p className="font-plex text-[11px] tracking-[0.14em] uppercase mt-4 mb-1" style={{ color: 'var(--moss)' }}>
        {group.course_title}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{enrolled.length} học sinh</p>
        </div>
        {teacher && (
          <button type="button" className="btn btn-primary" onClick={() => setEnrollOpen(true)}>
            Xếp học sinh
          </button>
        )}
      </div>

      <input
        className="input mb-4"
        placeholder="Tìm học sinh trong lớp..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {visible.length === 0 ? (
        <EmptyState
          title="Chưa có học sinh"
          message={teacher ? 'Chọn nhiều học sinh từ danh sách để xếp vào lớp.' : 'Lớp chưa có danh sách.'}
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b" style={{ borderColor: 'var(--line)' }}>
                <th className="p-4">Họ tên</th>
                <th className="p-4">Tài khoản</th>
                <th className="p-4">Email</th>
                {teacher && <th className="p-4" />}
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => (
                <tr key={e.id} className="border-b" style={{ borderColor: 'var(--line)' }}>
                  <td className="p-4 font-medium">{e.student?.full_name || '—'}</td>
                  <td className="p-4">{e.student?.username}</td>
                  <td className="p-4">{e.student?.email}</td>
                  {teacher && (
                    <td className="p-4 text-right">
                      <button type="button" className="text-stamp" onClick={() => handleUnenroll(e.student.id)}>
                        Xóa
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EnrollStudentsModal
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        students={students}
        enrolledIds={enrolledIds}
        onSubmit={handleEnroll}
        submitting={submitting}
      />
    </div>
  );
}

ClassDetailPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
