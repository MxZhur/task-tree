import React, { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import "./index.css";
import { Badge, Button, Col, ProgressBar, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faCaretDown,
  faCaretRight,
  faCheck,
  faEdit,
  faHandPointLeft,
  faShare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import PriorityIndicator from "./PriorityIndicator";
import DifficultyIndicator from "./DifficultyIndicator";
import DependencyTasksList from "./DependencyTasksList";
import { Link } from "react-router-dom";

const TaskDetailsView: React.FC = () => {
  const task = useAppSelector((state) =>
    state.tasks.list.find((t) => t.id === state.selectedTask.taskId)
  );

  const dependencyTasks = useAppSelector((state) => {
    if (task === undefined) {
      return [];
    }
    return state.tasks.list.filter((t) => task.dependencyTasks.includes(t.id));
  });

  const blockedTasks = useAppSelector((state) => {
    if (task === undefined) {
      return [];
    }

    return state.tasks.list.filter((t) => t.dependencyTasks.includes(task.id));
  });

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const onDeleteButtonClick = () => {
    // TODO: Implement
  };

  if (task === undefined) {
    return (
      <div className="task-details-view-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "gray",
          }}
        >
          <FontAwesomeIcon icon={faHandPointLeft} />
          &nbsp;Select a task
        </div>
      </div>
    );
  }

  return (
    <div className="task-details-view-container">
      {/* Header Bar */}
      <div className="task-details-view-header-bar">
        <div>
          <strong>Details</strong>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Link to={"/new/" + task.id}>
            <Button size="sm" variant="primary">
              <FontAwesomeIcon icon={faAdd} /> Subtask
            </Button>
          </Link>
          &nbsp;
          <Link to={"/edit/" + task.id}>
            <Button size="sm" variant="success">
              <FontAwesomeIcon icon={faEdit} /> Edit
            </Button>
          </Link>
          &nbsp;
          <Link to={"/move/" + task.id}>
            <Button size="sm" variant="warning">
              <FontAwesomeIcon icon={faShare} /> Move
            </Button>
          </Link>
          &nbsp;
          <Button size="sm" variant="danger" onClick={onDeleteButtonClick}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </Button>
        </div>
      </div>

      {/* Name */}
      <div className="task-details-name">{task.name}</div>

      {/* Progress */}
      {task.progress! < 100 ? (
        <ProgressBar
          min={0}
          max={100}
          now={task!.progress!}
          label={task!.progress! + "%"}
        />
      ) : (
        <Badge bg="success">
          <FontAwesomeIcon icon={faCheck} />
          <span className="unselectable" style={{ fontWeight: "normal" }}>
            &nbsp; Completed
          </span>
        </Badge>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          fontSize: "0.8rem",
        }}
      >
        {/* Priority */}
        <PriorityIndicator priority={task.priority} showLabel={true} />

        <div style={{ width: "15px" }}></div>

        {/* Difficulty */}
        <DifficultyIndicator difficulty={task.difficulty} showLabel={true} />
      </div>

      {/* Description */}
      {task?.description !== null && task!.description.length > 0 && (
        <>
          <Button
            size="sm"
            variant="link"
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            style={{ textDecoration: "none", padding: 0, fontSize: "0.75rem" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "14px" }}>
                <FontAwesomeIcon
                  icon={isDescriptionExpanded ? faCaretDown : faCaretRight}
                />
              </div>
              Description
            </div>
          </Button>
          {isDescriptionExpanded && <div>{task?.description}</div>}
        </>
      )}

      <Row>
        <Col xs={6} style={{ wordWrap: "normal" }}>
          {/* Dependency Tasks */}
          <DependencyTasksList
            tasks={dependencyTasks}
            title={"Dependency Tasks"}
            flipIcon={true}
          />
        </Col>
        <Col xs={6} style={{ wordWrap: "normal" }}>
          {/* Blocked Tasks */}
          <DependencyTasksList tasks={blockedTasks} title={"Blocked Tasks"} />
        </Col>
      </Row>
    </div>
  );
};

export { TaskDetailsView };
