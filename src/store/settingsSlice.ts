import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

type SettingsState = {
  descriptionExpandedByDefault: boolean;
};

const initialState: SettingsState = {
  descriptionExpandedByDefault: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setDescriptionExpandedByDefault(state, action: PayloadAction<boolean>) {
      const { payload } = action;

      state.descriptionExpandedByDefault = payload;
    },
  },
});

export const { setDescriptionExpandedByDefault } = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
