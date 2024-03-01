import { Route, Routes } from "react-router-dom";
import "./App.css";
import { MainPage, TaskForm } from "./pages";
import Layout from "./components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { readFile } from "./utils/file";
import { listen } from "@tauri-apps/api/event";

function App() {
  // TODO: Fix the close request handler
  // const unlistenCloseRequest = appWindow.onCloseRequested(async (event) => {
  //   const fileIsDirty = store.getState().currentFile.isDirty;

  //   // If the file is "dirty", ask for confirmation

  //   if (!fileIsDirty) {
  //     return;
  //   }

  //   const confirmed = await ask("Are you sure?");
  //   if (!confirmed) {
  //     event.preventDefault();
  //     return;
  //   }

  //   const fileSaveConfirmed = await ask(
  //     "Your project has unsaved changes. Do you want to save them?"
  //   );

  //   if (fileSaveConfirmed) {
  //     // Also check if that's not a new file

  //     const isNewFile = store.getState().currentFile.isNewFile;

  //     if (isNewFile) {
  //       const fileDialogResult = await saveFileAs();

  //       if (fileDialogResult === null) {
  //         event.preventDefault();
  //         return;
  //       }
  //     } else {
  //       const filePath = store.getState().currentFile.filePath;

  //       if (filePath !== null) {
  //         await saveFileTo(filePath);
  //       }
  //     }
  //   }
  // });

  listen("tauri://file-drop", async (event) => {
    const filePath: string = event.payload[0];
    await readFile(filePath);
  });

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />}></Route>
        <Route path="new" element={<TaskForm />} />
        <Route path="new/:parentTask" element={<TaskForm />} />
        <Route path="edit/:taskId" element={<TaskForm />} />
      </Route>
    </Routes>
  );
}

export default App;
