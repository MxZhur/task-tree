import React, { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faEdit } from "@fortawesome/free-solid-svg-icons";
import { TaskPickerItem } from "./TaskPickerItem";
import { useTranslation } from "react-i18next";
import { Task, makeSelectTaskById, selectAllTasks, selectTopLevelIDs } from "../../store/tasksSlice";

interface TaskPickerProps {
  taskId: string | null;
  disabledTasksIds?: string[];
  onTaskIdChange: (taskId: string | null) => void;
  recursive?: boolean;
  placeholder?: string;
  availableTasksIds?: string[];
}

const TaskPicker: React.FC<TaskPickerProps> = ({
  taskId = null,
  disabledTasksIds = [],
  onTaskIdChange,
  recursive = true,
  placeholder = "-",
  availableTasksIds = [],
}) => {
  const { t } = useTranslation();

  const pickedTask = useAppSelector(makeSelectTaskById(taskId));

  const allTasks: Task[] = useAppSelector(selectAllTasks);
  const allTopLevelTasksIds = useAppSelector(selectTopLevelIDs);

  let tasks;

  if (availableTasksIds !== undefined && availableTasksIds.length > 0) {
    tasks = availableTasksIds
      .map((tID) => allTasks.find((t) => t.id === tID) ?? null)
      .filter((e) => e !== null);
  } else {
    tasks = allTopLevelTasksIds
      .map((tID) => allTasks.find((t) => t.id === tID) ?? null)
      .filter((e) => e !== null);
  }

  let taskNameJsx;

  if (taskId === null || pickedTask === undefined) {
    taskNameJsx = <span className="text-muted">{placeholder}</span>;
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

  const onClear = () => {
    handleCloseModal();
    onTaskIdChange(null);
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
        <Button size="sm" title={t('change')} onClick={handleShowModal}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        &nbsp;
        <Button
          size="sm"
          variant="danger"
          title={t('clear')}
          onClick={onClear}
        >
          <FontAwesomeIcon icon={faClose} />
        </Button>
        &nbsp;
        <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {taskNameJsx}
        </div>
      </div>
      <Modal show={showModal} centered onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t('selectTask')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {tasks.map((t) => (
              <TaskPickerItem
                key={t?.id}
                task={t!}
                onPick={onPick}
                disabledTasksIds={disabledTasksIds}
                recursive={recursive}
              />
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export { TaskPicker };
