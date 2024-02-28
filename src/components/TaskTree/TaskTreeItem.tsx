import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Task } from "../../store/tasksSlice";
import "./TaskTreeItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "react-bootstrap";
import { setSelectedTask } from "../../store/selectedTaskSlice";

interface TaskTreeItemProps {
  task: Task;
}

const TaskTreeItem: React.FC<TaskTreeItemProps> = ({ task }) => {
  const dispatch = useAppDispatch();

  const childTasks = useAppSelector((state) =>
    task.childTasks
      .map((tID) => state.tasks.list.find((t) => t.id === tID))
      .filter((e) => e !== undefined)
  );

  const isSelected = useAppSelector((state) => state.selectedTask.taskId === task.id);

  const isExpanded = true;

  const expandButton = <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} />;
  const expandButtonPlaceHolder = (
    <div style={{ height: "1rem", width: "10px" }} />
  );

  const handleClick = () => {
    dispatch(setSelectedTask(task.id));
  }
  
  const handleDoubleClick = () => {
    // TODO: Go to edit form
  }

  return (
    <>
      <div
        className={
          "task-tree-item-container" + (isSelected ? " task-tree-item-active" : "")
        }
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div className="task-tree-item-title unselectable">
          {childTasks.length > 0 ? expandButton : expandButtonPlaceHolder}
          <div style={{ width: "5px" }}></div>
          <div className="task-tree-item-name">
            {task.name}
          </div>
        </div>
        {task!.progress! < 100 ? (
          <ProgressBar
            variant="info"
            style={{ width: "50px" }}
            min={0}
            max={100}
            now={task!.progress!}
            label={task!.progress! + "%"}
          />
        ) : (
          <div className="task-tree-item-checkmark-container">
            <FontAwesomeIcon icon={faCheck} color={isSelected ? "white" : "green"} />
          </div>
        )}
      </div>
      {childTasks.length > 0 && (
        <div className="task-tree-child-container">
          {childTasks.map((t) => (
            <TaskTreeItem key={t?.id} task={t!} />
          ))}
        </div>
      )}
    </>
  );
};

export { TaskTreeItem };
