import React, { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { TaskTreeItem } from "./TaskTreeItem";
import "./index.css";

const TaskTree: React.FC = () => {
  const tasks = useAppSelector((state) => {
    return state.tasks.topLevelIDs
      .map((tID) => state.tasks.list.find((t) => t.id === tID) ?? null)
      .filter((e) => e !== null);
  });

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
