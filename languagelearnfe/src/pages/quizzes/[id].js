import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';

import { api } from '@/services/api';

export default function QuizDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getQuiz(id)
      .then((json) => {
        setQuiz(json);
        setTimeLeft((json.time_limit || 0) * 60);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Timer
  useEffect(() => {
    if (!started || submitted || !timeLeft) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitted]);

  const handleSubmit = async () => {
    if (!quiz?.questions) return;
    const payload = {};
    quiz.questions.forEach((q) => {
      payload[q.id] = answers[q.id];
    });
    try {
      const result = await api.submitQuiz(id, {
        answers: payload,
        time_taken: quiz.time_limit ? quiz.time_limit * 60 - (timeLeft || 0) : 0,
      });
      setScore({
        correct: result.correct,
        total: result.total,
        percentage: result.percentage,
        passed: result.passed,
        results: result.results || [],
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Đang tải quiz...</div>;
  if (!quiz) return <div className="text-center py-20 text-gray-500">Không tìm thấy quiz</div>;

  if (!started && !submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
          <p className="text-gray-600 mb-8">{quiz.description}</p>
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded">📋 Số câu hỏi<strong className="block text-lg">{quiz.questions?.length || 0}</strong></div>
              <div className="p-3 bg-gray-50 rounded">⏱️ Thời gian<strong className="block text-lg">{quiz.time_limit ? `${quiz.time_limit} phút` : 'Không giới hạn'}</strong></div>
              <div className="p-3 bg-gray-50 rounded">🎯 Điểm đạt<strong className="block text-lg">{quiz.passing_score}%</strong></div>
              {quiz.level_details && <div className="p-3 bg-gray-50 rounded">📊 Trình độ<strong className="block text-lg">{quiz.level_details.name}</strong></div>}
            </div>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium"
          >
            Bắt đầu làm bài
          </button>
          <Link href="/quizzes" className="block mt-4 text-gray-500 hover:underline">← Quay lại danh sách quiz</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className={`text-center p-8 rounded-lg shadow mb-8 ${score.passed ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <p className="text-6xl mb-4">{score.passed ? '🎉' : '💪'}</p>
            <h2 className="text-3xl font-bold mb-2">{score.passed ? 'Chúc mừng!' : 'Cố gắng thêm nhé!'}</h2>
            <p className="text-xl">Điểm: {score.correct}/{score.total} ({score.percentage}%)</p>
            <p className="text-sm mt-2">Điểm đạt: {quiz.passing_score}%</p>
          </div>

          {/* Review answers */}
          <div className="space-y-4">
            {score.results.map((r, idx) => (
              <div key={idx} className={`bg-white rounded-lg shadow p-4 ${r.isCorrect ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
                <p className="font-medium text-gray-900 mb-2">{idx + 1}. {r.question}</p>
                <p className={`text-sm ${r.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  Đáp án của bạn: {r.yourAnswer || '(chưa trả lời)'} {r.isCorrect ? '✓' : `✗ (Đáp án đúng: ${r.correctAnswer})`}
                </p>
                {r.explanation && <p className="text-sm text-gray-500 mt-2">📖 {r.explanation}</p>}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center space-x-4">
            <Link href="/quizzes" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg inline-block">
              Làm quiz khác
            </Link>
            <button
              onClick={() => {
                setStarted(false);
                setSubmitted(false);
                setAnswers({});
                setScore(null);
                setTimeLeft(quiz.time_limit * 60);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg"
            >
              Làm lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <div className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-moss'}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-stamp h-2 rounded-full transition-all"
            style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
          />
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {quiz.questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-lg shadow p-6">
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
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== quiz.questions.length}
          className="w-full mt-8 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
        >
          Nộp bài ({Object.keys(answers).length}/{quiz.questions.length})
        </button>
      </div>
    </div>
  );
}

QuizDetailPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
