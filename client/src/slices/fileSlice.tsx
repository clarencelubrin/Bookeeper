import { createSlice } from '@reduxjs/toolkit';
import { fileSliceInterface } from 'interfaces/fileSliceInterface';

const initialState: fileSliceInterface = {
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