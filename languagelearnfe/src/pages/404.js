import Link from 'next/link';
import DefaultLayout from '@/components/layout/DefaultLayout';

export default function Custom404() {
  return (
    <div className="min-h-screen auth-canvas flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 — Không tìm thấy trang</h1>
        <p className="mb-8" style={{ color: 'var(--muted)' }}>Trang bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/" className="btn btn-primary">
          Quay về trang giới thiệu
        </Link>
      </div>
    </div>
  );
}

Custom404.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
