import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    content: null,
};

export const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        setFiles: (state, action) => {
            state.content = action.payload;
        },
    },
});

export const { setFiles } = fileSlice.actions;
export default fileSlice.reducer;