import React from "react";
import {
  TaskTree,
  TaskDetailsView,
  TaskDependencyGraph,
  ProjectOverallProgressBar,
} from "../../components";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const MainPage: React.FC = () => {
  return (
    <div className="full-height" style={{ minHeight: "100%" }}>
      <Container style={{ height: '95%', maxWidth: "unset" }}>
        <Row className="full-height">
          <Col xs={5} className="full-height">
            <div className="mb-1">
              <Link to={"/home/new"}>
                <div className="d-grid gap-2">
                  <Button size="sm">
                    <FontAwesomeIcon icon={faAdd} />
                    &nbsp; New Task
                  </Button>
                </div>
              </Link>
            </div>
            <TaskTree />
          </Col>
          <Col xs={7}>
            <TaskDetailsView />
            <TaskDependencyGraph />
          </Col>
          <ProjectOverallProgressBar />
        </Row>
      </Container>
    </div>
  );
};

export { MainPage };
