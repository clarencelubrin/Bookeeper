import { INIT_DATA, ADD_ROW, ADD_TABLE, DELETE_ROW, UPDATE_CELL } from './actionTypes';

interface InitDataAction {
    type: typeof INIT_DATA;
    payload: any;
}
interface AddRowAction {
    type: typeof ADD_ROW;
    payload: any;
}
interface AddTableAction {
    type: typeof ADD_TABLE;
    payload: any;
}
interface DeleteRowAction {
    type: typeof DELETE_ROW;
    payload: any;
}
interface UpdateCellAction {
    type: typeof UPDATE_CELL;
    payload: any;
}

export const initData = (payload: any): InitDataAction => ({
    type: INIT_DATA,
    payload,
});

export const addRowData = (payload: any): AddRowAction => ({
    type: ADD_ROW,
    payload,
});

export const addTableData = (payload: any): AddTableAction => ({
    type: ADD_TABLE,
    payload,
});

export const deleteRowData = (payload: any): DeleteRowAction => ({
    type: DELETE_ROW,
    payload,
});

export const updateCellData = (payload: any): UpdateCellAction => ({
    type: UPDATE_CELL,
    payload,
});
