import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import Graph from "react-graph-vis";
import "./index.css";
import { nanoid } from "@reduxjs/toolkit";
import { Task, makeSelectNeighborTasks, selectSelectedTask } from "../../store/tasksSlice";
import { selectSelectedTaskId } from "../../store/selectedTaskSlice";

const getGraphData = (tasks: Task[], selectedTask: string | null = null) => {
  const taskIndexes: Record<string, number> = {};

  for (let index = 0; index < tasks.length; index++) {
    const t = tasks[index];

    taskIndexes[t.id] = index + 1;
  }

  const nodes = tasks.map((t) => ({
    id: taskIndexes[t.id],
    label: t.name,
    value: t.id,
    color: {
      background: t.id === selectedTask ? "#fff2a6" : "skyblue",
    },
    widthConstraint: {
      maximum: 100,
    },
  }));

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

  let defaultGraphData;

  if (selectedTask === undefined) {
    defaultGraphData = {nodes: [], edges: []};
  } else {
    defaultGraphData = getGraphData(tasks, selectedTask.id);
  }

  const [graphData, setGraphData] = useState(
    defaultGraphData
  );

  const [graphKey, setGraphKey] = useState(nanoid());

  useEffect(() => {
    let newGraphData;
    if (selectedTask === undefined) {
      newGraphData = {nodes: [], edges: []};
    } else {
      newGraphData = getGraphData(tasks, selectedTask.id);
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
        events={{
          // doubleClick: handleDoubleClick,
        }}
      />
    </div>
  );
};

export { TaskDependencyGraph };
