import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from './tasksSlice';
import selectedTaskReducer from './selectedTaskSlice';
import currentFileReducer from "./currentFileSlice";

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        selectedTask: selectedTaskReducer,
        currentFile: currentFileReducer,
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
