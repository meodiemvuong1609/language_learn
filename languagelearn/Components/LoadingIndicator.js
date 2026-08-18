import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function LoadingIndicator({ message = 'Đang tải...' }) {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#EF4444" />
      <Text className="mt-2 text-gray-600">{message}</Text>
    </View>
  );
}
