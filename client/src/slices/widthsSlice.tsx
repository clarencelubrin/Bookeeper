import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    content: null,
};

export const widthsSlice = createSlice({
    name: 'widths',
    initialState,
    reducers: {
        setWidths: (state, action) => {
            state.content = action.payload;
        },
    },
});

export const { setWidths } = widthsSlice.actions;
export default widthsSlice.reducer;