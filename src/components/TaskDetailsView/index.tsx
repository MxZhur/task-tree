import React, { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import "./index.css";
import { Badge, Button, ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import PriorityIndicator from "./PriorityIndicator";
import DifficultyIndicator from "./DifficultyIndicator";

const TaskDetailsView: React.FC = () => {
  const task = useAppSelector((state) =>
    state.tasks.list.find((t) => t.id === state.selectedTask.taskId)
  );

  if (task === undefined) {
    return (
      <div className="task-details-view-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          Select a task
        </div>
      </div>
    );
  }

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const dependencyTasks = useAppSelector((state) =>
    state.tasks.list.filter((t) => task.dependencyTasks.includes(t.id))
  );

  const blockedTasks = useAppSelector((state) =>
    state.tasks.list.filter((t) => t.dependencyTasks.includes(task.id))
  );

  return (
    <div className="task-details-view-container">
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

      {/* TODO: Dependency Tasks */}
      {/* TODO: Blocked Tasks */}
    </div>
  );
};

export { TaskDetailsView };
