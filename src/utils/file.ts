import { open, save } from "@tauri-apps/api/dialog";
import store from "../store";
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import {
  setFilePath,
  setIsDirty,
  setIsNewFile,
} from "../store/currentFileSlice";
import { changeWindowTitle } from "./window";
import { loadTasks } from "../store/tasksSlice";
import { pushNewRecentFile } from "../store/recentFilesSlice";
import { APP_NAME } from "./appInfo";

const FILE_EXTENSION = "ttproj";

export const saveFileTo = async (filePath: string) => {
  const fileContent = JSON.stringify(store.getState().tasks);

  await writeTextFile(filePath, fileContent);

  store.dispatch(setFilePath(filePath));
  store.dispatch(setIsDirty(false));
  store.dispatch(setIsNewFile(false));
};

export const saveFileAs = async () => {
  const filePath = await save({
    filters: [
      {
        name: "Task Tree Project",
        extensions: [FILE_EXTENSION],
      },
    ],
  });

  if (filePath === null) {
    return null;
  }

  await saveFileTo(filePath);

  return filePath;
};

export const openFile = async () => {
  let filePath = await open({
    multiple: false,
    filters: [
      {
        name: "Task Tree Project",
        extensions: [FILE_EXTENSION],
      },
    ],
  });

  if (filePath === null) {
    return null;
  }

  if (Array.isArray(filePath)) {
    filePath = filePath[0];
  }

  await readFile(filePath);

  return filePath;
};

export const readFile = async (filePath: string) => {
  const fileContent = await readTextFile(filePath);

  store.dispatch(loadTasks(fileContent));
  store.dispatch(setIsNewFile(false));
  store.dispatch(setIsDirty(false));
  store.dispatch(setFilePath(filePath));
  store.dispatch(pushNewRecentFile(filePath));
  changeWindowTitle(APP_NAME + " - " + filePath);
};
