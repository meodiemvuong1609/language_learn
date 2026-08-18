import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { api } from '@/services/api';

export default function SentenceDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getSentenceStructure(id).then((res) => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    const payload = {};
    (data.vocabulary_items || []).forEach((item) => {
      payload[item.id] = answers[item.id] || '';
    });
    try {
      const result = await api.submitSentenceExercise(id, payload);
      setScore({
        correct: result.correct,
        total: result.total,
        percentage: result.percentage,
      });
    } catch {
      setScore({ correct: 0, total: data.vocabulary_items?.length || 0, percentage: 0 });
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Đang tải...</div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Không tìm thấy cấu trúc câu</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/sentence" className="text-moss hover:underline mb-4 inline-block">
          ← Quay lại danh sách
        </Link>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 font-mono">{data.formula}</h1>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Độ khó: {data.difficulty}/3
            </span>
          </div>
          <p className="text-gray-700 mb-4">{data.description}</p>

          {data.example_sentence && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-lg text-gray-800 italic">&ldquo;{data.example_sentence}&rdquo;</p>
              {data.translation && <p className="text-gray-500 mt-2">{data.translation}</p>}
            </div>
          )}

          {data.grammar_notes && (
            <div className="p-4 rounded-lg" style={{ background: 'var(--mist)' }}>
              <h3 className="font-semibold mb-2">Ghi chú ngữ pháp</h3>
              <p className="text-sm">{data.grammar_notes}</p>
            </div>
          )}

          {data.level_details && (
            <span className="inline-block mt-4 px-3 py-1 text-sm" style={{ background: 'var(--mist)', color: 'var(--ink)' }}>
              {data.level_details.name} ({data.level_details.code})
            </span>
          )}
        </div>

        {/* Vocabulary items in sentence */}
        {data.vocabulary_items?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📚 Từ vựng trong câu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.vocabulary_items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-semibold text-gray-900">{item.word}</span>
                    <span className="text-xs text-gray-500 ml-2">({item.part_of_speech})</span>
                  </div>
                  <span className="text-gray-600">{item.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercise: fill in the blank */}
        {data.vocabulary_items?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">✍️ Bài tập: Điền từ</h2>
            {score ? (
              <div className={`p-4 rounded-lg ${score.percentage >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                <p className="text-lg font-semibold">Kết quả: {score.correct}/{score.total} ({score.percentage}%)</p>
              </div>
            ) : (
              <>
                {data.vocabulary_items.map((item, idx) => (
                  <div key={item.id} className="mb-4">
                    <p className="text-gray-700 mb-2">
                      {idx + 1}. {item.word
                        ? item.word.replace(item.word, '__________')
                        : '__________'}
                    </p>
                    <input
                      type="text"
                      value={answers[item.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [item.id]: e.target.value })}
                      placeholder="Nhập đáp án..."
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--moss)]"
                    />
                  </div>
                ))}
                <button
                  onClick={handleSubmit}
                  className="w-full btn btn-primary mt-4"
                >
                  Nộp bài
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

SentenceDetailPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
