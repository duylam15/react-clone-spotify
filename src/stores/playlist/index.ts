import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerSlice";
import songReducer from "./songSlice";

const store = configureStore({
    reducer: {
        player: playerReducer,
        songs: songReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
