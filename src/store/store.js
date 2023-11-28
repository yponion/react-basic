import {configureStore} from '@reduxjs/toolkit'
import toastReducer from "./toastSlice";
import authSlice from "./authSlice";

export const store = configureStore({
    reducer: {
        toast: toastReducer,
        auth: authSlice
    },
})