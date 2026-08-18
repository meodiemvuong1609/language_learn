import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-8 mt-auto" style={{ background: 'var(--ink)', color: '#d8cebf' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-3" style={{ color: '#fff' }}>Ngọc Thảo IELTS</h3>
            <p className="text-sm text-gray-400">
              Luyện IELTS online từ Thanh Hóa — THPT và sinh viên.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              <li><Link href="/vocabulary" className="hover:text-white">Từ vựng</Link></li>
              <li><Link href="/listening" className="hover:text-white">Luyện nghe</Link></li>
              <li><Link href="/quizzes" className="hover:text-white">Quiz</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/profile" className="hover:text-white">Hồ sơ</Link></li>
              <li><span className="text-gray-500">Zalo: 0866 062 701</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Ngọc Thảo IELTS
        </div>
      </div>
    </footer>
  );
}
