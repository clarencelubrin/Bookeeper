import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './features/dataSlice';
import widthsReducer from './features/widthsSlice';
import fileReducer from './features/fileSlice';
export const store = configureStore({
    reducer: {
        data: dataReducer,
        widths: widthsReducer,
        file: fileReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export default store;