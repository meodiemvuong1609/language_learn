import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ErrorState({ message = 'Đã có lỗi xảy ra', onRetry }) {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <MaterialIcons name="error-outline" size={64} color="#EF4444" />
      <Text className="mt-4 text-xl font-bold text-gray-800">
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="mt-4 bg-red-dark-5 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Thử lại</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
