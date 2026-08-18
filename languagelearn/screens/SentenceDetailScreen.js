import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { learningService } from '../services/learningService';
import LoadingIndicator from '../Components/LoadingIndicator';

export default function SentenceDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    learningService.getSentence(id).then(setData).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingIndicator message="Đang tải..." />;
  if (!data) return <Text className="p-8">Không tìm thấy</Text>;

  const submit = async () => {
    const result = await learningService.submitSentence(id, answers);
    setScore(result);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 pt-14">
      <TouchableOpacity onPress={() => navigation.goBack()}><Text className="text-blue-dark-5 mb-3">← Quay lại</Text></TouchableOpacity>
      <Text className="text-xl font-mono font-bold">{data.formula}</Text>
      <Text className="text-gray-700 mt-2">{data.description}</Text>
      {data.example_sentence ? <Text className="italic mt-3">{data.example_sentence}</Text> : null}
      {(data.vocabulary_items || []).map((item) => (
        <View key={item.id} className="mt-4">
          <Text className="text-gray-600">{item.meaning}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mt-1 bg-white"
            value={answers[item.id] || ''}
            onChangeText={(t) => setAnswers({ ...answers, [item.id]: t })}
            placeholder="Điền từ"
          />
        </View>
      ))}
      {!score && (data.vocabulary_items || []).length > 0 && (
        <TouchableOpacity className="bg-blue-dark-5 p-4 rounded-xl mt-6" onPress={submit}>
          <Text className="text-white text-center font-semibold">Nộp bài</Text>
        </TouchableOpacity>
      )}
      {score ? <Text className="text-center mt-4 font-bold">{score.correct}/{score.total} ({score.percentage}%)</Text> : null}
    </ScrollView>
  );
}
