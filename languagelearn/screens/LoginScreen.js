import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { loginAndLoadUser } from '../store/userSlice';

const Logo = () => (
  <View className="w-24 h-24 mb-4 bg-red-dark-5 rounded-full items-center justify-center">
    <MaterialIcons name="translate" size={48} color="white" />
  </View>
);

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      await dispatch(loginAndLoadUser({ username, password })).unwrap();
    } catch (error) {
      Alert.alert(
        'Đăng nhập thất bại',
        typeof error === 'string' ? error : 'Kiểm tra lại tài khoản và mật khẩu'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1"
          contentContainerClassName="flex-grow"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-8">
            {/* Logo and Welcome Text */}
            <View className="items-center mb-8">
              <Logo />
              <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</Text>
              <Text className="text-gray-600 text-center text-base">
                Sign in to continue learning and improve your language skills
              </Text>
            </View>

            {/* Login Form */}
            <View className="space-y-4">
              {/* Username Input */}
              <View>
                <Text className="text-gray-700 mb-1.5 font-medium">Username</Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <MaterialIcons name="person" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="username"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 mb-1.5 font-medium">Password</Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <MaterialIcons name="lock" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-1"
                  >
                    <MaterialIcons 
                      name={showPassword ? "visibility-off" : "visibility"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity 
                className="self-end"
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text className="text-red-dark-5 font-medium">Quên mật khẩu?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                className="bg-red-dark-5 p-3 rounded-xl mt-2"
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-base">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              {/* Social Login */}
              <View className="mt-6">
                <View className="flex-row items-center mb-3">
                  <View className="flex-1 h-[1px] bg-gray-300" />
                  <Text className="mx-3 text-gray-500 text-sm">Hoặc tiếp tục với</Text>
                  <View className="flex-1 h-[1px] bg-gray-300" />
                </View>

                <View className="flex-row justify-center space-x-3">
                  <TouchableOpacity className="bg-gray-50 p-2.5 rounded-full border border-gray-200">
                    <MaterialIcons name="g-translate" size={20} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-gray-50 p-2.5 rounded-full border border-gray-200">
                    <MaterialIcons name="facebook" size={20} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-gray-50 p-2.5 rounded-full border border-gray-200">
                    <MaterialIcons name="apple" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Link */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600 text-sm">Chưa có tài khoản? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text className="text-red-dark-5 font-semibold text-sm">Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;