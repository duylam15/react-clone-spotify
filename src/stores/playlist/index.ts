import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import songReducer from './songSlice';
import artistReducer from './artistSlice';
import currentSongSlice from './actions';

const initialState = {
  sidebarShow: true,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    set: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { set } = uiSlice.actions;

const store = configureStore({
  reducer: {
    player: playerReducer,
    ui: uiSlice.reducer,
    songs: songReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;