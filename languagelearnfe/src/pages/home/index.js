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
    <div className="min-h-screen gradient-login flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-15%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="max-w-5xl w-full relative z-10">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
            <span className="text-4xl">🌍</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
            LanguageLearn
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Nền tảng học tiếng Anh toàn diện với từ vựng, nghe, nói, đọc hiểu và ngữ pháp.
            Bắt đầu hành trình của bạn ngay hôm nay.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { icon: '📚', title: 'Từ vựng thông minh', desc: 'Học từ vựng với thuật toán spaced repetition giúp bạn nhớ lâu hơn.', color: 'blue' },
            { icon: '🎧', title: 'Luyện nghe chuyên sâu', desc: 'Nghe các đoạn hội thoại và bài học giúp cải thiện kỹ năng nghe.', color: 'green' },
            { icon: '🎤', title: 'Luyện nói tự nhiên', desc: 'Thu âm và nhận phản hồi chi tiết về phát âm và ngữ điệu.', color: 'purple' },
            { icon: '📖', title: 'Đọc hiểu nâng cao', desc: 'Đọc các bài học phù hợp trình độ và kiểm tra hiểu biết của bạn.', color: 'emerald' },
            { icon: '✍️', title: 'Ngữ pháp thực hành', desc: 'Nắm vững cấu trúc câu thông qua các bài tập thực tế.', color: 'yellow' },
            { icon: '🗂️', title: 'Flashcard thông minh', desc: 'Tạo bộ thẻ cá nhân và học với hệ thống ôn tập tự động.', color: 'orange' },
          ].map((feature, idx) => (
            <div
              key={feature.title}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all animate-fade-in"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Link
            href="/login"
            className="inline-block bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all mr-4"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="inline-block bg-indigo-700/80 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-indigo-800/80 transition-all backdrop-blur-sm"
          >
            Đăng ký miễn phí
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-12">
          © {new Date().getFullYear()} LanguageLearn. All rights reserved.
        </p>
      </div>
    </div>
  );
}

HomePage.layout = DefaultLayout;
