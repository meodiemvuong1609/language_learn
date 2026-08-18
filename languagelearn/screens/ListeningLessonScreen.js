import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { learningService } from '../services/learningService';
import LoadingIndicator from '../Components/LoadingIndicator';

export default function ListeningLessonScreen({ route, navigation }) {
  const { id } = route.params;
  const [lesson, setLesson] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    learningService.getAudioLesson(id).then(setLesson).finally(() => setLoading(false));
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, [id]);

  const toggleAudio = async () => {
    const src = lesson?.audio;
    if (!src) {
      Alert.alert('Chưa có audio', 'Bài này chưa có file nghe trên máy chủ.');
      return;
    }
    try {
      if (playing && soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setPlaying(false);
        return;
      }
      await soundRef.current?.unloadAsync().catch(() => {});
      const { sound } = await Audio.Sound.createAsync({ uri: src });
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlaying(false);
        }
      });
      await sound.playAsync();
      setPlaying(true);
    } catch {
      Alert.alert('Lỗi', 'Không phát được audio.');
    }
  };

  if (loading) return <LoadingIndicator message="Đang tải..." />;
  if (!lesson) return <Text className="p-8">Không tìm thấy bài</Text>;

  const exercises = lesson.exercises || [];

  const submit = async () => {
    let correct = 0;
    for (const ex of exercises) {
      const res = await learningService.submitListening(ex.id, answers[ex.id]);
      if (res.is_correct) correct += 1;
    }
    setScore({ correct, total: exercises.length });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 pt-14">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-blue-dark-5 mb-3">← Quay lại</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold">{lesson.title}</Text>
      <TouchableOpacity className="bg-blue-dark-5 p-4 rounded-xl mt-4" onPress={toggleAudio}>
        <Text className="text-white text-center font-semibold">
          {playing ? 'Dừng nghe' : 'Phát audio'}
        </Text>
      </TouchableOpacity>
      <Text className="text-gray-600 mt-2">{lesson.transcript || lesson.description}</Text>
      {exercises.map((ex) => (
        <View key={ex.id} className="bg-white p-3 rounded-xl mt-4">
          <Text className="font-semibold mb-2">{ex.question_text || ex.question}</Text>
          {Object.entries(ex.options || {}).map(([k, v]) => (
            <TouchableOpacity key={k} className="py-2" onPress={() => setAnswers({ ...answers, [ex.id]: k })}>
              <Text className={answers[ex.id] === k ? 'text-blue-dark-5 font-bold' : 'text-gray-800'}>{k}. {v}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      {exercises.length > 0 && !score && (
        <TouchableOpacity className="bg-blue-dark-5 p-4 rounded-xl mt-6" onPress={submit}>
          <Text className="text-white text-center font-semibold">Nộp bài</Text>
        </TouchableOpacity>
      )}
      {score && <Text className="text-center mt-4 font-bold">Kết quả: {score.correct}/{score.total}</Text>}
    </ScrollView>
  );
}
