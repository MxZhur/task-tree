import React from "react";
import { Nav, Button } from "react-bootstrap";
import "./MenuBar.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getFileBaseName, openFile, saveFileAs, saveFileTo } from "../../utils/file";
import { clearTasks } from "../../store/tasksSlice";
import {
  selectCurrentFileInfo,
  setFilePath,
  setIsDirty,
  setIsNewFile,
} from "../../store/currentFileSlice";
import { changeWindowTitle } from "../../utils/window";
import { ask } from "@tauri-apps/api/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faFile,
  faFloppyDisk,
  faFolderOpen,
  faSdCard,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../utils/appInfo";
import { useTranslation } from "react-i18next";
import { setSelectedTask } from "../../store/selectedTaskSlice";

const MenuBar: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentFileInfo = useAppSelector(selectCurrentFileInfo);

  const onFileNewClicked = async () => {
    const fileIsDirty = currentFileInfo.isDirty;

    // If the file is "dirty", ask for confirmation

    if (fileIsDirty) {
      const confirmed = await ask(t("exitConfirmation.youSure"));
      if (!confirmed) {
        return;
      }

      const fileSaveConfirmed = await ask(t("exitConfirmation.saveChanges"));

      if (fileSaveConfirmed) {
        const saveResult = await onFileSaveClicked();

        if (saveResult === null) {
          return;
        }
      }
    }

    dispatch(clearTasks());
    dispatch(setSelectedTask(null));
    dispatch(setIsNewFile(true));
    dispatch(setIsDirty(false));
    dispatch(setFilePath(null));
    changeWindowTitle(APP_NAME + " - " + t("titleNewProject"));
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

      changeWindowTitle(APP_NAME + " - " + getFileBaseName(fileDialogResult));

      return fileDialogResult;
    } else {
      const filePath = currentFileInfo.filePath;

      if (filePath !== null) {
        await saveFileTo(filePath);
      }

      changeWindowTitle(APP_NAME + " - " + getFileBaseName(filePath));

      return filePath;
    }
  };

  const onFileSaveAsClicked = async () => {
    await saveFileAs();
  };

  return (
    <Nav className="bg-light">
      <Nav.Item>
        <Button
          title={t("menuBar.newFile")}
          variant="link"
          onClick={onFileNewClicked}
        >
          <FontAwesomeIcon icon={faFile} />
        </Button>
      </Nav.Item>
      <Nav.Item>
        <Button
          title={t("menuBar.openFile")}
          variant="link"
          onClick={onFileOpenClicked}
        >
          <FontAwesomeIcon icon={faFolderOpen} />
        </Button>
      </Nav.Item>
      <Nav.Item>
        <Button
          title={t("menuBar.saveFile")}
          variant="link"
          onClick={onFileSaveClicked}
        >
          <FontAwesomeIcon
            icon={faFloppyDisk}
            color={currentFileInfo.isDirty ? "red" : undefined}
          />
        </Button>
      </Nav.Item>
      <Nav.Item>
        <Button
          title={t("menuBar.saveAs")}
          variant="link"
          onClick={onFileSaveAsClicked}
        >
          <FontAwesomeIcon icon={faSdCard} />
        </Button>
      </Nav.Item>
      {/* <Nav.Item>
        <Link to={"/settings"}>
          <Button title={t("settings")} variant="link">
            <FontAwesomeIcon icon={faCog} />
          </Button>
        </Link>
      </Nav.Item> */}
      <Nav.Item>
        <Link to={"/about"}>
          <Button title={t("about")} variant="link">
            <FontAwesomeIcon icon={faCircleInfo} />
          </Button>
        </Link>
      </Nav.Item>
    </Nav>
  );
};

export default MenuBar;
