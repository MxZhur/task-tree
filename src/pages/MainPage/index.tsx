import React from "react";
import { TaskTree, TaskDetailsView, TaskDependencyGraph } from "../../components";
import { Col, Container, Row } from "react-bootstrap";

const MainPage: React.FC = () => {
  return (
    <div className="full-height" style={{ minHeight: "100%" }}>
      <Container className="full-height" style={{ maxWidth: "unset" }}>
        <Row className="full-height">
          <Col xs={5} className="full-height">
            <TaskTree />
          </Col>
          <Col xs={7}>
            <TaskDetailsView />
            <TaskDependencyGraph />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export { MainPage };
