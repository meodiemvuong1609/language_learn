import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { learningService } from '../services/learningService';
import LoadingIndicator from '../Components/LoadingIndicator';

export default function TestDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    learningService.getQuiz(id).then(setQuiz).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingIndicator message="Đang tải..." />;
  if (!quiz) return <Text className="p-8">Không tìm thấy quiz</Text>;

  const submit = async () => {
    const result = await learningService.submitQuiz(id, answers);
    setScore(result);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 pt-14">
      <TouchableOpacity onPress={() => navigation.goBack()}><Text className="text-blue-dark-5 mb-3">← Quay lại</Text></TouchableOpacity>
      <Text className="text-2xl font-bold">{quiz.title}</Text>
      {(quiz.questions || []).map((q) => (
        <View key={q.id} className="bg-white p-3 rounded-xl mt-4">
          <Text className="font-semibold mb-2">{q.question_text}</Text>
          {Object.entries(q.options || {}).map(([k, v]) => (
            <TouchableOpacity key={k} className="py-2" onPress={() => setAnswers({ ...answers, [q.id]: k })}>
              <Text className={answers[q.id] === k ? 'text-blue-dark-5 font-bold' : 'text-gray-800'}>{k}. {v}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      {!score && (
        <TouchableOpacity className="bg-blue-dark-5 p-4 rounded-xl mt-6" onPress={submit}>
          <Text className="text-white text-center font-semibold">Nộp bài</Text>
        </TouchableOpacity>
      )}
      {score ? <Text className="text-center mt-4 font-bold">{score.correct}/{score.total} ({score.percentage}%)</Text> : null}
    </ScrollView>
  );
}
