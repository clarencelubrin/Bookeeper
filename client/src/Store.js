import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './reducers/dataSlice';
import widthsReducer from './reducers/widthsSlice';
import fileReducer from './reducers/fileSlice';
export const store = configureStore({
    reducer: {
        data: dataReducer,
        widths: widthsReducer,
        file: fileReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export default store;