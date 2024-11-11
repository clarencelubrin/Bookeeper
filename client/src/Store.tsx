import { configureStore, Reducer, AnyAction } from '@reduxjs/toolkit';
import { groupByActionTypes, StateWithHistory } from 'redux-undo';
import undoable from 'redux-undo';
import dataReducer from './slices/dataSlice';
import widthsReducer from './slices/widthsSlice';
import fileReducer from './slices/fileSlice';
import { UPDATE_CELL } from './slices/data-actions/actionTypes';

export const store = configureStore({
    reducer: {
        data: undoable(dataReducer, {
            groupBy: groupByActionTypes([UPDATE_CELL]),
        }) as Reducer<StateWithHistory<{ content: null }>, AnyAction>,
        widths: widthsReducer,
        file: fileReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export default store;
export type RootState = ReturnType<typeof store.getState>
