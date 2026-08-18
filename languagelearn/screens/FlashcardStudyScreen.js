import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { learningService } from '../services/learningService';
import LoadingIndicator from '../Components/LoadingIndicator';

export default function FlashcardStudyScreen({ route, navigation }) {
  const { id } = route.params;
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await learningService.bulkCreateProgress(id);
      } catch {}
      const due = await learningService.getDueFlashcards();
      setCards(due);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <LoadingIndicator message="Đang tải thẻ..." />;
  if (!cards.length) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text>Không có thẻ đến hạn</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text className="text-blue-dark-5 mt-4">Quay lại</Text></TouchableOpacity>
      </View>
    );
  }

  const card = cards[current];
  const front = card.flashcard?.front || card.front || card.word;
  const back = card.flashcard?.back || card.back || card.meaning;
  const next = async (ok) => {
    try { await learningService.reviewFlashcard(card.id, ok); } catch {}
    setFlipped(false);
    if (current + 1 >= cards.length) navigation.goBack();
    else setCurrent(current + 1);
  };

  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      <Text className="text-gray-500 mb-4">{current + 1}/{cards.length}</Text>
      <TouchableOpacity className="bg-white rounded-2xl p-8 min-h-[200px] items-center justify-center" onPress={() => setFlipped(!flipped)}>
        <Text className="text-2xl font-bold text-center">{flipped ? back : front}</Text>
      </TouchableOpacity>
      <View className="flex-row mt-8">
        <TouchableOpacity className="flex-1 bg-red-500 p-4 rounded-xl mr-2" onPress={() => next(false)}>
          <Text className="text-white text-center">Chưa nhớ</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-green-500 p-4 rounded-xl" onPress={() => next(true)}>
          <Text className="text-white text-center">Đã nhớ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
