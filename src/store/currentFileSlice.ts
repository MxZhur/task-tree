import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

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
  name: "currentFile",
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

export const selectCurrentFileInfo = (state: RootState) => state.currentFile;

export default currentFileSlice.reducer;
