import { Artist } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface artistState {
    currentArtist: Artist | null;
}

const initialState: artistState = {
    currentArtist: null,
};

const artistSlice = createSlice({
    name: "artist",
    initialState,
    reducers: {
        setCurrentArtist: (state, action: PayloadAction<Artist>) => {
            state.currentArtist = action.payload;
        },
    },
});

export const { setCurrentArtist } = artistSlice.actions;
export default artistSlice.reducer;
