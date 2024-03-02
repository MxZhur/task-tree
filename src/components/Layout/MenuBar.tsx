import React from "react";
import { Nav, NavItem, NavLink, Dropdown, Button } from "react-bootstrap";
import "./MenuBar.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { openFile, saveFileAs, saveFileTo } from "../../utils/file";
import { clearTasks } from "../../store/tasksSlice";
import {
  setFilePath,
  setIsDirty,
  setIsNewFile,
} from "../../store/currentFileSlice";
import { changeWindowTitle } from "../../utils/window";
import { ask } from "@tauri-apps/api/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFloppyDisk, faFolderOpen, faSdCard } from "@fortawesome/free-solid-svg-icons";

const MenuBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentFile: currentFileInfo } = useAppSelector((state) => state);

  const onFileNewClicked = async () => {
    const fileIsDirty = currentFileInfo.isDirty;

    // If the file is "dirty", ask for confirmation

    if (fileIsDirty) {
      const confirmed = await ask("Are you sure?");
      if (!confirmed) {
        return;
      }

      const fileSaveConfirmed = await ask(
        "Your project has unsaved changes. Do you want to save them?"
      );

      if (fileSaveConfirmed) {
        const saveResult = await onFileSaveClicked();

        if (saveResult === null) {
          return;
        }
      }
    }

    dispatch(clearTasks());
    dispatch(setIsNewFile(true));
    dispatch(setIsDirty(false));
    dispatch(setFilePath(null));
    changeWindowTitle("Task Tree - New Project");
  };

  const onFileOpenClicked = async () => {
    await openFile();
  };

  const onFileSaveClicked = async () => {
    const isNewFile = currentFileInfo.isNewFile;

    if (isNewFile) {
      const fileDialogResult = await saveFileAs();

      if (fileDialogResult === null) {
        return null;
      }

      changeWindowTitle("Task Tree - " + fileDialogResult);

      return fileDialogResult;
    } else {
      const filePath = currentFileInfo.filePath;

      if (filePath !== null) {
        await saveFileTo(filePath);
      }

      changeWindowTitle("Task Tree - " + filePath);

      return filePath;
    }
  };

  const onFileSaveAsClicked = async () => {
    await saveFileAs();
  };

  return (
    <Nav className="bg-light">
      <Nav.Item>
        <Button title="New File" variant="link" onClick={onFileNewClicked}>
          <FontAwesomeIcon icon={faFile} />
        </Button>
      </Nav.Item>
      <Nav.Item>
        <Button title="Open File..." variant="link" onClick={onFileOpenClicked}>
          <FontAwesomeIcon icon={faFolderOpen} />
        </Button>
      </Nav.Item>
      <Nav.Item>
        <Button title="Save File" variant='link' onClick={onFileSaveClicked}>
        <FontAwesomeIcon icon={faFloppyDisk} color={currentFileInfo.isDirty ? 'red' : undefined} />
        </Button>
      </Nav.Item>
      <Nav.Item>
        <Button title="Save As..." variant="link" onClick={onFileSaveAsClicked}>
        <FontAwesomeIcon icon={faSdCard} />
        </Button>
      </Nav.Item>
    </Nav>
  );
};

export default MenuBar;
