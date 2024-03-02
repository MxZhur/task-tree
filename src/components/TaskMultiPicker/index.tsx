import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useAppSelector } from "../../store/hooks";
import { TaskMultiPickerListItem } from "./TaskMultiPickerListItem";
import "./index.css";
import { TaskPickerItem } from "../TaskPicker/TaskPickerItem";
import { useTranslation } from "react-i18next";

interface TaskMultiPickerProps {
  selectedTasksIds: string[];
  availableTasksIds: string[];
  disabledTasksIds: string[];
  onAdd: (taskId: string) => void;
  onRemove: (taskId: string) => void;
}

const TaskMultiPicker: React.FC<TaskMultiPickerProps> = ({
  selectedTasksIds = [],
  availableTasksIds = [],
  disabledTasksIds = [],
  onAdd,
  onRemove,
}) => {
  const { t } = useTranslation();

  const selectedTasks = useAppSelector((state) =>
    state.tasks.list.filter((t) => selectedTasksIds.includes(t.id))
  );

  const availableTasks = useAppSelector((state) =>
    state.tasks.list.filter((t) => availableTasksIds.includes(t.id))
  );

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const onPick = (tId: string) => {
    handleCloseModal();
    onAdd(tId);
  };

  return (
    <>
      <div className="task-multi-picker-container">
        <div className="d-grid gap-2">
          <Button size="sm" onClick={handleShowModal}>
            <FontAwesomeIcon icon={faAdd} /> {t('add')}
          </Button>
        </div>
        <div className="task-multi-picker-list-container">
          {selectedTasks.map((t) => (
            <TaskMultiPickerListItem
              key={t.id}
              task={t}
              onRemoveClick={onRemove}
            />
          ))}
        </div>
      </div>
      <Modal show={showModal} centered onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t('selectTask')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {availableTasks.map((t) => (
              <TaskPickerItem
                key={t?.id}
                task={t!}
                onPick={onPick}
                disabledTasksIds={disabledTasksIds}
                recursive={false}
              />
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export { TaskMultiPicker };
