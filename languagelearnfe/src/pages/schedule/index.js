import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import EmptyState from '@/components/EmptyState';
import PendingBanner from '@/components/lms/PendingBanner';
import SessionMonthList from '@/components/lms/SessionMonthList';
import { Modal } from '@/components/ui';
import { useToast } from '@/components/Toast';
import {
  ATTENDANCE_LABELS,
  currentMonthValue,
  fromDatetimeLocal,
  isPendingStudent,
  isTeacher,
  listResults,
  monthLabel,
  shiftMonth,
} from '@/lib/lms';

export default function SchedulePage() {
  const { user } = useSelector((state) => state.auth);
  const teacher = isTeacher(user);
  const { addToast } = useToast();
  const [month, setMonth] = useState(currentMonthValue);
  const [sessions, setSessions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({
    class_group: '',
    title: '',
    starts_at: '',
    ends_at: '',
    meet_link: '',
    mode: 'group',
    notes: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getSessions({ month });
      setSessions(listResults(res));
      if (teacher) {
        const g = await api.getClassGroups();
        setGroups(listResults(g));
      }
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [teacher, month]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createSession({
        ...form,
        class_group: Number(form.class_group),
        starts_at: fromDatetimeLocal(form.starts_at),
        ends_at: fromDatetimeLocal(form.ends_at),
        meet_link: form.meet_link
          ? (form.meet_link.startsWith('http') ? form.meet_link : `https://${form.meet_link}`)
          : '',
      });
      addToast('Đã tạo buổi học', 'success');
      setOpen(false);
      setForm({ class_group: '', title: '', starts_at: '', ends_at: '', meet_link: '', mode: 'group', notes: '' });
      load();
    } catch (err) {
      addToast(err.response?.data?.meet_link?.[0] || err.message || 'Không tạo được buổi', 'error');
    }
  };

  const openAttendance = async (session) => {
    try {
      const full = await api.getSession(session.id);
      const group = await api.getClassGroup(session.class_group);
      setActive({ session: full, group });
    } catch (err) {
      addToast(err.message || 'Không tải được buổi', 'error');
    }
  };

  const mark = async (studentId, status) => {
    try {
      await api.markAttendance(active.session.id, { student_id: studentId, status });
      addToast('Đã điểm danh', 'success');
      openAttendance(active.session);
    } catch (err) {
      addToast(err.message || 'Không điểm danh được', 'error');
    }
  };

  const enrolled = (active?.group?.enrollments || []).filter((e) => e.status === 'enrolled');
  const attMap = Object.fromEntries((active?.session?.attendances || []).map((a) => [a.student, a.status]));

  return (
    <div>
      {isPendingStudent(user) && <PendingBanner />}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="font-plex text-[11px] tracking-[0.14em] uppercase mb-2" style={{ color: 'var(--stamp)' }}>timetable</p>
          <h1 className="text-3xl font-bold">Lịch học</h1>
        </div>
        {teacher && (
          <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>Tạo buổi</button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setMonth((m) => shiftMonth(m, -1))}>
          Tháng trước
        </button>
        <p className="font-bold min-w-[140px] text-center">{monthLabel(month)}</p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setMonth((m) => shiftMonth(m, 1))}>
          Tháng sau
        </button>
        {month !== currentMonthValue() && (
          <button type="button" className="text-sm" style={{ color: 'var(--moss)' }} onClick={() => setMonth(currentMonthValue())}>
            Về tháng này
          </button>
        )}
      </div>

      {loading ? (
        <LoadingIndicator message="Đang tải lịch..." />
      ) : (
        <SessionMonthList
          sessions={sessions}
          teacher={teacher}
          onAttendance={teacher ? openAttendance : undefined}
          empty={
            <EmptyState
              title={`Chưa có buổi trong ${monthLabel(month)}`}
              message={teacher ? 'Tạo buổi và chọn ngày trong tháng.' : 'Khi cô xếp lịch tháng này, buổi sẽ hiện theo ngày.'}
            />
          }
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Tạo buổi học">
        <form onSubmit={handleCreate} className="space-y-4">
          <select className="input" required value={form.class_group} onChange={(e) => setForm({ ...form, class_group: e.target.value })}>
            <option value="">Chọn lớp</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.course_title} — {g.name}</option>
            ))}
          </select>
          <input className="input" placeholder="Tiêu đề (vd. Speaking cue card)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <label className="block text-sm font-medium">Bắt đầu
            <input className="input mt-1" required type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
          </label>
          <label className="block text-sm font-medium">Kết thúc
            <input className="input mt-1" required type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} />
          </label>
          <input className="input" type="url" placeholder="Link Google Meet" value={form.meet_link} onChange={(e) => setForm({ ...form, meet_link: e.target.value })} />
          <select className="input" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
            <option value="group">Nhóm</option>
            <option value="one_on_one">1-1</option>
          </select>
          <textarea className="input" rows={3} placeholder="Ghi chú" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button type="submit" className="btn btn-primary w-full">Lưu buổi</button>
        </form>
      </Modal>

      <Modal open={Boolean(active)} onClose={() => setActive(null)} title={`Điểm danh — ${active?.session?.title || 'Buổi học'}`}>
        {enrolled.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Lớp chưa có học sinh.</p>
        ) : (
          <ul className="space-y-3">
            {enrolled.map((e) => {
              const sid = e.student?.id;
              const current = attMap[sid];
              return (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium">{e.student?.full_name || e.student?.username}</span>
                  <div className="flex gap-1">
                    {Object.keys(ATTENDANCE_LABELS).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => mark(sid, st)}
                        className="px-2 py-1 text-xs border"
                        style={{
                          background: current === st ? 'var(--ink)' : 'transparent',
                          color: current === st ? '#fff8f6' : 'var(--ink)',
                          borderColor: 'var(--ink)',
                        }}
                      >
                        {ATTENDANCE_LABELS[st]}
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Modal>
    </div>
  );
}

SchedulePage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
