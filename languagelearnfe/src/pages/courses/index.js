import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import EmptyState from '@/components/EmptyState';
import PendingBanner from '@/components/lms/PendingBanner';
import { Modal } from '@/components/ui';
import { useToast } from '@/components/Toast';
import { isPendingStudent, isTeacher, listResults } from '@/lib/lms';

export default function CoursesPage() {
  const { user } = useSelector((state) => state.auth);
  const { addToast } = useToast();
  const teacher = isTeacher(user);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', target_band: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getCourses();
      setCourses(listResults(res));
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createCourse(form);
      addToast('Đã tạo khóa học', 'success');
      setOpen(false);
      setForm({ title: '', description: '', target_band: '' });
      load();
    } catch (err) {
      addToast(err.message || 'Không tạo được khóa', 'error');
    }
  };

  return (
    <div>
      {isPendingStudent(user) && <PendingBanner />}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="font-plex text-[11px] tracking-[0.14em] uppercase mb-2" style={{ color: 'var(--stamp)' }}>catalog</p>
          <h1 className="text-3xl font-bold">Khóa học</h1>
        </div>
        {teacher && (
          <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>Tạo khóa</button>
        )}
      </div>

      {loading ? (
        <LoadingIndicator message="Đang tải khóa học..." />
      ) : courses.length === 0 ? (
        <EmptyState
          title="Chưa có khóa học"
          message={teacher ? 'Tạo khóa IELTS rồi xếp lớp và lịch.' : 'Bạn chưa được xếp vào khóa nào.'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <Link key={c.id} href={`/courses/${c.id}`} className="card p-6 block card-interactive">
              <h2 className="text-xl font-bold mb-1">{c.title}</h2>
              {c.target_band && (
                <p className="text-xs font-plex uppercase tracking-wider mb-2" style={{ color: 'var(--moss)' }}>
                  Band {c.target_band}
                </p>
              )}
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{c.description || '—'}</p>
              <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>
                {c.class_group_count || 0} lớp · {c.student_count || 0} học sinh
              </p>
            </Link>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Tạo khóa học">
        <form onSubmit={handleCreate} className="space-y-4">
          <input className="input" required placeholder="Tên khóa (vd. IELTS Foundation)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="input" placeholder="Band mục tiêu (vd. 6.0–7.0)" value={form.target_band} onChange={(e) => setForm({ ...form, target_band: e.target.value })} />
          <textarea className="input" rows={4} placeholder="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button type="submit" className="btn btn-primary w-full">Lưu khóa</button>
        </form>
      </Modal>
    </div>
  );
}

CoursesPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
