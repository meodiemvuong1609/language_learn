import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export const tokenService = {
  setToken: async (token) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      return true;
    } catch (error) {
      console.error('Error setting token:', error);
      return false;
    }
  },

  getToken: async () => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  removeToken: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      return true;
    } catch (error) {
      console.error('Error removing token:', error);
      return false;
    }
  },

  hasToken: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  },
};
