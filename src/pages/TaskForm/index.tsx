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
import { useAppSelector } from "../../store/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { TASK_DIFFICULTIES, TASK_PRIORITIES } from "../../store/tasksSlice";
import PriorityIndicator from "../../components/TaskDetailsView/PriorityIndicator";
import DifficultyIndicator from "../../components/TaskDetailsView/DifficultyIndicator";

const TaskForm: React.FC = () => {
  const navigate = useNavigate();

  const { taskId } = useParams();

  const task = useAppSelector((state) => {
    if (!taskId) {
      return undefined;
    }

    return state.tasks.list.find((t) => t.id === taskId);
  });

  const goBack = () => navigate(-1);

  const [name, setName] = useState<string>(task ? task.name : "");
  const [description, setDescription] = useState<string>(
    task ? task.description : ""
  );
  const [progress, setProgress] = useState<number>(
    task?.progress ? task.progress : 0
  );
  const [priority, setPriority] = useState<number>(
    task?.priority ? task.priority : TASK_PRIORITIES.medium
  );
  const [difficulty, setDifficulty] = useState<number>(
    task?.difficulty ? task.difficulty : TASK_DIFFICULTIES.normal
  );

  const [parentTaskId, setParentTaskId] = useState<string | null>(
    task !== undefined ? task.parentTaskId : null
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: Validate the form

    // TODO: Prepare the fields

    // TODO: Dispatch the action
  };

  return (
    <Container>
      <div>
        <h5>{taskId ? "Edit Task" : "New Task"}</h5>
      </div>
      <Form onSubmit={handleSubmit}>
        {/* Name */}
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Name"
            title="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={true}
            autoFocus
          />
        </Form.Group>

        {/* Description */}
        <textarea
          className="form-control"
          rows={3}
          title="Description"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></textarea>

        {/* Progress */}
        <Form.Group className="mt-3 mb-3">
          <Form.Label>Progress</Form.Label>
          {task === undefined || task?.childTasks.length === 0 ? (
            <Row>
              <Col xs={2} sm={1}>
                <Button variant="success" title="Mark as done">
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
              <Form.Text>
                Calculated from child tasks. Change their progress if you want
                to change this.
              </Form.Text>
            </div>
          )}
        </Form.Group>

        <Row className="mt-3 mb-3">
          <Col xs={12} sm={6}>
            {/* Priority */}
            <Form.Label>Priority</Form.Label>
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
                  <option value={TASK_PRIORITIES.critical}>Critical</option>
                  <option value={TASK_PRIORITIES.high}>High</option>
                  <option value={TASK_PRIORITIES.medium}>Meduim</option>
                  <option value={TASK_PRIORITIES.low}>Low</option>
                  <option value={TASK_PRIORITIES.none}>None</option>
                </Form.Select>
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={6}>
            {/* Difficulty */}
            <Form.Label>Difficulty</Form.Label>
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
                  <option value={TASK_DIFFICULTIES.hard}>Hard</option>
                  <option value={TASK_DIFFICULTIES.normal}>Normal</option>
                  <option value={TASK_DIFFICULTIES.easy}>Easy</option>
                </Form.Select>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* TODO: Parent Task (Button + Modal) */}
        {/* TODO: Dependency Tasks */}
        {/* TODO: Blocked Tasks */}

        <Button variant="success" type="submit">
          Save
        </Button>
        <Button onClick={goBack}>Cancel</Button>
      </Form>
    </Container>
  );
};

export { TaskForm };
