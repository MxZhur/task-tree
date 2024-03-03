import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

type SelectedTaskState = {
  taskId: string | null;
};

const initialState: SelectedTaskState = {
  taskId: null,
};

const selectedTaskSlice = createSlice({
  name: "selectedTask",
  initialState,
  reducers: {
    setSelectedTask(state, action: PayloadAction<string | null>) {
      const { payload } = action;

      state.taskId = payload;
    },
  },
});

export const { setSelectedTask } = selectedTaskSlice.actions;

export const selectSelectedTaskId = (state: RootState) => state.selectedTask.taskId;

export default selectedTaskSlice.reducer;
