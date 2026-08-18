import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DefaultLayout from '@/components/layout/DefaultLayout';

import { api } from '@/services/api';
import { useToast } from '@/components/Toast';

export default function SpeakingDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startedAtRef = useRef(0);
  const [durationSeconds, setDurationSeconds] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.getSpeakingLesson(id),
      api.getPronunciationPatterns(),
      api.getSpeakingExercises({ lesson: id }),
    ])
      .then(([lessonRes, patternRes, exRes]) => {
        setData(lessonRes);
        setPatterns(patternRes.results || []);
        setExercises(exRes.results || lessonRes.exercises || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      startedAtRef.current = Date.now();
      setDurationSeconds(0);
      setRecording(true);
      setSubmitted(false);
      setScore(null);
    } catch {
      addToast('Không thể truy cập microphone. Vui lòng cấp quyền.', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setDurationSeconds(Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)));
      setRecording(false);
    }
  };

  const [selfScore, setSelfScore] = useState(70);

  const handleSubmit = async () => {
    const exerciseId = exercises[0]?.id;
    let resultScore = selfScore;
    if (exerciseId) {
      try {
        await api.submitSpeakingSelfScore({
          exercise: exerciseId,
          self_score: selfScore,
          duration_seconds: durationSeconds,
          feedback: selectedPattern ? `Pattern: ${selectedPattern.pattern}` : '',
        });
      } catch (e) {
        console.error(e);
      }
    }
    const passed = resultScore >= 60;
    setScore({
      score: resultScore,
      max_score: 100,
      percentage: resultScore,
      passed,
      feedback: passed
        ? 'Đã lưu điểm tự chấm. Hãy tiếp tục luyện tập.'
        : 'Cần luyện thêm. Hãy nghe lại mẫu và thử lại.',
    });
    setSubmitted(true);
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Đang tải bài học...</div>;
  if (!data) return <div className="text-center py-20 text-gray-500">Không tìm thấy bài học</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/speaking" className="text-blue-600 hover:underline mb-4 inline-block">← Quay lại danh sách</Link>

        {/* Lesson header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{data.title}</h1>
          {data.description && <p className="text-gray-600 mb-4">{data.description}</p>}
          <div className="flex items-center space-x-4">
            {data.level_details && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                {data.level_details.name} ({data.level_details.code})
              </span>
            )}
            {data.difficulty && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                Độ khó: {data.difficulty}/5
              </span>
            )}
          </div>

          {/* Tip */}
          {data.tip && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">💡 <strong>Mẹo:</strong> {data.tip}</p>
            </div>
          )}
        </div>

        {/* Pronunciation Patterns */}
        {patterns.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔊 Mẫu phát âm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {patterns.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPattern(p)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedPattern?.id === p.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <p className="font-mono font-semibold text-gray-900">{p.pattern}</p>
                  {p.description && <p className="text-sm text-gray-600 mt-1">{p.description}</p>}
                  {p.example_words?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">Ví dụ: {p.example_words.join(', ')}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recording Area */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🎤 Luyện phát âm</h2>

          {selectedPattern && (
            <div className="mb-4 p-4 bg-purple-50 rounded-lg">
              <p className="font-mono text-lg font-semibold text-purple-900">{selectedPattern.pattern}</p>
              {selectedPattern.description && <p className="text-sm text-purple-700 mt-1">{selectedPattern.description}</p>}
            </div>
          )}

          <div className="text-center">
            {!audioURL ? (
              <div>
                {!recording ? (
                  <button
                    onClick={startRecording}
                    className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-lg rounded-full font-medium shadow-lg"
                  >
                    <span className="text-2xl mr-2">🎙️</span> Bắt đầu ghi âm
                  </button>
                ) : (
                  <div>
                    <p className="text-red-600 font-medium mb-4 animate-pulse">🔴 Đang ghi âm...</p>
                    <button
                      onClick={stopRecording}
                      className="inline-flex items-center px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-lg rounded-full font-medium"
                    >
                      ⏹️ Dừng ghi âm
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <audio controls src={audioURL} className="w-full max-w-md mx-auto mb-4" />
                {!submitted ? (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Tự chấm điểm: {selfScore}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selfScore}
                      onChange={(e) => setSelfScore(Number(e.target.value))}
                      className="w-full max-w-md mx-auto mb-4"
                    />
                    <button
                      onClick={handleSubmit}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium mr-3"
                    >
                      📤 Gửi phát âm
                    </button>
                    <button
                      onClick={startRecording}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium"
                    >
                      🔄 Thu lại
                    </button>
                  </div>
                ) : (
                  <div className={`mt-4 p-4 rounded-lg ${score.passed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    <p className="text-xl font-bold">Điểm: {score.score}/{score.max_score} ({score.percentage}%)</p>
                    <p className="mt-1">{score.feedback}</p>
                    <button
                      onClick={() => { setAudioURL(null); setSubmitted(false); setScore(null); }}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                    >
                      Luyện lại
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Exercises */}
          {exercises.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Bài tập thêm</h3>
              <div className="space-y-4">
                {exercises.map((ex, idx) => (
                  <div key={ex.id} className="p-4 border rounded-lg">
                    <p className="text-gray-900 mb-2">{idx + 1}. {ex.title || ex.prompt || ex.question_text}</p>
                    {ex.instruction && <p className="text-sm text-gray-500 mb-3">{ex.instruction}</p>}
                    {ex.example_sentence && (
                      <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">{ex.example_sentence}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

SpeakingDetailPage.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{page}</DefaultLayout>
    </ProtectedRoute>
  );
};
