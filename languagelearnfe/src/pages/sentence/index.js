import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function SentenceListPage() {
  const [structures, setStructures] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [sRes, lRes] = await Promise.all([
          api.getSentenceStructures(),
          api.getLevels(),
        ]);
        setStructures(sRes.results || []);
        setLevels(lRes.results || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = selectedLevel
    ? structures.filter(s => s.level === parseInt(selectedLevel))
    : structures;

  return (
    <div className="min-h-screen" style={{ background: 'var(--gray-50)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6 animate-fade-in" style={{ color: 'var(--gray-900)' }}>
          ✍️ Ngữ pháp - Cấu trúc câu
        </h1>

        <div className="mb-6 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="input max-w-xs"
          >
            <option value="">Tất cả trình độ</option>
            {levels.map(l => (
              <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
            ))}
          </select>
        </div>

        {loading ? (
          <LoadingIndicator message="Đang tải..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
            {filtered.map(s => (
              <Link key={s.id} href={`/sentence/${s.id}`}>
                <div className="card card-interactive p-6 cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold font-mono" style={{ color: 'var(--gray-900)' }}>{s.formula}</h3>
                    <span className="badge badge-warning">{s.difficulty}/3</span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--gray-600)' }}>{s.description}</p>
                  {s.example_sentence && (
                    <div className="p-3 rounded-lg mb-3" style={{ background: 'var(--gray-50)' }}>
                      <p className="text-sm italic" style={{ color: 'var(--gray-800)' }}>{s.example_sentence}</p>
                      {s.translation && (
                        <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>{s.translation}</p>
                      )}
                    </div>
                  )}
                  {s.level_details && (
                    <span className="badge badge-primary">{s.level_details.code} - {s.level_details.name}</span>
                  )}
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="text-5xl mb-4 opacity-60">✍️</div>
                <p className="font-medium" style={{ color: 'var(--gray-600)' }}>Chưa có cấu trúc câu nào</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

SentenceListPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
