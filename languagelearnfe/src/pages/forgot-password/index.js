import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { api } from '@/services/api';
import { useToast } from '@/components/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.forgotPassword(email);
      setSent(true);
      addToast('Nếu email tồn tại, bạn sẽ nhận hướng dẫn đặt lại mật khẩu', 'success');
    } catch {
      addToast('Không gửi được yêu cầu. Thử lại sau.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-canvas p-4">
      <div className="w-full max-w-md border p-8" style={{ background: 'var(--surface-primary)', borderColor: 'var(--line)' }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quên mật khẩu</h1>
        <p className="text-sm text-gray-500 mb-6">Nhập email tài khoản để nhận link đặt lại.</p>
        {sent ? (
          <p className="text-green-700 text-sm">Đã gửi yêu cầu. Kiểm tra hộp thư (và spam).</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded-lg px-3 py-2"
            />
            <button type="submit" className="btn btn-primary w-full">Gửi hướng dẫn</button>
          </form>
        )}
        <Link href="/login" className="block mt-6 text-sm text-moss">← Quay lại đăng nhập</Link>
      </div>
    </div>
  );
}

ForgotPasswordPage.layout = Layout;
