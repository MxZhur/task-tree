import React from "react";
import { Button, Container } from "react-bootstrap";
import { AppLogo } from "../../components";
import { useNavigate } from "react-router-dom";
import { APP_AUTHOR, APP_RELEASE_YEAR, APP_VERSION } from "../../utils/appInfo";
import { useTranslation } from "react-i18next";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
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

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>{t('aboutPage.version')} {APP_VERSION}</div>
          <div>
            {APP_RELEASE_YEAR} &#169; {APP_AUTHOR}
          </div>
          <div>
            {t("aboutPage.madeWith")}
            &nbsp;
            <a href="https://reactjs.org" target="_blank">
              React
            </a>
            &nbsp;+&nbsp;
            <a href="https://tauri.app" target="_blank">
              Tauri
            </a>
          </div>
          <div>
            <a href="https://github.com/MxZhur/task-tree" target="_blank">
              {t("aboutPage.githubPage")}
            </a>
          </div>
          <div className="mt-4">
            <Button onClick={goBack}>{t('back')}</Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export { AboutPage };
