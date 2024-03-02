import React from "react";
import { Button, Container } from "react-bootstrap";
import { AppLogo } from "../../components";
import { useNavigate } from "react-router-dom";
import { APP_AUTHOR, APP_RELEASE_YEAR, APP_VERSION } from "../../utils/appInfo";

const AboutPage: React.FC = () => {
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
          <div>Version {APP_VERSION}</div>
          <div>
            {APP_RELEASE_YEAR} &#169; {APP_AUTHOR}
          </div>
          <div>
            <Button onClick={goBack}>Back</Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export { AboutPage };
