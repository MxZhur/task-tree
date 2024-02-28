import React from "react";
import { TaskTree } from "../../components";
import { Col, Container, Row } from "react-bootstrap";

const MainPage: React.FC = () => {
  return (
    <div className="full-height" style={{ minHeight: "100%" }}>
      <Container className="full-height" style={{ maxWidth: "unset" }}>
        <Row className="full-height">
          <Col className="full-height">
            <TaskTree></TaskTree>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export { MainPage };
