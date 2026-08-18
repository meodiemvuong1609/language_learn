import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import vocabularyReducer from './vocabularySlice';
import listeningReducer from './listeningSlice';
import speakingReducer from './speakingSlice';
import progressReducer from './progressSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    vocabulary: vocabularyReducer,
    listening: listeningReducer,
    speaking: speakingReducer,
    progress: progressReducer,
  },
});

export default store;
