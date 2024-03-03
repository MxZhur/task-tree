import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const MAX_RECENT_FILES = 10;

type RecentFilesState = {
  files: string[];
};

const initialState: RecentFilesState = {
  files: [],
};

const recentFilesSlice = createSlice({
  name: "recentFiles",
  initialState,
  reducers: {
    pushNewRecentFile(state, action: PayloadAction<string>) {
      const { payload } = action;

      if (state.files.includes(payload)) {
        state.files = state.files.filter((fp) => fp !== payload);
      }

      state.files.unshift(payload);
      state.files = state.files.slice(0, MAX_RECENT_FILES);
    },
    clearRecentFiles(state) {
      state.files = [];
    },
  },
});

export const { pushNewRecentFile, clearRecentFiles } = recentFilesSlice.actions;

export default recentFilesSlice.reducer;
