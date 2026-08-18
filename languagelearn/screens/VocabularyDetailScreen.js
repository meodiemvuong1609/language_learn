import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { learningService } from '../services/learningService';

export default function VocabularyDetailScreen({ route, navigation }) {
  const word = route.params?.word || {};
  const [msg, setMsg] = useState('');

  const review = async (remembered) => {
    try {
      await learningService.reviewWord(word.id, remembered);
      setMsg(remembered ? 'Đã nhớ — đã lưu SRS' : 'Chưa nhớ — sẽ ôn lại sớm');
    } catch {
      setMsg('Không lưu được, thử lại sau');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 pt-14">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-blue-dark-5 mb-4">← Quay lại</Text>
      </TouchableOpacity>
      <Text className="text-3xl font-bold text-gray-900">{word.word}</Text>
      {word.phonetic ? <Text className="text-gray-500 italic mt-1">{word.phonetic}</Text> : null}
      <Text className="text-lg text-gray-800 mt-4">{word.meaning}</Text>
      {word.example_sentence ? (
        <Text className="text-gray-600 mt-3 italic">{word.example_sentence}</Text>
      ) : null}
      <View className="flex-row mt-8 gap-3">
        <TouchableOpacity className="flex-1 bg-red-500 p-4 rounded-xl" onPress={() => review(false)}>
          <Text className="text-white text-center font-semibold">Chưa nhớ</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-green-500 p-4 rounded-xl" onPress={() => review(true)}>
          <Text className="text-white text-center font-semibold">Đã nhớ</Text>
        </TouchableOpacity>
      </View>
      {msg ? <Text className="text-center mt-4 text-gray-600">{msg}</Text> : null}
    </ScrollView>
  );
}
