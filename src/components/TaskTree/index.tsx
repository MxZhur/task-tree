import React from "react";
import { useAppSelector } from "../../store/hooks";

const TaskTree: React.FC = () => {
  const tasks = useAppSelector((state) => {
    return state.tasks.topLevelIDs
      .map((tID) => state.tasks.list.find((t) => t.id === tID) ?? null)
      .filter((e) => e !== null);
  });

  const content = tasks
    .filter((e) => e !== null)
    .map((t) => <p key={t?.id}>{t?.name}</p>);

  return <div>{content}</div>;
};

export { TaskTree };
