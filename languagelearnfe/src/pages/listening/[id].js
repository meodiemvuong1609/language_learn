import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';

import { api } from '@/services/api';

export default function ListeningDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.getAudioLesson(id),
      api.getListeningExercises({ lesson: id }),
    ])
      .then(([lessonRes, exRes]) => {
        setData(lessonRes);
        const nested = lessonRes.exercises || [];
        setExercises(exRes.results || nested);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    let correct = 0;
    for (const ex of exercises) {
      const answer = answers[ex.id];
      const res = await api.submitListeningAnswer(ex.id, answer);
      if (res.is_correct) correct += 1;
    }
    const total = exercises.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    setScore({ correct, total, percentage: pct });
    setSubmitted(true);
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Đang tải bài nghe...</div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Không tìm thấy bài học</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/listening" className="text-blue-600 hover:underline mb-4 inline-block">← Quay lại danh sách</Link>

        {/* Audio Player */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{data.title}</h1>
          {data.description && <p className="text-gray-600 mb-4">{data.description}</p>}
          <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
            {data.audio ? (
              <audio controls src={data.audio} className="w-full">
                Trình duyệt của bạn không hỗ trợ audio.
              </audio>
            ) : (
              <div className="text-center text-gray-500">
                <span className="text-5xl block mb-2">🎵</span>
                <p>Audio demo placeholder</p>
                <p className="text-sm">Trong thực tế, file audio sẽ được phát từ đây</p>
              </div>
            )}
          </div>
          {data.level_details && (
            <span className="inline-block mt-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
              {data.level_details.name} ({data.level_details.code})
            </span>
          )}
          {data.duration && (
            <span className="inline-block mt-4 ml-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
              ⏱️ {Math.floor(data.duration / 60)}:{(data.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Transcript (nếu có) */}
        {data.transcript && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📄 Bản ghi (Transcript)</h2>
            <p className="text-gray-800 whitespace-pre-line">{data.transcript}</p>
          </div>
        )}

        {/* Exercises */}
        {exercises.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">✍️ Bài tập</h2>

            {!submitted ? (
              exercises.map((ex, idx) => (
                <div key={ex.id} className="mb-6 pb-6 border-b last:border-b-0">
                  <p className="text-lg font-medium text-gray-900 mb-3">
                    {idx + 1}. {ex.question_text || ex.question}
                  </p>
                  <div className="space-y-2">
                    {ex.options && Object.entries(ex.options).map(([key, text]) => (
                      <label key={key} className="flex items-center p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name={`ex-${ex.id}`}
                          value={key}
                          checked={answers[ex.id] === key}
                          onChange={(e) => setAnswers({ ...answers, [ex.id]: e.target.value })}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{key}. {text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className={`p-4 rounded-lg mb-6 ${score.percentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                <p className="text-xl font-bold">Kết quả: {score.correct}/{score.total} ({score.percentage}%)</p>
              </div>
            )}

            {!submitted && (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== exercises.length}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                Nộp bài ({Object.keys(answers).length}/{exercises.length})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

ListeningDetailPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
