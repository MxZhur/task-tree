import React, { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { TaskPickerItem } from "./TaskPickerItem";

interface TaskPickerProps {
  taskId: string | null;
  disabledTasksIds?: string[];
  onTaskIdChange: (taskId: string) => void;
}

const TaskPicker: React.FC<TaskPickerProps> = ({
  taskId = null,
  disabledTasksIds = [],
  onTaskIdChange,
}) => {
  const pickedTask = useAppSelector((state) =>
    state.tasks.list.find((t) => t.id === taskId)
  );

  const topLevelTasks = useAppSelector((state) => {
    return state.tasks.topLevelIDs
      .map((tID) => state.tasks.list.find((t) => t.id === tID) ?? null)
      .filter((e) => e !== null);
  });

  let taskNameJsx;

  if (taskId === null || pickedTask === undefined) {
    taskNameJsx = <span className="text-muted">None</span>;
  } else {
    taskNameJsx = <span>{pickedTask.name}</span>;
  }

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const onPick = (tId: string) => {
    handleCloseModal();
    onTaskIdChange(tId);
  };

  return (
    <>
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Button size="sm" title="Change" onClick={handleShowModal}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        &nbsp;
        <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {taskNameJsx}
        </div>
      </div>
      <Modal show={showModal} centered onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {topLevelTasks.map((t) => (
              <TaskPickerItem
                key={t?.id}
                task={t!}
                onPick={onPick}
                disabledTasksIds={disabledTasksIds}
              />
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export { TaskPicker };
