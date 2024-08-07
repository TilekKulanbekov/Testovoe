import { configureStore } from '@reduxjs/toolkit';
import betReducer from './slice';

const store = configureStore({
    reducer: {
        bet: betReducer
    }
});

export default store;
