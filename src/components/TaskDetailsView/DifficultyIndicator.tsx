import React from "react";
import { TASK_DIFFICULTIES } from "../../store/tasksSlice";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faFaceGrimace,
  faFaceLaughBeam,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DifficultyIndicatorProps {
  difficulty: number;
  showLabel?: boolean;
}

const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
  difficulty,
  showLabel = false,
}) => {
  let icon: IconProp;
  let label: string;
  let color: string;
  let tooltip: string;

  switch (difficulty) {
    case TASK_DIFFICULTIES.hard:
      icon = faFaceGrimace;
      label = "Hard";
      color = "red";
      tooltip = "Hard Difficulty";
      break;
    case TASK_DIFFICULTIES.normal:
      icon = faFaceSmile;
      label = "Normal";
      color = "green";
      tooltip = "Normal Difficulty";
      break;
    case TASK_DIFFICULTIES.easy:
      icon = faFaceLaughBeam;
      label = "Easy";
      color = "skyblue";
      tooltip = "Easy Difficulty";
      break;
    default:
      icon = faFaceSmile;
      label = "Normal";
      color = "green";
      tooltip = "Normal Difficulty";
      break;
  }

  return (
    <div style={{ color: color }} title={tooltip}>
      <FontAwesomeIcon icon={icon} />
      <span className="unselectable">&nbsp;{showLabel && label}</span>
    </div>
  );
};

export default DifficultyIndicator;
