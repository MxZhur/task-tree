import React from "react";
import { useAppSelector } from "../../store/hooks";
import { Task } from "../../store/tasksSlice";

interface TaskTreeItemProps {
  task: Task;
}

const TaskTreeItem: React.FC<TaskTreeItemProps> = ({ task }) => {
  const childTasks = useAppSelector((state) =>
    task.childTasks
      .map((tID) => state.tasks.list.find((t) => t.id === tID))
      .filter((e) => e !== undefined)
  );

  return (
    <>
      <div>
        <span className="unselectable">{task.name}</span>
      </div>
      {childTasks.length > 0 && (
        <div style={{ marginLeft: 10 }}>
          {childTasks.map((t) => (
            <TaskTreeItem key={t?.id} task={t!} />
          ))}
        </div>
      )}
    </>
  );
};

export { TaskTreeItem };
