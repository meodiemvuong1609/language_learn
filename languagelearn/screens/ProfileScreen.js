import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StatusBar, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentUser, logoutUser } from '../store/userSlice';
import { learningService } from '../services/learningService';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const [stats, setStats] = useState({});
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(loadCurrentUser());
    }
    learningService.getDashboard().then((d) => setStats(d.stats || {})).catch(() => {});
    learningService.getPreferences().then((p) => setDark(!!p.dark_mode)).catch(() => {});
  }, [dispatch, user]);

  const displayName = user?.full_name || user?.username || 'Người dùng';
  const displayEmail = user?.email || '';

  const toggleDark = async () => {
    const next = !dark;
    setDark(next);
    try {
      await learningService.updatePreferences({ dark_mode: next });
    } catch {
      setDark(!next);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      Alert.alert('Lỗi', 'Không đăng xuất được. Thử lại.');
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="bg-red-dark-5 p-3 pt-14">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="flex-row items-center mb-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
          <Text className="text-white text-lg ml-2">Hồ sơ</Text>
        </TouchableOpacity>
        
        <View className="items-center">
          <Image
            source={require('../assets/avatar.png')}
            className="w-20 h-20 rounded-full border-4 border-white"
            resizeMode="cover"
          />
          <Text className="text-white text-xl font-bold mt-2">{displayName}</Text>
          <Text className="text-white text-base opacity-80">{displayEmail}</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Learning Statistics */}
        <View className="flex-row justify-between mx-3 mt-3">
          <View className="bg-white p-3 rounded-xl w-[48%] shadow-sm">
            <View className="items-center">
              <View className="bg-blue-1 p-2 rounded-full">
                <MaterialIcons name="timer" size={24} color="#2563EB" />
              </View>
              <Text className="text-gray-800 mt-2 font-semibold">Thời gian học</Text>
              <Text className="text-2xl font-bold text-blue-dark-5">{stats.vocabulary_count || 0}</Text>
              <Text className="text-sm text-gray-500">từ vựng</Text>
            </View>
          </View>
          <View className="bg-white p-3 rounded-xl w-[48%] shadow-sm">
            <View className="items-center">
              <View className="bg-blue-1 p-2 rounded-full">
                <MaterialIcons name="star" size={24} color="#2563EB" />
              </View>
              <Text className="text-gray-800 mt-2 font-semibold">Điểm số</Text>
              <Text className="text-2xl font-bold text-blue-dark-5">{stats.quiz_count || 0}</Text>
              <Text className="text-sm text-gray-500">quiz</Text>
            </View>
          </View>
        </View>

        {/* Profile Options */}
        <View className="bg-white mt-3 mx-3 rounded-xl p-3 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">Cài đặt tài khoản</Text>

          <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-100" onPress={toggleDark}>
            <View className="bg-blue-1 p-2 rounded-lg">
              <MaterialIcons name="dark-mode" size={24} color="#2563EB" />
            </View>
            <Text className="text-gray-800 text-base ml-2 flex-1">Chế độ tối</Text>
            <Text className="text-gray-500">{dark ? 'Bật' : 'Tắt'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-100">
            <View className="bg-blue-1 p-2 rounded-lg">
              <MaterialIcons name="person" size={24} color="#2563EB" />
            </View>
            <Text className="text-gray-800 text-base ml-2">Thông tin cá nhân</Text>
            <MaterialIcons name="chevron-right" size={24} color="gray" className="ml-auto" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-100">
            <View className="bg-blue-1 p-2 rounded-lg">
              <MaterialIcons name="notifications" size={24} color="#2563EB" />
            </View>
            <Text className="text-gray-800 text-base ml-2">Thông báo</Text>
            <MaterialIcons name="chevron-right" size={24} color="gray" className="ml-auto" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-100">
            <View className="bg-blue-1 p-2 rounded-lg">
              <MaterialIcons name="security" size={24} color="#2563EB" />
            </View>
            <Text className="text-gray-800 text-base ml-2">Bảo mật</Text>
            <MaterialIcons name="chevron-right" size={24} color="gray" className="ml-auto" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-2 border-b border-gray-100">
            <View className="bg-blue-1 p-2 rounded-lg">
              <MaterialIcons name="help" size={24} color="#2563EB" />
            </View>
            <Text className="text-gray-800 text-base ml-2">Trợ giúp</Text>
            <MaterialIcons name="chevron-right" size={24} color="gray" className="ml-auto" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-2">
            <View className="bg-blue-1 p-2 rounded-lg">
              <MaterialIcons name="info" size={24} color="#2563EB" />
            </View>
            <Text className="text-gray-800 text-base ml-2">Về ứng dụng</Text>
            <MaterialIcons name="chevron-right" size={24} color="gray" className="ml-auto" />
          </TouchableOpacity>
        </View>

        {/* Learning History */}
        <View className="bg-white mt-3 mx-3 rounded-xl p-3 shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">Lịch sử học tập</Text>
          
          <View className="flex-row items-center py-2 border-b border-gray-100">
            <View className="bg-blue-1 p-2 rounded-lg">
              <MaterialIcons name="history" size={24} color="#2563EB" />
            </View>
            <View className="ml-2 flex-1">
              <Text className="text-gray-800 text-base">Bài học gần đây</Text>
              <Text className="text-sm text-gray-500">Xem lịch sử học tập của bạn</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="gray" />
          </View>

          <View className="flex-row items-center py-2">
            <View className="bg-blue-1 p-2 rounded-lg">
              <MaterialIcons name="assessment" size={24} color="#2563EB" />
            </View>
            <View className="ml-2 flex-1">
              <Text className="text-gray-800 text-base">Báo cáo tiến độ</Text>
              <Text className="text-sm text-gray-500">Xem thống kê chi tiết</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="gray" />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          className="bg-red-600 mx-3 mb-6 p-3 rounded-xl"
          onPress={handleLogout}
        >
          <Text className="text-white text-center text-lg font-semibold">Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}