import { message, open, save } from "@tauri-apps/api/dialog";
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
import { setSelectedTask } from "../store/selectedTaskSlice";
import i18n from "../i18n/i18n";

export const FILE_EXTENSION = "ttproj";

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

  if (!(await readFile(filePath))) {
    return null;
  }

  return filePath;
};

export const readFile = async (filePath: string) => {
  try {
    const fileContent = await readTextFile(filePath);

    store.dispatch(loadTasks(fileContent));
    store.dispatch(setSelectedTask(null));
    store.dispatch(setIsNewFile(false));
    store.dispatch(setIsDirty(false));
    store.dispatch(setFilePath(filePath));
    store.dispatch(pushNewRecentFile(filePath));
    changeWindowTitle(APP_NAME + " - " + getFileBaseName(filePath));

    return true;
  } catch {
    message(i18n.t("unableToOpenFile") + ' "' + filePath + '"', {
      title: i18n.t("error"),
      type: "error",
    });

    return false;
  }
};

export const getFileBaseName = (filePath: string | null) => {
  if (filePath === null) {
    return "";
  }

  let fileBaseName = filePath.split("\\").pop();

  if (fileBaseName !== undefined) {
    return fileBaseName;
  }

  fileBaseName = filePath.split("/").pop();

  if (fileBaseName !== undefined) {
    return fileBaseName;
  }

  return "";
};
