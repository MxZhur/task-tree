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
import { useTranslation } from "react-i18next";

interface PriorityIndicatorProps {
  priority: number;
  showLabel?: boolean;
}

const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({
  priority,
  showLabel = false,
}) => {
  const { t } = useTranslation();

  let icon: IconProp;
  let label: string;
  let color: string;
  let tooltip: string;

  switch (priority) {
    case TASK_PRIORITIES.critical:
      icon = faTriangleExclamation;
      label = t('priority.critical');
      color = "red";
      tooltip = t('priority.critical') + " " + t('priority.priority');
      break;
    case TASK_PRIORITIES.high:
      icon = faCircleExclamation;
      label = t('priority.high');
      color = "darkorange";
      tooltip = t('priority.high') + " " + t('priority.priority');
      break;
    case TASK_PRIORITIES.medium:
      icon = faFlag;
      label = t('priority.medium');
      color = "green";
      tooltip = t('priority.medium') + " " + t('priority.priority');
      break;
    case TASK_PRIORITIES.low:
      icon = faFlag;
      label = t('priority.low');
      color = "skyblue";
      tooltip = t('priority.low') + " " + t('priority.priority');
      break;
    case TASK_PRIORITIES.none:
      icon = faCircle;
      label = t('priority.none');
      color = "lightgray";
      tooltip = t('priority.no') + " " + t('priority.priority');
      break;
    default:
      icon = faCircle;
      label = t('priority.none');
      color = "lightgray";
      tooltip = t('priority.no') + " " + t('priority.priority');
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
