import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DefaultLayout from '@/components/layout/DefaultLayout';

export default function HomePage() {
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      router.replace('/dashboard');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen auth-canvas flex items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center">
        <p className="inline-block font-plex text-[11px] tracking-[0.14em] uppercase border border-ink text-ink px-2 py-1 mb-6" style={{ boxShadow: '2px 2px 0 var(--ink)' }}>
          cue
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Ngọc Thảo IELTS
        </h1>
        <p className="text-lg max-w-xl mx-auto leading-relaxed mb-10" style={{ color: 'var(--muted)' }}>
          Luyện IELTS online từ Thanh Hóa — Speaking cue card, Writing Task 2,
          lộ trình cho học sinh THPT và sinh viên.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/login" className="btn btn-primary btn-lg">
            Đăng nhập
          </Link>
          <Link href="/register" className="ll-btn ll-btn-ghost" style={{ minHeight: 48, padding: '0 28px' }}>
            Đăng ký
          </Link>
          <Link href="/" className="text-sm" style={{ color: 'var(--moss)' }}>
            Trang giới thiệu
          </Link>
        </div>
        <p className="text-xs mt-12" style={{ color: 'var(--muted)' }}>
          © {new Date().getFullYear()} Ngọc Thảo IELTS
        </p>
      </div>
    </div>
  );
}

HomePage.layout = DefaultLayout;
