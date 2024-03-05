import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import tasksReducer from "./tasksSlice";
import selectedTaskReducer from "./selectedTaskSlice";
import currentFileReducer from "./currentFileSlice";
import recentFilesReducer from "./recentFilesSlice";
import settingsReducer from "./settingsSlice";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  selectedTask: selectedTaskReducer,
  currentFile: currentFileReducer,
  recentFiles: recentFilesReducer,
  settings: settingsReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["tasks", "selectedTask"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
