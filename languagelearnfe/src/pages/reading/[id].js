import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';

import { api } from '@/services/api';

export default function ReadingDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getReadingLesson(id)
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!data?.comprehension_questions) return;
    const payload = {};
    data.comprehension_questions.forEach((q) => {
      payload[q.id] = answers[q.id];
    });
    const result = await api.submitReadingComprehension(id, payload);
    setScore({
      correct: result.correct,
      total: result.total,
      percentage: result.percentage,
      results: result.results,
    });
    setSubmitted(true);
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Đang tải bài đọc...</div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Không tìm thấy bài đọc</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/reading" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Quay lại danh sách
        </Link>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{data.title}</h1>
          {data.description && <p className="text-gray-600 mb-6">{data.description}</p>}

          <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
            <span>📝 {data.word_count} từ</span>
            <span>⏱️ {data.estimated_duration} phút</span>
            {data.level_details && <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded">{data.level_details.name}</span>}
          </div>

          {/* Paragraphs */}
          <div className="prose max-w-none">
            {(data.paragraphs || []).map((para) => (
              <div key={para.id} className="mb-6">
                <p className="text-gray-800 text-lg leading-relaxed">{para.content}</p>
                {para.translation && (
                  <p className="text-gray-500 text-sm mt-2 italic border-l-4 border-blue-200 pl-3">{para.translation}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Comprehension Questions */}
        {data.comprehension_questions?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Câu hỏi đọc hiểu</h2>

            {!submitted ? (
              data.comprehension_questions.map((q, idx) => (
                <div key={q.id} className="mb-8 pb-8 border-b last:border-b-0">
                  <p className="text-lg font-medium text-gray-900 mb-4">
                    {idx + 1}. {q.question_text}
                  </p>
                  <div className="space-y-2">
                    {Object.entries(q.options).map(([key, text]) => (
                      <label key={key} className="flex items-center p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={key}
                          checked={answers[q.id] === key}
                          onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{key}. {text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className={`p-6 rounded-lg mb-6 ${score.percentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                <p className="text-xl font-bold">Kết quả: {score.correct}/{score.total} ({score.percentage}%)</p>
              </div>
            )}

            {!submitted && (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== data.comprehension_questions.length}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                Nộp bài
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

ReadingDetailPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
