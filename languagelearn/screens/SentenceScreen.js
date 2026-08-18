import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { learningService } from '../services/learningService';
import LoadingIndicator from '../Components/LoadingIndicator';

export default function SentenceScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    learningService.getSentences().then(setItems).finally(() => setLoading(false));
  }, []);
  if (loading) return <LoadingIndicator message="Đang tải ngữ pháp..." />;
  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      <Text className="text-2xl font-bold mb-4">✍️ Ngữ pháp</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text className="text-gray-500">Chưa có cấu trúc câu</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-white p-4 rounded-xl mb-3" onPress={() => navigation.navigate('SentenceDetail', { id: item.id })}>
            <Text className="font-mono font-bold">{item.formula || item.pattern}</Text>
            <Text className="text-gray-500 mt-1" numberOfLines={2}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
