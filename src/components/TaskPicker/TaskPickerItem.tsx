import React from "react";
import { Task } from "../../store/tasksSlice";
import { useAppSelector } from "../../store/hooks";
import "./TaskPickerItem.css";

interface TaskPickerItemProps {
  task: Task;
  disabledTasksIds?: string[];
  onPick: (taskId: string) => void;
}

const TaskPickerItem: React.FC<TaskPickerItemProps> = ({
  task,
  disabledTasksIds,
  onPick,
}) => {
  const childTasks = useAppSelector((state) => {
    return task.childTasks
      .map((tID) => state.tasks.list.find((t) => t.id === tID))
      .filter((e) => e !== undefined);
  });

  const handleClick = () => {
    if (disabledTasksIds !== undefined && disabledTasksIds.includes(task.id)) {
      return;
    }
    onPick(task.id);
  };

  return (
    <>
      <div
        className="unselectable"
        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {disabledTasksIds !== undefined && disabledTasksIds.includes(task.id) ? (
          <span>{task.name}</span>
        ) : (
          <span className="btn btn-link" style={{padding: '0'}} onClick={handleClick}>
            {task.name}
          </span>
        )}
      </div>
      <div className="task-picker-item-child-container">
        {childTasks.length > 0 &&
          childTasks.map((t) => (
            <TaskPickerItem key={t!.id} task={t!} onPick={onPick} disabledTasksIds={disabledTasksIds} />
          ))}
      </div>
    </>
  );
};

export { TaskPickerItem };
