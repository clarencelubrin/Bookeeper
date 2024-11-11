import { INIT_DATA, ADD_ROW, ADD_TABLE, DELETE_ROW, UPDATE_CELL } from './actionTypes';

export const initData = (payload) => ({
    type: INIT_DATA,
    payload,
});

export const addRowData = (payload) => ({
    type: ADD_ROW,
    payload,
});

export const addTableData = (payload) => ({
    type: ADD_TABLE,
    payload,
});

export const deleteRowData = (payload) => ({
    type: DELETE_ROW,
    payload,
});

export const updateCellData = (payload) => ({
    type: UPDATE_CELL,
    payload,
});
