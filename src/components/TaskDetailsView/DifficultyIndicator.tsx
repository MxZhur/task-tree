import React from "react";
import { TASK_DIFFICULTIES } from "../../store/tasksSlice";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faFaceGrimace,
  faFaceLaughBeam,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

interface DifficultyIndicatorProps {
  difficulty: number;
  showLabel?: boolean;
}

const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
  difficulty,
  showLabel = false,
}) => {
  const { t } = useTranslation();

  let icon: IconProp;
  let label: string;
  let color: string;
  let tooltip: string;

  switch (difficulty) {
    case TASK_DIFFICULTIES.hard:
      icon = faFaceGrimace;
      label = t('difficulty.hard');
      color = "red";
      tooltip = t('difficulty.hard') + " " + t('difficulty.difficulty');
      break;
    case TASK_DIFFICULTIES.normal:
      icon = faFaceSmile;
      label = t('difficulty.normal');
      color = "green";
      tooltip = t('difficulty.normal') + " " + t('difficulty.difficulty');
      break;
    case TASK_DIFFICULTIES.easy:
      icon = faFaceLaughBeam;
      label = t('difficulty.easy');
      color = "skyblue";
      tooltip = t('difficulty.easy') + " " + t('difficulty.difficulty');
      break;
    default:
      icon = faFaceSmile;
      label = t('difficulty.normal');
      color = "green";
      tooltip = t('difficulty.normal') + " " + t('difficulty.difficulty');
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
