import { createSlice } from '@reduxjs/toolkit';
import { FileSliceInterface } from 'interfaces/Slices/FileSliceInterface';

const initialState: FileSliceInterface = {
    content: {},
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