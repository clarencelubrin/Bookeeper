import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    content: null,
};

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        initData: (state, action) => {
            state.content = action.payload;
        },
        addRowData: (state, action) => {
            state.content = action.payload;
        },
        addTableData: (state, action) => {
            state.content = action.payload;
        },
        deleteRowData: (state, action) => {
            state.content = action.payload;
        },
        updateCellData: (state, action) => {
            state.content = action.payload;
        },
    },
});

export const { initData, addRowData, addTableData, deleteRowData, updateCellData } = dataSlice.actions;
export default dataSlice.reducer;