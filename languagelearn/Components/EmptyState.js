import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function EmptyState({
  icon = 'inbox',
  title = 'Chưa có dữ liệu',
  subtitle = 'Hãy quay lại sau',
  actionLabel,
  onAction,
}) {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <MaterialIcons name={icon} size={64} color="#9CA3AF" />
      <Text className="mt-4 text-xl font-bold text-gray-800">{title}</Text>
      {subtitle && (
        <Text className="mt-2 text-gray-600 text-center">{subtitle}</Text>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="mt-4 bg-red-dark-5 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
