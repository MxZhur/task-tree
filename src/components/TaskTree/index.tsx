import React, { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { TaskTreeItem } from "./TaskTreeItem";
import "./index.css";
import { selectAllTopLevelTasks } from "../../store/tasksSlice";

const TaskTree: React.FC = () => {
  const tasks = useAppSelector(selectAllTopLevelTasks);

  const [collapsedItems, setCollapsedItems] = useState<string[]>([]);

  const toggleItemExpansion = (taskId: string) => {
    let newCollapsedItems = [...collapsedItems];

    if (collapsedItems.includes(taskId)) {
      newCollapsedItems = newCollapsedItems.filter(e => e !== taskId);
    } else {
      newCollapsedItems.push(taskId);
    }

    setCollapsedItems(newCollapsedItems);
  }

  return (
    <div className="task-tree-container">
      {tasks.map((t) => (
        <TaskTreeItem
          key={t?.id}
          task={t!}
          collapsedItems={collapsedItems}
          toggleItemExpansion={toggleItemExpansion}
        />
      ))}
    </div>
  );
};

export { TaskTree };
