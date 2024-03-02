import React from "react";
import { ProgressBar } from "react-bootstrap";
import { useAppSelector } from "../../store/hooks";
import { calcAvgProgress } from "../../store/tasksSlice";

const ProjectOverallProgressBar: React.FC = () => {
  const overallProgress = useAppSelector((state) => {
    const allTopLevelTasks = state.tasks.list.filter((t) =>
      state.tasks.topLevelIDs.includes(t.id)
    );
    return calcAvgProgress(allTopLevelTasks);
  });

  return (
    <div
      className="mt-2"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "5%",
        whiteSpace: "nowrap",
      }}
    >
      <div>Project Progress&nbsp;</div>
      <ProgressBar
        style={{ height: "20px", width: "100%" }}
        variant={overallProgress >= 100 ? "success" : "primary"}
        now={overallProgress}
        label={overallProgress >= 100 ? "Completed" : overallProgress + "%"}
      />
    </div>
  );
};

export { ProjectOverallProgressBar };
