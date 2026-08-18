import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchVocabularies } from '../store/vocabularySlice';
import CategorySelector from '../Components/CategorySelector';
import LoadingIndicator from '../Components/LoadingIndicator';
import ErrorState from '../Components/ErrorState';

const LEVELS = [
  { id: 'all', name: 'Tất cả', icon: 'grid-view' },
  { id: 'A1', name: 'A1' },
  { id: 'A2', name: 'A2' },
  { id: 'B1', name: 'B1' },
  { id: 'B2', name: 'B2' },
];

export default function VocabularyScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.vocabulary);

  useEffect(() => {
    dispatch(fetchVocabularies());
  }, [dispatch]);

  const getDisplayLevel = (item) => {
    if (selectedLevel === 'all') return true;
    return item.level_details?.code === selectedLevel;
  };

  const filteredVocabularies = items.filter((vocab) => {
    const matchesSearch =
      !searchQuery ||
      vocab.word?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vocab.meaning?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = getDisplayLevel(vocab);
    return matchesSearch && matchesLevel;
  });

  const renderVocabularyItem = ({ item }) => (
    <TouchableOpacity
      className="bg-white p-3 rounded-xl mb-3 shadow-sm"
      onPress={() => navigation.navigate('VocabularyDetail', { word: item })}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.word}</Text>
          <Text className="text-gray-600 mt-1">{item.meaning}</Text>
          {item.phonetic && (
            <Text className="text-sm text-gray-500 mt-2 italic">
              {item.phonetic}
            </Text>
          )}
          {item.example_sentence && (
            <Text className="text-sm text-gray-500 mt-2">
              {item.example_sentence}
            </Text>
          )}
        </View>
        {item.audio && (
          <View className="bg-blue-1 p-2 rounded-lg">
            <MaterialIcons name="volume-up" size={24} color="#2563EB" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingIndicator message="Đang tải từ vựng..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => dispatch(fetchVocabularies())}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-red-dark-5 p-3 pt-14">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Từ vựng</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="mx-3 mt-3">
        <View className="flex-row items-center bg-white rounded-xl p-2 shadow-sm">
          <MaterialIcons name="search" size={24} color="gray" />
          <TextInput
            placeholder="Tìm kiếm từ vựng..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-gray-800"
          />
        </View>
      </View>

      {/* Level Filter */}
      <CategorySelector
        categories={LEVELS}
        selectedId={selectedLevel}
        onSelect={setSelectedLevel}
      />

      {/* Vocabulary List */}
      {filteredVocabularies.length === 0 ? (
        <View className="mt-10 items-center">
          <Text className="text-gray-500 text-base">
            Không tìm thấy từ vựng nào
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredVocabularies}
          renderItem={renderVocabularyItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="p-3"
        />
      )}
    </View>
  );
}
