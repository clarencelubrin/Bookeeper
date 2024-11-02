import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './slices/dataSlice';
import widthsReducer from './slices/widthsSlice';
import fileReducer from './slices/fileSlice';
export const store = configureStore({
    reducer: {
        data: dataReducer,
        widths: widthsReducer,
        file: fileReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export default store;