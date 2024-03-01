import React from "react";
import { Task } from "../../store/tasksSlice";
import "./TaskMultiPickerListItem.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove } from "@fortawesome/free-solid-svg-icons";

interface TaskMultiPickerListItemProps {
  task: Task;
  onRemoveClick: (taskId: string) => void;
}

const TaskMultiPickerListItem: React.FC<TaskMultiPickerListItemProps> = ({
  task,
  onRemoveClick,
}) => {
  return (
    <div className="task-multi-picker-list-item-container">
      <div className="task-multi-picker-list-item-name">{task.name}</div>
      <div>
        <Button variant="link" size="sm" onClick={() => onRemoveClick(task.id)}>
          <FontAwesomeIcon icon={faRemove} color="red" />
        </Button>
      </div>
    </div>
  );
};

export { TaskMultiPickerListItem };
