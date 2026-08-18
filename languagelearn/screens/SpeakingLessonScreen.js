import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { learningService } from '../services/learningService';
import LoadingIndicator from '../Components/LoadingIndicator';

export default function SpeakingLessonScreen({ route, navigation }) {
  const { id } = route.params;
  const [lesson, setLesson] = useState(null);
  const [score, setScore] = useState(70);
  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [uri, setUri] = useState(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const recordingRef = useRef(null);
  const soundRef = useRef(null);

  useEffect(() => {
    learningService.getSpeakingLesson(id).then(setLesson).finally(() => setLoading(false));
    return () => {
      recordingRef.current?.stopAndUnloadAsync().catch(() => {});
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, [id]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Quyền micro', 'Cần quyền micro để ghi âm luyện nói.');
        return;
      }
      await soundRef.current?.unloadAsync().catch(() => {});
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setUri(null);
      setDurationSeconds(0);
      setSaved(null);
      setIsRecording(true);
    } catch {
      Alert.alert('Lỗi', 'Không thể bắt đầu ghi âm.');
    }
  };

  const stopRecording = async () => {
    const rec = recordingRef.current;
    if (!rec) return;
    try {
      const status = await rec.getStatusAsync();
      await rec.stopAndUnloadAsync();
      setDurationSeconds(Math.max(1, Math.round((status.durationMillis || 0) / 1000)));
      setUri(rec.getURI());
    } catch {
      Alert.alert('Lỗi', 'Không dừng được bản ghi.');
    } finally {
      recordingRef.current = null;
      setIsRecording(false);
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    }
  };

  const playRecording = async () => {
    if (!uri) return;
    try {
      await soundRef.current?.unloadAsync().catch(() => {});
      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      await sound.playAsync();
    } catch {
      Alert.alert('Lỗi', 'Không phát được bản ghi.');
    }
  };

  if (loading) return <LoadingIndicator message="Đang tải..." />;
  if (!lesson) return <Text className="p-8">Không tìm thấy bài</Text>;
  const exercise = (lesson.exercises || [])[0];

  const submit = async () => {
    if (!exercise) {
      setSaved({ score, durationSeconds });
      return;
    }
    await learningService.submitSpeaking({
      exercise: exercise.id,
      self_score: score,
      duration_seconds: durationSeconds,
      feedback: uri ? 'Đã ghi âm trên thiết bị' : 'Tự chấm không ghi âm',
    });
    setSaved({ score, durationSeconds });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 pt-14">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-blue-dark-5 mb-3">← Quay lại</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold">{lesson.title}</Text>
      <Text className="text-gray-600 mt-2">{lesson.instruction || lesson.description}</Text>
      {exercise ? <Text className="mt-4 font-semibold">{exercise.prompt || exercise.title}</Text> : null}

      <View className="bg-white rounded-xl p-4 mt-6">
        <Text className="font-semibold mb-3">Ghi âm luyện nói</Text>
        {!isRecording ? (
          <TouchableOpacity className="bg-blue-dark-5 p-4 rounded-xl" onPress={startRecording}>
            <Text className="text-white text-center font-semibold">
              {uri ? 'Thu lại' : 'Bắt đầu ghi âm'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="bg-red-600 p-4 rounded-xl" onPress={stopRecording}>
            <Text className="text-white text-center font-semibold">Dừng ghi âm</Text>
          </TouchableOpacity>
        )}
        {uri && !isRecording ? (
          <View className="mt-3">
            <Text className="text-gray-600 text-center">Độ dài: {durationSeconds}s</Text>
            <TouchableOpacity className="mt-2 bg-gray-100 p-3 rounded-xl" onPress={playRecording}>
              <Text className="text-center text-blue-dark-5 font-semibold">Phát lại</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <Text className="mt-6">Tự chấm: {score}</Text>
      <View className="flex-row mt-2">
        {[40, 60, 80, 100].map((n) => (
          <TouchableOpacity key={n} className="mr-2 px-3 py-2 bg-white rounded-lg" onPress={() => setScore(n)}>
            <Text>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity className="bg-blue-dark-5 p-4 rounded-xl mt-6" onPress={submit}>
        <Text className="text-white text-center font-semibold">Lưu điểm tự chấm</Text>
      </TouchableOpacity>
      {saved ? (
        <Text className="text-center mt-4">
          Đã lưu: {saved.score} {saved.durationSeconds ? `(${saved.durationSeconds}s)` : ''}
        </Text>
      ) : null}
    </ScrollView>
  );
}
