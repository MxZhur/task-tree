import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import { register } from "@tauri-apps/api/globalShortcut";
import { openFile, saveFileAs, saveFileTo } from "./utils/file";
import { changeWindowTitle } from "./utils/window";

register("CommandOrControl+O", async () => {
  openFile();
});

register("CommandOrControl+S", async () => {
  const isNewFile = store.getState().currentFile.isNewFile;

  if (isNewFile) {
    const fileDialogResult = await saveFileAs();

    if (fileDialogResult === null) {
      return null;
    }

    changeWindowTitle("Task Tree - " + fileDialogResult);

    return fileDialogResult;
  } else {
    const filePath = store.getState().currentFile.filePath;

    if (filePath !== null) {
      await saveFileTo(filePath);
    }

    changeWindowTitle("Task Tree - " + filePath);

    return filePath;
  }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
