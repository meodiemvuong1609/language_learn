import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { learningService } from '../services/learningService';
import { vocabularyService } from '../services/vocabularyService';
import LoadingIndicator from '../Components/LoadingIndicator';

export default function ReviewScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      let due = await learningService.getDueVocabulary();
      due = due.map((r) => r.vocabulary || r).filter((w) => w?.word);
      if (!due.length) {
        const all = await vocabularyService.getAllVocabularies();
        due = all.results || [];
      }
      setCards(due);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingIndicator message="Đang tải ôn tập..." />;
  if (done || !cards.length) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-bold mb-4">{cards.length ? 'Hoàn thành!' : 'Chưa có từ để ôn'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text className="text-blue-dark-5">Về trang chủ</Text></TouchableOpacity>
      </View>
    );
  }

  const card = cards[current];
  const next = async (ok) => {
    try { await learningService.reviewWord(card.id, ok); } catch {}
    setFlipped(false);
    if (current + 1 >= cards.length) setDone(true);
    else setCurrent(current + 1);
  };

  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      <Text className="text-lg text-gray-500 mb-4">{current + 1}/{cards.length}</Text>
      <TouchableOpacity className="bg-white rounded-2xl p-8 min-h-[220px] items-center justify-center" onPress={() => setFlipped(!flipped)}>
        <Text className="text-3xl font-bold text-center">{flipped ? card.meaning : card.word}</Text>
        <Text className="text-gray-400 mt-4">Chạm để lật</Text>
      </TouchableOpacity>
      <View className="flex-row mt-8">
        <TouchableOpacity className="flex-1 bg-red-500 p-4 rounded-xl mr-2" onPress={() => next(false)}>
          <Text className="text-white text-center font-semibold">Chưa nhớ</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-green-500 p-4 rounded-xl" onPress={() => next(true)}>
          <Text className="text-white text-center font-semibold">Đã nhớ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
