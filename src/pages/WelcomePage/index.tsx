import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { AppLogo } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faFile,
  faFolderOpen,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { openFile, readFile } from "../../utils/file";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearTasks } from "../../store/tasksSlice";
import {
  setFilePath,
  setIsDirty,
  setIsNewFile,
} from "../../store/currentFileSlice";
import { changeWindowTitle } from "../../utils/window";
import { Link, useNavigate } from "react-router-dom";
import { clearRecentFiles } from "../../store/recentFilesSlice";

const WelcomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const recentFiles = useAppSelector((state) => state.recentFiles.files);

  const onFileNewClick = async () => {
    dispatch(clearTasks());
    dispatch(setIsNewFile(true));
    dispatch(setIsDirty(false));
    dispatch(setFilePath(null));
    changeWindowTitle("Task Tree - New Project");
    navigate("/home");
  };

  const onFileOpenClick = async () => {
    await openFile();

    navigate("/home");
  };

  const onRecentFilesClearClick = async () => {
    dispatch(clearRecentFiles());
  };

  const onRecentFileClick = async (filePath: string) => {
    await readFile(filePath);

    navigate("/home");
  };

  return (
    <Container style={{ height: "100%" }}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="mb-4">
          <AppLogo />
        </div>

        <Row style={{ width: "100%" }}>
          <Col xs={12} sm={6}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
              }}
            >
              <Button variant="link" onClick={onFileNewClick}>
                <FontAwesomeIcon icon={faFile} /> New File
              </Button>
              <Button variant="link" onClick={onFileOpenClick}>
                <FontAwesomeIcon icon={faFolderOpen} /> Open File...
              </Button>
              <Link to='/about'>
                <Button variant="link">
                  <FontAwesomeIcon icon={faCircleInfo} /> About
                </Button>
              </Link>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div>
              <strong>Recent Files</strong>
              &nbsp;
              <Button
                title="Clear"
                size="sm"
                variant="link"
                onClick={onRecentFilesClearClick}
              >
                <FontAwesomeIcon icon={faRemove} />
              </Button>
            </div>

            <div>
              <ul>
                {recentFiles.map((fp) => (
                  <li
                    style={{ color: "var(--bs-primary)", cursor: "pointer" }}
                    key={fp}
                    onClick={() => onRecentFileClick(fp)}
                  >
                    {fp}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export { WelcomePage };
