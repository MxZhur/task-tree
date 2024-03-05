import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
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
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import PriorityIndicator from "./PriorityIndicator";
import DifficultyIndicator from "./DifficultyIndicator";
import DependencyTasksList from "./DependencyTasksList";
import { Link } from "react-router-dom";
import { ask } from "@tauri-apps/api/dialog";
import {
  deleteTask,
  makeSelectBlockedTasks,
  makeSelectDependencyTasks,
  selectSelectedTask,
} from "../../store/tasksSlice";
import { setIsDirty } from "../../store/currentFileSlice";
import { setSelectedTask } from "../../store/selectedTaskSlice";
import { useTranslation } from "react-i18next";
import MDEditor from "@uiw/react-md-editor";
import { selectSettings } from "../../store/settingsSlice";

const TaskDetailsView: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const task = useAppSelector(selectSelectedTask);

  const dependencyTasks = useAppSelector(makeSelectDependencyTasks(task));
  const blockedTasks = useAppSelector(makeSelectBlockedTasks(task));

  const { descriptionExpandedByDefault } = useAppSelector(selectSettings);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(
    descriptionExpandedByDefault
  );

  const onDeleteButtonClick = async () => {
    const deletionConfirmed = await ask(
      t("delete") + ' "' + task?.name + '"?',
      {
        title: t("deleteTask"),
        type: "warning",
      }
    );

    if (!deletionConfirmed) {
      return;
    }

    dispatch(deleteTask(task?.id ?? ""));
    dispatch(setSelectedTask(null));
    dispatch(setIsDirty(true));
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
          &nbsp;{t("taskDetails.pleaseSelectTask")}
        </div>
      </div>
    );
  }

  return (
    <div className="task-details-view-container">
      {/* Header Bar */}
      <div className="task-details-view-header-bar">
        <div>
          <strong>{t("taskDetails.details")}</strong>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Link to={"/home/new/" + task.id}>
            <Button size="sm" variant="primary">
              <FontAwesomeIcon icon={faAdd} /> {t("taskDetails.addSubtask")}
            </Button>
          </Link>
          &nbsp;
          <Link to={"/home/edit/" + task.id}>
            <Button size="sm" variant="success">
              <FontAwesomeIcon icon={faEdit} /> {t("taskDetails.edit")}
            </Button>
          </Link>
          &nbsp;
          <Button size="sm" variant="danger" onClick={onDeleteButtonClick}>
            <FontAwesomeIcon icon={faTrash} /> {t("taskDetails.delete")}
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
            &nbsp; {t("completed")}
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
        <div className="mb-1">
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
              {t("taskDetails.description")}
            </div>
          </Button>
          {isDescriptionExpanded && (
            <div>
              <MDEditor.Markdown
                source={task?.description ?? ""}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </div>
          )}
        </div>
      )}

      <Row>
        <Col xs={6} style={{ wordWrap: "normal" }}>
          {/* Dependency Tasks */}
          <DependencyTasksList
            tasks={dependencyTasks}
            title={t("taskDetails.dependencyTasks")}
            flipIcon={true}
          />
        </Col>
        <Col xs={6} style={{ wordWrap: "normal" }}>
          {/* Blocked Tasks */}
          <DependencyTasksList
            tasks={blockedTasks}
            title={t("taskDetails.blockedTasks")}
          />
        </Col>
      </Row>
    </div>
  );
};

export { TaskDetailsView };
