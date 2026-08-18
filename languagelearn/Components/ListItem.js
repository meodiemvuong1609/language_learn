import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ListItem({
  title,
  subtitle,
  leftIcon,
  rightElement,
  onPress,
  className = '',
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white p-3 rounded-xl mb-3 shadow-sm flex-row items-start ${className}`}
      disabled={!onPress}
    >
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800">{title}</Text>
        {subtitle && (
          <Text className="text-gray-600 mt-1">{subtitle}</Text>
        )}
      </View>
      {rightElement}
      {onPress && (
        <View className="ml-2 justify-center">
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </View>
      )}
    </TouchableOpacity>
  );
}
