import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PlaceholderScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center p-6">
      <Text className="text-xl font-bold text-gray-800 mb-2">{route.name}</Text>
      <Text className="text-gray-500 text-center mb-6">
        Màn hình này chưa được triển khai.
      </Text>
      <TouchableOpacity
        className="bg-blue px-6 py-3 rounded-lg"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-white font-semibold">Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
}
