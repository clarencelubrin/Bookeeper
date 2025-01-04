import { createSlice } from '@reduxjs/toolkit';
import { WidthsSliceInterface } from 'interfaces/Slices/WidthsSliceInterface';

const initialState: WidthsSliceInterface = {
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