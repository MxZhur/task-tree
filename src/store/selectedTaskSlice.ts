import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SelectedTaskState = {
  taskId: string | null;
};

const initialState: SelectedTaskState = {
  taskId: null,
};

const selectedTaskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setSelectedTask(state, action: PayloadAction<string | null>) {
      const { payload } = action;

      state.taskId = payload;
    },
  },
});

export const { setSelectedTask } = selectedTaskSlice.actions;

export default selectedTaskSlice.reducer;
