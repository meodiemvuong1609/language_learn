import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { learningService } from '../services/learningService';
import LoadingIndicator from '../Components/LoadingIndicator';

export default function ReadingScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    learningService.getReadingLessons().then(setItems).finally(() => setLoading(false));
  }, []);
  if (loading) return <LoadingIndicator message="Đang tải bài đọc..." />;
  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      <Text className="text-2xl font-bold mb-4">📖 Đọc hiểu</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text className="text-gray-500">Chưa có bài đọc</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-white p-4 rounded-xl mb-3" onPress={() => navigation.navigate('ReadingLesson', { id: item.id })}>
            <Text className="font-bold">{item.title}</Text>
            <Text className="text-gray-500 mt-1" numberOfLines={2}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
