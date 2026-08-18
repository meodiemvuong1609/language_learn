import { useCallback, useEffect, useMemo, useState } from 'react';
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

export default function ClassesPage() {
  const { user } = useSelector((state) => state.auth);
  const teacher = isTeacher(user);
  const { addToast } = useToast();
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', course: '', notes: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (query.trim()) params.search = query.trim();
      if (courseFilter) params.course = courseFilter;
      const [g, c] = await Promise.all([
        api.getClassGroups(params),
        teacher ? api.getCourses() : Promise.resolve({ results: [] }),
      ]);
      setGroups(listResults(g));
      setCourses(listResults(c));
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [query, courseFilter, teacher]);

  useEffect(() => {
    const t = setTimeout(load, query ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, query]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createClassGroup({
        name: form.name,
        course: Number(form.course),
        notes: form.notes,
      });
      addToast('Đã tạo lớp', 'success');
      setOpen(false);
      setForm({ name: '', course: '', notes: '' });
      load();
    } catch (err) {
      addToast(err.message || 'Không tạo được lớp', 'error');
    }
  };

  const filteredHint = useMemo(() => {
    if (query || courseFilter) return `${groups.length} lớp khớp tìm kiếm`;
    return `${groups.length} lớp`;
  }, [groups.length, query, courseFilter]);

  return (
    <div>
      {isPendingStudent(user) && <PendingBanner />}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="font-plex text-[11px] tracking-[0.14em] uppercase mb-2" style={{ color: 'var(--stamp)' }}>classes</p>
          <h1 className="text-3xl font-bold">Lớp học</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{filteredHint}</p>
        </div>
        {teacher && (
          <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>Tạo lớp</button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="input"
          placeholder="Tìm lớp hoặc khóa học..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {teacher && (
          <select className="input sm:max-w-xs" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="">Tất cả khóa</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <LoadingIndicator message="Đang tải lớp..." />
      ) : groups.length === 0 ? (
        <EmptyState
          title="Chưa có lớp"
          message={teacher ? 'Tạo lớp rồi xếp học sinh theo danh sách.' : 'Bạn chưa được xếp vào lớp nào.'}
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b" style={{ borderColor: 'var(--line)' }}>
                <th className="p-4">Lớp</th>
                <th className="p-4">Khóa</th>
                <th className="p-4">Sĩ số</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.id} className="border-b" style={{ borderColor: 'var(--line)' }}>
                  <td className="p-4 font-medium">{g.name}</td>
                  <td className="p-4">{g.course_title}</td>
                  <td className="p-4">{g.student_count || 0}</td>
                  <td className="p-4 text-right">
                    <Link href={`/classes/${g.id}`} className="btn btn-secondary btn-sm">Mở lớp</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Tạo lớp">
        <form onSubmit={handleCreate} className="space-y-4">
          <select className="input" required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
            <option value="">Chọn khóa học</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <input className="input" required placeholder="Tên lớp (vd. Tối T3–T5)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea className="input" rows={3} placeholder="Ghi chú" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button type="submit" className="btn btn-primary w-full">Lưu lớp</button>
        </form>
      </Modal>
    </div>
  );
}

ClassesPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
