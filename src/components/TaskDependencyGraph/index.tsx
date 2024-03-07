import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import Graph from "react-graph-vis";
import "./index.css";
import { nanoid } from "@reduxjs/toolkit";
import {
  TASK_DIFFICULTIES,
  TASK_PRIORITIES,
  Task,
  makeSelectNeighborTasks,
  selectSelectedTask,
} from "../../store/tasksSlice";
import { selectSelectedTaskId } from "../../store/selectedTaskSlice";
import {
  GRAPH_COLORING_MODES,
  selectSettings,
} from "../../store/settingsSlice";

const getGraphData = (
  tasks: Task[],
  selectedTaskId: string | null = null,
  graphColoringMode: string = "off"
) => {
  const taskIndexes: Record<string, number> = {};

  for (let index = 0; index < tasks.length; index++) {
    const t = tasks[index];

    taskIndexes[t.id] = index + 1;
  }

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  const nodes = tasks.map((t) => {
    let nodeColor = "skyblue";

    if (graphColoringMode === GRAPH_COLORING_MODES.priority) {
      switch (t.priority) {
        case TASK_PRIORITIES.critical:
          nodeColor = "#ffbfb3";
          break;

        case TASK_PRIORITIES.high:
          nodeColor = "#ffffb3";
          break;

        case TASK_PRIORITIES.medium:
          nodeColor = "#ccfcda";
          break;

        case TASK_PRIORITIES.low:
          nodeColor = "#ccf0fc";
          break;

        case TASK_PRIORITIES.none:
          nodeColor = "#dddddd";
          break;

        default:
          break;
      }
    } else if (graphColoringMode === GRAPH_COLORING_MODES.difficulty) {
      switch (t.difficulty) {
        case TASK_DIFFICULTIES.hard:
          nodeColor = "#ffbfb3";
          break;

        case TASK_DIFFICULTIES.normal:
          nodeColor = "#ccfcda";
          break;

        case TASK_DIFFICULTIES.easy:
          nodeColor = "#ccf0fc";
          break;

        default:
          break;
      }
    } else if (graphColoringMode === GRAPH_COLORING_MODES.progress) {
      if (t.progress !== null && t.progress >= 100) {
        nodeColor = "#ccfcda";
      }
    } else if (graphColoringMode === GRAPH_COLORING_MODES.dependencies) {
      if (
        selectedTask !== undefined &&
        selectedTask.dependencyTasks.includes(t.id)
      ) {
        nodeColor = "#ffbfb3";
      }
    }

    return {
      id: taskIndexes[t.id],
      label: t.name,
      value: t.id,
      borderWidth: t.id === selectedTaskId ? 2 : 1,
      color: {
        background: t.id === selectedTaskId ? "white" : nodeColor,
        border: t.id === selectedTaskId ? "red" : "#2b7ce9",
      },
      widthConstraint: {
        maximum: 100,
      },
    };
  });

  let edges = [];

  for (let index = 0; index < tasks.length; index++) {
    const t = tasks[index];

    for (let j = 0; j < t.dependencyTasks.length; j++) {
      const depTaskId = t.dependencyTasks[j];

      edges.push({ from: taskIndexes[depTaskId], to: taskIndexes[t.id] });
    }
  }

  return { nodes, edges };
};

const TaskDependencyGraph: React.FC = () => {
  const selectedTaskId = useAppSelector(selectSelectedTaskId);
  const selectedTask = useAppSelector(selectSelectedTask);

  const tasks = useAppSelector(makeSelectNeighborTasks(selectedTask));

  const { graphColoringMode } = useAppSelector(selectSettings);

  let defaultGraphData;

  if (selectedTask === undefined) {
    defaultGraphData = { nodes: [], edges: [] };
  } else {
    defaultGraphData = getGraphData(tasks, selectedTask.id, graphColoringMode);
  }

  const [graphData, setGraphData] = useState(defaultGraphData);

  const [graphKey, setGraphKey] = useState(nanoid());

  useEffect(() => {
    let newGraphData;
    if (selectedTask === undefined) {
      newGraphData = { nodes: [], edges: [] };
    } else {
      newGraphData = getGraphData(tasks, selectedTask.id, graphColoringMode);
    }
    setGraphData(newGraphData);
    setGraphKey(nanoid());
  }, [selectedTaskId]);

  // const handleDoubleClick = (event) => {
  //   const taskIds = tasks.map((t) => t.id);
  //   if (event.nodes.length === 0) {
  //     return;
  //   }
  //   const taskIndex = event.nodes[0] - 1;
  //   const taskId = taskIds[taskIndex];
  //   dispatch(setSelectedTask(taskId));
  // }

  return (
    <div className="task-graph-container">
      <Graph
        key={graphKey}
        graph={graphData}
        options={{
          edges: {
            arrows: "to",
          },
        }}
        events={
          {
            // doubleClick: handleDoubleClick,
          }
        }
      />
    </div>
  );
};

export { TaskDependencyGraph };
