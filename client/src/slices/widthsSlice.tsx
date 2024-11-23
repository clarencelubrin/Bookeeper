import { createSlice } from '@reduxjs/toolkit';
import { widthsSliceInterface } from 'interfaces/widthsSliceInterface';

const initialState: widthsSliceInterface = {
    content: {},
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