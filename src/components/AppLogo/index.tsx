import React from "react";
import taskTreeIcon from "../../assets/task-tree.svg";
import "./index.css";

const AppLogo: React.FC = () => {
  return (
    <div className="app-logo-container">
      <img src={taskTreeIcon} height={200} />
      <div className="app-logo-name">
        <div>Task</div>
        <div>Tree</div>
      </div>
    </div>
  );
};

export { AppLogo };
