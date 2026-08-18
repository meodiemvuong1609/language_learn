import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import TeacherGate from '@/components/lms/TeacherGate';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import EmptyState from '@/components/EmptyState';
import { Modal } from '@/components/ui';
import { useToast } from '@/components/Toast';
import { listResults, STATUS_LABELS } from '@/lib/lms';

export default function StudentsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [statusFilter, setStatusFilter] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [createdPassword, setCreatedPassword] = useState('');
  const [form, setForm] = useState({ username: '', email: '', full_name: '', phone: '', password: '' });

  useEffect(() => {
    if (typeof router.query.status === 'string') {
      setStatusFilter(router.query.status);
    }
  }, [router.query.status]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.getStudents(params);
      setStudents(listResults(res));
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = await api.createStudent(form);
      setCreatedPassword(data.temporary_password || form.password);
      addToast('Đã tạo học sinh', 'success');
      setForm({ username: '', email: '', full_name: '', phone: '', password: '' });
      load();
    } catch (err) {
      addToast(err.message || 'Không tạo được học sinh', 'error');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.approveStudent(id);
      addToast('Đã duyệt', 'success');
      load();
    } catch (err) {
      addToast(err.message || 'Không duyệt được', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.rejectStudent(id);
      addToast('Đã từ chối', 'success');
      load();
    } catch (err) {
      addToast(err.message || 'Không từ chối được', 'error');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="font-plex text-[11px] tracking-[0.14em] uppercase mb-2" style={{ color: 'var(--stamp)' }}>roster</p>
          <h1 className="text-3xl font-bold">Học sinh</h1>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => { setCreatedPassword(''); setOpen(true); }}>
          Tạo tài khoản
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { id: '', label: 'Tất cả' },
          { id: 'pending', label: 'Chờ duyệt' },
          { id: 'active', label: 'Đã duyệt' },
          { id: 'rejected', label: 'Từ chối' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className="px-3 py-1.5 text-sm border"
            style={{
              background: statusFilter === tab.id ? 'var(--ink)' : 'transparent',
              color: statusFilter === tab.id ? '#fff8f6' : 'var(--ink)',
              borderColor: 'var(--ink)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingIndicator message="Đang tải học sinh..." />
      ) : students.length === 0 ? (
        <EmptyState title="Chưa có học sinh" message="Tạo tài khoản hoặc chờ học sinh tự đăng ký." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b" style={{ borderColor: 'var(--line)' }}>
                <th className="p-4">Tên</th>
                <th className="p-4">Tài khoản</th>
                <th className="p-4">Email</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b" style={{ borderColor: 'var(--line)' }}>
                  <td className="p-4 font-medium">{s.full_name || '—'}</td>
                  <td className="p-4">{s.username}</td>
                  <td className="p-4">{s.email}</td>
                  <td className="p-4">{STATUS_LABELS[s.status] || s.status}</td>
                  <td className="p-4 text-right space-x-2">
                    {s.status === 'pending' && (
                      <>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => handleApprove(s.id)}>Duyệt</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleReject(s.id)}>Từ chối</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Tạo học sinh">
        <form onSubmit={handleCreate} className="space-y-4">
          <input className="input" required placeholder="Tên đăng nhập" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input className="input" required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Họ tên" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <input className="input" placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="input" type="password" minLength={8} placeholder="Mật khẩu (để trống sẽ tự tạo)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {createdPassword && (
            <p className="text-sm p-3" style={{ background: 'var(--cue)' }}>
              Mật khẩu: <strong>{createdPassword}</strong> — gửi cho học sinh rồi đóng.
            </p>
          )}
          <button type="submit" className="btn btn-primary w-full">Tạo</button>
        </form>
      </Modal>
    </div>
  );
}

StudentsPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <TeacherGate>
        <DefaultLayout>{page}</DefaultLayout>
      </TeacherGate>
    </ProtectedRoute>
  );
};
