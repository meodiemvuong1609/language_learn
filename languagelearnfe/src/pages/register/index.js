import { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { login } from '@/store/authSlice';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { useToast } from '@/components/Toast';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      addToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    if (password !== confirmPassword) {
      addToast('Mật khẩu không khớp', 'error');
      return;
    }

    if (password.length < 8) {
      addToast('Mật khẩu phải có ít nhất 8 ký tự', 'error');
      return;
    }

    try {
      // Call register API directly via axios
      const { axiosInstance } = await import('@/store/axios');
      const res = await axiosInstance.post('/auth/register/', {
        username,
        email,
        password,
      });

      if (res.data.code === 200) {
        // Auto login after register
        await dispatch(login({ username, password })).unwrap();
        addToast('Đăng ký thành công. Tài khoản đang chờ cô duyệt.', 'success');
        router.push('/dashboard');
      } else {
        addToast(res.data.message || 'Đăng ký thất bại', 'error');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen auth-canvas p-4">
      <div className="w-full max-w-md p-8 space-y-6 border" style={{ background: 'var(--surface-primary)', borderColor: 'var(--line)' }}>
        <h2 className="text-3xl font-bold text-center">
          Tạo tài khoản
        </h2>
        <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
          Đăng ký học IELTS. Cô Ngọc Thảo sẽ duyệt tài khoản trước khi vào lớp.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Chọn tên đăng nhập"
              className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--moss)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
              className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--moss)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Tạo mật khẩu (ít nhất 8 ký tự)"
              className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--moss)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Nhập lại mật khẩu"
              className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--moss)]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold transition-all ${
              loading
                ? 'bg-stamp/60 cursor-not-allowed'
                : 'bg-stamp hover:bg-[#8f1c14]'
            }`}
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-moss hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

RegisterPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>{page}</DefaultLayout>
  );
};
