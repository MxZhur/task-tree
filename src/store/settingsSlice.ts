import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export const GRAPH_COLORING_MODES = {
  priority: 'priority',
  difficulty: 'difficulty',
  progress: 'progress',
  dependencies: 'dependencies',
  off: 'off',
};

type SettingsState = {
  descriptionExpandedByDefault: boolean;
  graphColoringMode: string;
};

const initialState: SettingsState = {
  descriptionExpandedByDefault: false,
  graphColoringMode: GRAPH_COLORING_MODES.dependencies,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setDescriptionExpandedByDefault(state, action: PayloadAction<boolean>) {
      const { payload } = action;

      state.descriptionExpandedByDefault = payload;
    },
    setGraphColoringMode(state, action: PayloadAction<string>) {
      const { payload } = action;

      state.graphColoringMode = payload;
    },
  },
});

export const { setDescriptionExpandedByDefault, setGraphColoringMode } = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
