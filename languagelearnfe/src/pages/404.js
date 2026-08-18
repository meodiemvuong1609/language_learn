import Link from 'next/link';
import DefaultLayout from '@/components/layout/DefaultLayout';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl mb-4">🔍</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Không tìm thấy trang</h1>
        <p className="text-gray-600 mb-8">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/home" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}

Custom404.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
