import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { learningService } from '../services/learningService';
import LoadingIndicator from '../Components/LoadingIndicator';

export default function FlashcardScreen({ navigation }) {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    learningService.getMyDecks().then(setDecks).finally(() => setLoading(false));
  }, []);
  if (loading) return <LoadingIndicator message="Đang tải flashcard..." />;
  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      <Text className="text-2xl font-bold mb-4">🗂️ Flashcard</Text>
      <FlatList
        data={decks}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text className="text-gray-500">Chưa có bộ thẻ</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-white p-4 rounded-xl mb-3" onPress={() => navigation.navigate('FlashcardStudy', { id: item.id })}>
            <Text className="font-bold">{item.name || item.title}</Text>
            <Text className="text-gray-500 mt-1">{item.card_count || 0} thẻ</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
