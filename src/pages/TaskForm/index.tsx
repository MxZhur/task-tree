import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  ProgressBar,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import {
  TASK_DIFFICULTIES,
  TASK_PRIORITIES,
  Task,
  addTask,
  updateTask,
} from "../../store/tasksSlice";
import PriorityIndicator from "../../components/TaskDetailsView/PriorityIndicator";
import DifficultyIndicator from "../../components/TaskDetailsView/DifficultyIndicator";
import { TaskPicker } from "../../components";
import { TaskMultiPicker } from "../../components/TaskMultiPicker";
import { setIsDirty } from "../../store/currentFileSlice";
import { useTranslation } from "react-i18next";

const TaskForm: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  const { taskId, parentTask: paramParentTaskId } = useParams();

  const task = useAppSelector((state) => {
    if (!taskId) {
      return undefined;
    }

    return state.tasks.list.find((t) => t.id === taskId);
  });

  const topLevelTasksIDs = useAppSelector((state) => state.tasks.topLevelIDs);
  const allTasks: Task[] = useAppSelector((state) => state.tasks.list);

  const defaultNeighborTasksIds = useAppSelector((state) => {
    let parentId: string | null;

    if (paramParentTaskId !== undefined) {
      parentId = paramParentTaskId;
    } else if (task !== undefined) {
      parentId = task.parentTaskId;
    } else {
      parentId = null;
    }

    if (parentId !== null) {
      const parentTask = state.tasks.list.find((t) => t.id === parentId);

      if (parentTask === undefined) {
        return state.tasks.topLevelIDs;
      } else {
        return parentTask.childTasks;
      }
    } else {
      return state.tasks.topLevelIDs;
    }
  });

  const defaultBlockedTasksIds = useAppSelector((state) => {
    return state.tasks.list
      .filter((t) => t.dependencyTasks.includes(task?.id ?? ""))
      .map((t) => t.id);
  });

  const [name, setName] = useState<string>(task ? task.name : "");
  const [description, setDescription] = useState<string>(
    task !== undefined ? task.description : ""
  );
  const [progress, setProgress] = useState<number>(
    task !== undefined && task?.progress ? task.progress : 0
  );
  const [priority, setPriority] = useState<number>(
    task !== undefined && task?.priority
      ? task.priority
      : TASK_PRIORITIES.medium
  );
  const [difficulty, setDifficulty] = useState<number>(
    task !== undefined && task?.difficulty
      ? task.difficulty
      : TASK_DIFFICULTIES.normal
  );

  let defaultParentTaskId: string | null;

  if (paramParentTaskId !== undefined) {
    defaultParentTaskId = paramParentTaskId;
  } else if (task !== undefined) {
    defaultParentTaskId = task.parentTaskId;
  } else {
    defaultParentTaskId = null;
  }

  const [parentTaskId, setParentTaskId] = useState<string | null>(
    defaultParentTaskId
  );

  let defaultBeforeTaskId: string | null;

  if (taskId === undefined) {
    defaultBeforeTaskId = null;
  } else {
    let defaultBeforeTaskIndex: number =
      defaultNeighborTasksIds.findIndex((tId) => tId === taskId) + 1;

    if (
      defaultBeforeTaskIndex < 0 ||
      defaultBeforeTaskIndex >= defaultNeighborTasksIds.length
    ) {
      defaultBeforeTaskId = null;
    } else {
      defaultBeforeTaskId = defaultNeighborTasksIds[defaultBeforeTaskIndex];
    }
  }

  const [beforeTaskId, setBeforeTaskId] = useState<string | null>(
    defaultBeforeTaskId
  );

  const [neighborTasksIds, setNeighborTasksIds] = useState(
    defaultNeighborTasksIds
  );

  const [dependencyTasksIds, setDependencyTasksIds] = useState<string[]>(
    task !== undefined ? task.dependencyTasks : []
  );

  const [blockedTasksIds, setBlockedTasksIds] = useState<string[]>(
    defaultBlockedTasksIds
  );

  const changeParentTask = (tId: string | null) => {
    setParentTaskId(tId);

    if (tId !== null) {
      const parentTask = allTasks.find((t) => t.id === tId);

      if (parentTask === undefined) {
        setNeighborTasksIds(topLevelTasksIDs);
      } else {
        setNeighborTasksIds(parentTask.childTasks);
      }
    } else {
      setNeighborTasksIds(topLevelTasksIDs);
    }

    setBeforeTaskId(null);
    setDependencyTasksIds([]);
    setBlockedTasksIds([]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (taskId === undefined) {
      dispatch(
        addTask({
          name,
          description,
          progress,
          priority,
          difficulty,
          parentTaskId,
          beforeTaskId,
          dependencyTasks: dependencyTasksIds,
          blockedTasks: blockedTasksIds,
        })
      );
      dispatch(setIsDirty(true));
    } else {
      dispatch(
        updateTask({
          id: taskId,
          name,
          description,
          progress,
          priority,
          difficulty,
          parentTaskId,
          beforeTaskId,
          dependencyTasks: dependencyTasksIds,
          blockedTasks: blockedTasksIds,
        })
      );
      dispatch(setIsDirty(true));
    }

    navigate(-1);
  };

  return (
    <Container>
      <div>
        <h5>{taskId ? t('editTask') : t("newTask")}</h5>
      </div>
      <Form onSubmit={handleSubmit}>
        {/* Name */}
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder={t("taskFormFields.labelName")}
            title={t("taskFormFields.labelName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={true}
            autoFocus
            maxLength={100}
          />
        </Form.Group>

        {/* Description */}
        <textarea
          className="form-control"
          rows={3}
          title={t("taskFormFields.labelDescription")}
          placeholder={t("taskFormFields.labelDescription")}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></textarea>

        {/* Progress */}
        <Form.Group className="mt-3 mb-3">
          <Form.Label>{t("taskFormFields.labelProgress")}</Form.Label>
          {task === undefined || task?.childTasks.length === 0 ? (
            <Row>
              <Col xs={2} sm={1}>
                <Button variant="success" title={t("taskFormFields.btnMarkAsDone")}>
                  <FontAwesomeIcon
                    icon={faCheck}
                    onClick={() => setProgress(100)}
                  />{" "}
                </Button>
              </Col>
              <Col>
                <Form.Range
                  value={progress}
                  min={0}
                  max={100}
                  step={5}
                  title={progress + "%"}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                />
              </Col>
            </Row>
          ) : (
            <div>
              <ProgressBar
                variant="primary"
                min={0}
                max={100}
                now={progress}
                label={progress + "%"}
              />
              <Form.Text>{t("taskFormFields.msgProgressCalculated")}</Form.Text>
            </div>
          )}
        </Form.Group>

        <Row className="mt-3">
          <Col xs={12} sm={6}>
            {/* Priority */}
            <Form.Label>{t("taskFormFields.labelPriority")}</Form.Label>
            <Row>
              <Col xs={1}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  <PriorityIndicator priority={priority} />
                </div>
              </Col>
              <Col style={{ paddingLeft: 0 }}>
                <Form.Select
                  value={priority}
                  onChange={(e) => setPriority(parseInt(e.target.value))}
                >
                  <option value={TASK_PRIORITIES.critical}>
                    {t("priority.critical")}
                  </option>
                  <option value={TASK_PRIORITIES.high}>
                    {t("priority.high")}
                  </option>
                  <option value={TASK_PRIORITIES.medium}>
                    {t("priority.medium")}
                  </option>
                  <option value={TASK_PRIORITIES.low}>
                    {t("priority.low")}
                  </option>
                  <option value={TASK_PRIORITIES.none}>
                    {t("priority.none")}
                  </option>
                </Form.Select>
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={6}>
            {/* Difficulty */}
            <Form.Label>{t("taskFormFields.labelDifficulty")}</Form.Label>
            <Row>
              <Col xs={1}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  <DifficultyIndicator difficulty={difficulty} />
                </div>
              </Col>
              <Col style={{ paddingLeft: 0 }}>
                <Form.Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseFloat(e.target.value))}
                >
                  <option value={TASK_DIFFICULTIES.hard}>
                    {t("difficulty.hard")}
                  </option>
                  <option value={TASK_DIFFICULTIES.normal}>
                    {t("difficulty.normal")}
                  </option>
                  <option value={TASK_DIFFICULTIES.easy}>
                    {t("difficulty.easy")}
                  </option>
                </Form.Select>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col xs={12} sm={6}>
            {/* Parent Task (Button + Modal) */}
            <Form.Group>
              <Form.Label>{t("taskFormFields.labelParentTask")}</Form.Label>
              <TaskPicker
                taskId={parentTaskId}
                disabledTasksIds={[task?.id ?? ""]}
                onTaskIdChange={(tId) => changeParentTask(tId)}
                placeholder={t("taskFormFields.msgParentTaskNone")}
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6}>
            {/* Before Task (Button + Modal) */}
            <Form.Group>
              <Form.Label>{t("taskFormFields.labelPlaceBefore")}</Form.Label>
              <TaskPicker
                taskId={beforeTaskId}
                disabledTasksIds={[task?.id ?? ""]}
                onTaskIdChange={(tId) => setBeforeTaskId(tId)}
                availableTasksIds={neighborTasksIds}
                placeholder={t("taskFormFields.msgEndOfList")}
                recursive={false}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col xs={12} sm={6}>
            {/* Dependency Tasks (Block + Modal) */}
            <Form.Group>
              <Form.Label>
                <FontAwesomeIcon icon={faDiagramProject} rotation={180} />{" "}
                {t("taskFormFields.labelDependencyTasks")}
              </Form.Label>
              <TaskMultiPicker
                availableTasksIds={neighborTasksIds}
                disabledTasksIds={[
                  taskId ?? "",
                  ...blockedTasksIds,
                  ...dependencyTasksIds,
                ]}
                selectedTasksIds={dependencyTasksIds}
                onAdd={(tId) =>
                  setDependencyTasksIds(
                    dependencyTasksIds.includes(tId)
                      ? dependencyTasksIds
                      : [...dependencyTasksIds, tId]
                  )
                }
                onRemove={(tId) =>
                  setDependencyTasksIds(
                    dependencyTasksIds.filter((id) => id !== tId)
                  )
                }
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6}>
            {/* Blocked Tasks (Block + Modal) */}
            <Form.Group>
              <Form.Label>
                <FontAwesomeIcon icon={faDiagramProject} />{" "}
                {t("taskFormFields.labelBlockedTasks")}
              </Form.Label>

              <TaskMultiPicker
                availableTasksIds={neighborTasksIds}
                disabledTasksIds={[
                  taskId ?? "",
                  ...dependencyTasksIds,
                  ...blockedTasksIds,
                ]}
                selectedTasksIds={blockedTasksIds}
                onAdd={(tId) =>
                  setBlockedTasksIds(
                    blockedTasksIds.includes(tId)
                      ? blockedTasksIds
                      : [...blockedTasksIds, tId]
                  )
                }
                onRemove={(tId) =>
                  setBlockedTasksIds(blockedTasksIds.filter((id) => id !== tId))
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="mt-3 mb-3 pb-4">
          <Button variant="success" type="submit">
            {t("taskFormFields.btnSubmit")}
          </Button>
          &nbsp;
          <Button onClick={goBack}>{t("cancel")}</Button>
        </div>
      </Form>
    </Container>
  );
};

export { TaskForm };
