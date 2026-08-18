import './global.css';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store/store';
import { loadCurrentUser } from './store/userSlice';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import VocabularyScreen from './screens/VocabularyScreen';
import VocabularyDetailScreen from './screens/VocabularyDetailScreen';
import SentenceScreen from './screens/SentenceScreen';
import SentenceDetailScreen from './screens/SentenceDetailScreen';
import ListeningScreen from './screens/ListeningScreen';
import ListeningLessonScreen from './screens/ListeningLessonScreen';
import SpeakingScreen from './screens/SpeakingScreen';
import SpeakingLessonScreen from './screens/SpeakingLessonScreen';
import ReviewScreen from './screens/ReviewScreen';
import TestScreen from './screens/TestScreen';
import TestDetailScreen from './screens/TestDetailScreen';
import ReadingScreen from './screens/ReadingScreen';
import ReadingLessonScreen from './screens/ReadingLessonScreen';
import FlashcardScreen from './screens/FlashcardScreen';
import FlashcardStudyScreen from './screens/FlashcardStudyScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    dispatch(loadCurrentUser());
  }, [dispatch]);

  if (loading && user === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
          <Stack.Screen name="VocabularyDetail" component={VocabularyDetailScreen} />
          <Stack.Screen name="Sentence" component={SentenceScreen} />
          <Stack.Screen name="SentenceDetail" component={SentenceDetailScreen} />
          <Stack.Screen name="Listening" component={ListeningScreen} />
          <Stack.Screen name="ListeningLesson" component={ListeningLessonScreen} />
          <Stack.Screen name="Speaking" component={SpeakingScreen} />
          <Stack.Screen name="SpeakingLesson" component={SpeakingLessonScreen} />
          <Stack.Screen name="Review" component={ReviewScreen} />
          <Stack.Screen name="Test" component={TestScreen} />
          <Stack.Screen name="TestDetail" component={TestDetailScreen} />
          <Stack.Screen name="Reading" component={ReadingScreen} />
          <Stack.Screen name="ReadingLesson" component={ReadingLessonScreen} />
          <Stack.Screen name="Flashcard" component={FlashcardScreen} />
          <Stack.Screen name="FlashcardStudy" component={FlashcardStudyScreen} />
            </>
          ) : (
            <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
