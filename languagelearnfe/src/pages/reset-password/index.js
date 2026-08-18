import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { api } from '@/services/api';
import { useToast } from '@/components/Toast';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { uid, token } = router.query;
  const [password, setPassword] = useState('');
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uid || !token) {
      addToast('Link không hợp lệ', 'error');
      return;
    }
    try {
      await api.resetPassword({ uid, token, new_password: password });
      addToast('Đặt lại mật khẩu thành công', 'success');
      router.push('/login');
    } catch (err) {
      addToast(err.response?.data?.error || 'Không đặt lại được mật khẩu', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-canvas p-4">
      <div className="w-full max-w-md border p-8" style={{ background: 'var(--surface-primary)', borderColor: 'var(--line)' }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Đặt lại mật khẩu</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
            className="w-full border rounded-lg px-3 py-2"
          />
          <button type="submit" className="btn btn-primary w-full">Lưu mật khẩu</button>
        </form>
        <Link href="/login" className="block mt-6 text-sm text-moss">← Đăng nhập</Link>
      </div>
    </div>
  );
}

ResetPasswordPage.layout = Layout;
