import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CurrentFileState = {
  filePath: string | null;
  isDirty: boolean;
  isNewFile: boolean;
};

const initialState: CurrentFileState = {
  filePath: null,
  isDirty: false,
  isNewFile: true,
};

const currentFileSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilePath(state, action: PayloadAction<string | null>) {
      const { payload } = action;

      state.filePath = payload;
    },
    setIsDirty(state, action: PayloadAction<boolean>) {
      const { payload } = action;

      state.isDirty = payload;
    },
    setIsNewFile(state, action: PayloadAction<boolean>) {
      const { payload } = action;

      state.isNewFile = payload;
    },
  },
});

export const { setFilePath, setIsDirty, setIsNewFile } = currentFileSlice.actions;

export default currentFileSlice.reducer;
