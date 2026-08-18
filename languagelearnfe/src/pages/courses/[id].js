import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import EmptyState from '@/components/EmptyState';
import { Modal } from '@/components/ui';
import { useToast } from '@/components/Toast';
import EnrollStudentsModal from '@/components/lms/EnrollStudentsModal';
import { isTeacher, listResults } from '@/lib/lms';

export default function CourseDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useSelector((state) => state.auth);
  const teacher = isTeacher(user);
  const { addToast } = useToast();
  const [course, setCourse] = useState(null);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupOpen, setGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [enrollFor, setEnrollFor] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [c, g] = await Promise.all([
        api.getCourse(id),
        api.getClassGroups({ course: id }),
      ]);
      setCourse(c);
      setGroups(listResults(g));
      if (teacher) {
        const s = await api.getStudents({ status: 'active' });
        setStudents(listResults(s));
      }
    } catch {
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [id, teacher]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await api.createClassGroup({ name: groupName, course: Number(id) });
      addToast('Đã tạo lớp', 'success');
      setGroupOpen(false);
      setGroupName('');
      load();
    } catch (err) {
      addToast(err.message || 'Không tạo được lớp', 'error');
    }
  };

  const openEnroll = async (groupId) => {
    try {
      const g = await api.getClassGroup(groupId);
      setEnrollments((g.enrollments || []).filter((e) => e.status === 'enrolled'));
      setEnrollFor(groupId);
    } catch (err) {
      addToast(err.message || 'Không tải được lớp', 'error');
    }
  };

  const enrolledIds = useMemo(
    () => enrollments.map((e) => e.student?.id).filter(Boolean),
    [enrollments]
  );

  const handleEnroll = async (ids) => {
    setSubmitting(true);
    try {
      const res = await api.enrollStudents(enrollFor, ids);
      addToast(`Đã xếp ${res?.enrolled_count ?? ids.length} học sinh`, 'success');
      setEnrollFor(null);
      load();
    } catch (err) {
      addToast(err.message || 'Không xếp được lớp', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingIndicator message="Đang tải khóa học..." />;
  if (!course) {
    return (
      <div>
        <Link href="/courses" className="text-sm" style={{ color: 'var(--moss)' }}>← Khóa học</Link>
        <p className="mt-6" style={{ color: 'var(--muted)' }}>Không tìm thấy khóa học.</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/courses" className="text-sm" style={{ color: 'var(--moss)' }}>← Khóa học</Link>
      <h1 className="text-3xl font-bold mt-3 mb-1">{course.title}</h1>
      {course.target_band && (
        <p className="font-plex text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--moss)' }}>
          Band {course.target_band}
        </p>
      )}
      <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>{course.description}</p>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Lớp</h2>
        {teacher && (
          <button type="button" className="btn btn-primary" onClick={() => setGroupOpen(true)}>Tạo lớp</button>
        )}
      </div>

      {groups.length === 0 ? (
        <EmptyState title="Chưa có lớp" message={teacher ? 'Tạo lớp (vd. Tối T3–T5) rồi xếp học sinh.' : 'Bạn chưa được xếp lớp.'} />
      ) : (
        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold">{g.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{g.student_count || 0} học sinh</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/classes/${g.id}`} className="btn btn-secondary">Danh sách</Link>
                  {teacher && (
                    <button type="button" className="btn btn-primary" onClick={() => openEnroll(g.id)}>Xếp học sinh</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={groupOpen} onClose={() => setGroupOpen(false)} title="Tạo lớp">
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <input className="input" required placeholder="Tên lớp" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full">Lưu lớp</button>
        </form>
      </Modal>

      <EnrollStudentsModal
        open={Boolean(enrollFor)}
        onClose={() => setEnrollFor(null)}
        students={students}
        enrolledIds={enrolledIds}
        onSubmit={handleEnroll}
        submitting={submitting}
      />
    </div>
  );
}

CourseDetailPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
