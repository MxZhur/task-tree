import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from './tasksSlice';
import selectedTaskReducer from './selectedTaskSlice';

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        selectedTask: selectedTaskReducer,
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
