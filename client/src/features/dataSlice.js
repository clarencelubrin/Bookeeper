import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    content: null,
};

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.content = action.payload;
        },
    },
});

export const { setData } = dataSlice.actions;
export default dataSlice.reducer;