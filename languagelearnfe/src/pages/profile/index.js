import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { getMe } from '@/store/authSlice';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';
import { useLogout } from '@/lib/useLogout';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const handleLogout = useLogout();
  const { user } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', birthday: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [dailyGoal, setDailyGoal] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        try {
          await dispatch(getMe()).unwrap();
        } catch {
          // ignore
        }
      }
      try {
        const pref = await api.getPreferences();
        if (pref?.daily_goal) setDailyGoal(pref.daily_goal);
      } catch {
        // unauthenticated or no pref yet
      }
      setLoading(false);
    };
    load();
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: user.birthday ? user.birthday.slice(0, 10) : '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const data = await api.updateMe(form);
      if (data) {
        setMessage('Cập nhật thành công');
        setEditing(false);
        dispatch(getMe());
      } else {
        setMessage('Có lỗi xảy ra');
      }
    } catch {
      setMessage('Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingIndicator message="Đang tải hồ sơ..." />;
  if (!user) return <div className="text-center py-20" style={{ color: 'var(--gray-500)' }}>Đang tải...</div>;

  return (
    <div className="min-h-screen" style={{ background: 'var(--gray-50)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8 animate-fade-in" style={{ color: 'var(--gray-900)' }}>
          👤 Hồ sơ của tôi
        </h1>

        <div className="card animate-fade-in" style={{ animationDelay: '100ms' }}>
          {/* Avatar Section */}
          <div className="p-6 border-b" style={{ borderColor: 'var(--gray-100)' }}>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl overflow-hidden" style={{ background: 'var(--primary-100)' }}>
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span style={{ color: 'var(--primary-600)' }}>👤</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--gray-900)' }}>{user.full_name || user.username}</h2>
                <p className="text-sm" style={{ color: 'var(--gray-500)' }}>@{user.username}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--gray-400)' }}>
                  Tham gia: {new Date(user.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`mx-6 mt-6 p-3 rounded-lg text-sm font-medium animate-fade-in ${
              message.includes('thành công') ? 'text-green-700' : 'text-red-600'
            }`} style={{ background: message.includes('thành công') ? 'var(--success-100)' : 'var(--error-100)' }}>
              {message}
            </div>
          )}

          {/* Fields */}
          <div className="p-6 space-y-5">
            <ProfileField
              label="Họ và tên"
              value={form.full_name}
              editing={editing}
              onChange={(v) => setForm({ ...form, full_name: v })}
            />
            <ProfileField
              label="Email"
              value={form.email}
              editing={editing}
              onChange={(v) => setForm({ ...form, email: v })}
              type="email"
            />
            <ProfileField
              label="Số điện thoại"
              value={form.phone}
              editing={editing}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <ProfileField
              label="Ngày sinh"
              value={form.birthday}
              editing={editing}
              onChange={(v) => setForm({ ...form, birthday: v })}
              type="date"
            />

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--gray-700)' }}>
                Mục tiêu học mỗi ngày (phút)
              </label>
              <input
                type="number"
                min={5}
                max={240}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                onBlur={() => api.updatePreferences({ daily_goal: dailyGoal }).catch(() => {})}
                className="input"
              />
            </div>

            {user.settings && (
              <div className="p-4 rounded-lg" style={{ background: 'var(--gray-50)' }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--gray-700)' }}>Cài đặt</h3>
                <pre className="text-xs overflow-auto" style={{ color: 'var(--gray-600)' }}>
                  {JSON.stringify(user.settings, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t flex flex-wrap justify-end gap-3" style={{ borderColor: 'var(--gray-100)' }}>
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="btn btn-secondary">Hủy</button>
                <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={handleLogout} className="btn btn-secondary">
                  Đăng xuất
                </button>
                <button onClick={() => setEditing(true)} className="btn btn-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, editing, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--gray-700)' }}>{label}</label>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input"
        />
      ) : (
        <p className="py-2 px-0" style={{ color: 'var(--gray-900)' }}>{value || '—'}</p>
      )}
    </div>
  );
}

ProfilePage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
