import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import {
  AboutPage,
  MainPage,
  TaskForm,
  WelcomePage,
  SettingsPage,
} from "./pages";
import Layout from "./components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FILE_EXTENSION, readFile, saveFileAs, saveFileTo } from "./utils/file";
import { listen } from "@tauri-apps/api/event";
import store from "./store";
import { ask } from "@tauri-apps/api/dialog";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";
import i18n from "./i18n/i18n";

const listenToCloseRequest = async () => {
  return appWindow.onCloseRequested(async (event) => {
    const fileIsDirty = store.getState().currentFile.isDirty;

    // If the file is "dirty", ask for confirmation

    if (!fileIsDirty) {
      return;
    }

    const confirmed = await ask(i18n.t("exitConfirmation.youSure"), {
      title: i18n.t("exitConfirmation.titleYouSure"),
      type: "warning",
    });
    if (!confirmed) {
      event.preventDefault();
      return;
    }

    const fileSaveConfirmed = await ask(
      i18n.t("exitConfirmation.saveChanges"),
      {
        title: i18n.t("exitConfirmation.titleSaveChanges"),
        type: "warning",
      }
    );

    if (fileSaveConfirmed) {
      // Also check if that's not a new file

      const isNewFile = store.getState().currentFile.isNewFile;

      if (isNewFile) {
        const fileDialogResult = await saveFileAs();

        if (fileDialogResult === null) {
          event.preventDefault();
          return;
        }
      } else {
        const filePath = store.getState().currentFile.filePath;

        if (filePath !== null) {
          await saveFileTo(filePath);
        }
      }
    }
  });
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const unlistenCloseRequest = listenToCloseRequest();

    const unlistenFileDrop = listen<string[]>(
      "tauri://file-drop",
      async (event) => {
        const filePath: string = event.payload[0];

        const fileExtension = filePath.slice(filePath.lastIndexOf("."));

        if (fileExtension !== "." + FILE_EXTENSION) {
          return;
        }

        if (await readFile(filePath)) {
          navigate("/home");
        }
      }
    );

    return () => {
      unlistenCloseRequest.then((f) => f());
      unlistenFileDrop.then((f) => f());
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="home" element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="new" element={<TaskForm />} />
        <Route path="new/:parentTask" element={<TaskForm />} />
        <Route path="edit/:taskId" element={<TaskForm />} />
      </Route>
      <Route path="/about" element={<AboutPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;
