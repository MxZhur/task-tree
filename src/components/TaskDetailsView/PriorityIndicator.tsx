import React from "react";
import { TASK_PRIORITIES } from "../../store/tasksSlice";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCircle,
  faCircleExclamation,
  faFlag,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PriorityIndicatorProps {
  priority: number;
  showLabel?: boolean;
}

const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({
  priority,
  showLabel = false,
}) => {
  let icon: IconProp;
  let label: string;
  let color: string;
  let tooltip: string;

  switch (priority) {
    case TASK_PRIORITIES.critical:
      icon = faTriangleExclamation;
      label = "Critical";
      color = "red";
      tooltip = "Critical Priority";
      break;
    case TASK_PRIORITIES.high:
      icon = faCircleExclamation;
      label = "High";
      color = "darkorange";
      tooltip = "High Priority";
      break;
    case TASK_PRIORITIES.medium:
      icon = faFlag;
      label = "Meduim";
      color = "green";
      tooltip = "Medium Priority";
      break;
    case TASK_PRIORITIES.low:
      icon = faFlag;
      label = "Low";
      color = "skyblue";
      tooltip = "Low Priority";
      break;
    case TASK_PRIORITIES.none:
      icon = faCircle;
      label = "None";
      color = "lightgray";
      tooltip = "No Priority";
      break;
    default:
      icon = faCircle;
      label = "None";
      color = "lightgray";
      tooltip = "No Priority";
      break;
  }

  return (
    <div style={{ color: color }} title={tooltip}>
      <FontAwesomeIcon icon={icon} />
      <span className="unselectable">&nbsp;{showLabel && label}</span>
    </div>
  );
};

export default PriorityIndicator;
