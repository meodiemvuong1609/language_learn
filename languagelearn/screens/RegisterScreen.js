import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { authService } from '../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        username,
        email,
        password,
      });
      Alert.alert(
        'Success',
        'Registration successful! Please log in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message ||
          error.response?.data?.detail ||
          'Please try again with different credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Create Account</Text>
          <Text className="text-gray-600">Join us to start learning</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2">Username</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl p-3">
              <MaterialIcons name="person" size={24} color="gray" />
              <TextInput
                className="flex-1 ml-2 text-gray-800"
                placeholder="Choose a username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Email</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl p-3">
              <MaterialIcons name="email" size={24} color="gray" />
              <TextInput
                className="flex-1 ml-2 text-gray-800"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Password</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl p-3">
              <MaterialIcons name="lock" size={24} color="gray" />
              <TextInput
                className="flex-1 ml-2 text-gray-800"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Confirm Password</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl p-3">
              <MaterialIcons name="lock" size={24} color="gray" />
              <TextInput
                className="flex-1 ml-2 text-gray-800"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            className="bg-red-dark-5 p-4 rounded-xl mt-4"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4"
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-red-dark-5 text-center">
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen; 