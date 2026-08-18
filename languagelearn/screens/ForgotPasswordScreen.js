import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const submit = async () => {
    try {
      await api.post('/auth/forgot-password/', { email });
      Alert.alert('Đã gửi', 'Nếu email tồn tại, bạn sẽ nhận hướng dẫn đặt lại mật khẩu');
      navigation.goBack();
    } catch {
      Alert.alert('Lỗi', 'Không gửi được yêu cầu');
    }
  };

  return (
    <View className="flex-1 bg-gray-50 pt-16 px-6">
      <Text className="text-2xl font-bold mb-4">Quên mật khẩu</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 bg-white"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TouchableOpacity className="bg-blue-dark-5 p-4 rounded-xl mt-6" onPress={submit}>
        <Text className="text-white text-center font-semibold">Gửi hướng dẫn</Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-4" onPress={() => navigation.goBack()}>
        <Text className="text-blue-dark-5 text-center">← Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}
