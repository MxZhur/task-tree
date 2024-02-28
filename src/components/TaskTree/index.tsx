import React from "react";
import { useAppSelector } from "../../store/hooks";
import { TaskTreeItem } from "./TaskTreeItem";
import "./index.css";

const TaskTree: React.FC = () => {
  const tasks = useAppSelector((state) => {
    return state.tasks.topLevelIDs
      .map((tID) => state.tasks.list.find((t) => t.id === tID) ?? null)
      .filter((e) => e !== null);
  });

  return (
    <div className="task-tree-container">
      {tasks.map((t) => (
        <TaskTreeItem key={t?.id} task={t!} />
      ))}
    </div>
  );
};

export { TaskTree };
