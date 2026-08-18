import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function CategorySelector({ categories, selectedId, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 px-3"
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onSelect(category.id)}
          className={`mr-3 px-4 py-2 rounded-full ${
            selectedId === category.id ? 'bg-red-dark-5' : 'bg-white'
          }`}
        >
          <View className="flex-row items-center">
            <MaterialIcons
              name={category.icon}
              size={20}
              color={selectedId === category.id ? 'white' : '#2563EB'}
            />
            <Text
              className={`ml-2 font-semibold ${
                selectedId === category.id
                  ? 'text-white'
                  : 'text-gray-800'
              }`}
            >
              {category.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
