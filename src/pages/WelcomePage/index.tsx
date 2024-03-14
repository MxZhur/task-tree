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
import { getFileBaseName, openFile, readFile } from "../../utils/file";
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
import { useTranslation } from "react-i18next";
import { APP_NAME } from "../../utils/appInfo";
import './index.css';

const WelcomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const recentFiles = useAppSelector((state) => state.recentFiles.files);

  const onFileNewClick = async () => {
    dispatch(clearTasks());
    dispatch(setIsNewFile(true));
    dispatch(setIsDirty(false));
    dispatch(setFilePath(null));
    changeWindowTitle(APP_NAME + " - " + t('titleNewProject'));
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
    if (await readFile(filePath)) {
      navigate("/home");
    }
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
              <Button variant="link" className="welcome-page-btn" onClick={onFileNewClick}>
                <FontAwesomeIcon className="welcome-page-btn-icon" icon={faFile} /> {t('welcomePage.newFile')}
              </Button>
              <Button variant="link" className="welcome-page-btn" onClick={onFileOpenClick}>
                <FontAwesomeIcon className="welcome-page-btn-icon" icon={faFolderOpen} /> {t('welcomePage.openFile')}
              </Button>
              <Link to='/about'>
                <Button variant="link" className="welcome-page-btn">
                  <FontAwesomeIcon className="welcome-page-btn-icon" icon={faCircleInfo} /> {t('about')}
                </Button>
              </Link>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div>
              <strong>{t('welcomePage.recentFiles')}</strong>
              &nbsp;
              <Button
                title={t('clear')}
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
                    {getFileBaseName(fp)}
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
