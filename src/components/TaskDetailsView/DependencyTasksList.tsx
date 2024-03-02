import React from "react";
import { Task } from "../../store/tasksSlice";
import { useAppDispatch } from "../../store/hooks";
import { setSelectedTask } from "../../store/selectedTaskSlice";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

interface DependencyTasksList {
  tasks: Task[];
  title?: string;
  flipIcon?: boolean;
}

const DependencyTasksList: React.FC<DependencyTasksList> = ({
  tasks,
  title,
  flipIcon
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleItemClick = (taskId:  string) => {
    dispatch(setSelectedTask(taskId));
  }

  let icon;

  if (flipIcon) {
    icon = <FontAwesomeIcon icon={faDiagramProject} rotation={180} />;
  } else {
    icon = <FontAwesomeIcon icon={faDiagramProject} />;
  }

  return (
    <>
      {title && <h6 className="unselectable" style={{marginBottom: 0, fontSize: '0.75rem', color: 'gray'}}>{icon}&nbsp;{title}</h6>}
      <div>
        {tasks.length === 0 ? (
          <div>{t('taskDetails.noTasks')}</div>
        ) : (
          tasks.map((t) => (
            <div
              style={{ overflow: "hidden", textOverflow: "ellipsis" }}
              key={t.id}
            >
              <a href="#" onClick={() => handleItemClick(t.id)} style={{ padding: 0 }}>
                {t.name}
              </a>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default DependencyTasksList;
