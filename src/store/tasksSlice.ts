import { createSlice, PayloadAction, nanoid, Draft } from "@reduxjs/toolkit";
import { RootState } from ".";
import { selectSelectedTaskId } from "./selectedTaskSlice";
import { createAppSelector } from "./hooks";

export type Task = {
  id: string;
  name: string;
  description: string;
  priority: number;
  progress: number | null;
  difficulty: number;
  parentTaskId: string | null;
  childTasks: string[];
  dependencyTasks: string[];
};

export const TASK_PRIORITIES = {
  critical: 1,
  high: 2,
  medium: 3,
  low: 4,
  none: 5,
};

export const TASK_DIFFICULTIES = {
  hard: 2,
  normal: 1,
  easy: 0.5,
};

export type TaskFormFields = {
  name: string;
  description: string;
  priority: number;
  progress: number;
  difficulty: number;
  parentTaskId: string | null;
  beforeTaskId: string | null;
  dependencyTasks: string[];
  blockedTasks: string[];
};

export type UpdateTaskFormFields = TaskFormFields & { id: string };
export type UpdateProgressFormFields = {
  id: string;
  progress: number;
};

export type TasksState = {
  topLevelIDs: string[];
  list: Task[];
};

const initialState: TasksState = {
  topLevelIDs: [],
  list: [],
};

export const calcAvgProgress = (
  tasks: Draft<Task>[] | Task[],
  digitsAfterPoint: number = 1
) => {
  if (tasks.length === 0) {
    return 0;
  }

  const progressWeightedSum = tasks
    .map((t) => (t.progress ?? 0) * (t.difficulty ?? 1))
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const difficultySum = tasks
    .map((t) => t.difficulty ?? 1)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const avgProgressRaw = progressWeightedSum / difficultySum;

  if (avgProgressRaw - Math.floor(avgProgressRaw) !== 0) {
    return (
      Math.round(avgProgressRaw * (digitsAfterPoint * 10)) /
      (digitsAfterPoint * 10)
    );
  } else {
    return avgProgressRaw;
  }
};

function recalculateProgress(state: Draft<TasksState>) {
  const leafTasksIDs = state.list
    .filter((t) => t.childTasks.length === 0)
    .map((t) => t.id);

  let processedTasksIDs: string[] = [];

  let queue: string[] = [...leafTasksIDs];

  while (queue.length > 0) {
    let nextQueue: string[] = [];

    for (const queuedID of queue) {
      let queuedTask = state.list.find((t) => t.id === queuedID);

      if (queuedTask === undefined) {
        continue;
      }

      if (queuedTask.childTasks.length > 0) {
        queuedTask.progress = calcAvgProgress(
          state.list.filter((t) => t.parentTaskId === queuedID)
        );
      }

      processedTasksIDs.push(queuedID);

      if (
        queuedTask.parentTaskId !== null &&
        !nextQueue.includes(queuedTask.parentTaskId)
      ) {
        nextQueue.push(queuedTask.parentTaskId);
      }
    }

    queue = nextQueue;
  }
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<TaskFormFields>) {
      const { payload } = action;

      const newTaskId = nanoid();

      let newTask = <Task>{
        id: newTaskId,
        name: payload.name,
        description: payload.description,
        priority: payload.priority,
        progress: payload.progress,
        difficulty: payload.difficulty,
        parentTaskId: payload.parentTaskId || null,
        childTasks: [],
        dependencyTasks: payload.dependencyTasks,
      };

      state.list.push(newTask);

      // Insert (push) the task to the parent's childTasks array

      const parentTaskId = action.payload.parentTaskId;

      if (parentTaskId !== null) {
        let parentTask = state.list.find((el) => el.id === parentTaskId);

        if (parentTask !== undefined) {
          parentTask.childTasks.push(newTaskId);
        }
      } else {
        state.topLevelIDs.push(newTaskId);
      }

      if (payload.blockedTasks.length > 0) {
        // Update dependencyTasks for all blocked tasks (remove old, then add new)

        for (let index = 0; index < payload.blockedTasks.length; index++) {
          let anotherTask = state.list.find(
            (t) => t.id === payload.blockedTasks[index]
          );

          if (
            anotherTask === undefined ||
            anotherTask.id === newTaskId ||
            anotherTask.id === payload.parentTaskId
          ) {
            continue;
          }

          anotherTask.dependencyTasks.push(newTaskId);
        }
      }

      recalculateProgress(state);
    },
    updateTask(state, action: PayloadAction<UpdateTaskFormFields>) {
      const { payload } = action;

      let updatedTask = state.list.find((el) => el.id === payload.id);

      if (updatedTask === undefined) {
        return;
      }

      // Cache some old values
      const oldParentTaskId = updatedTask.parentTaskId;
      const oldBlockedTasks = state.list
        .filter((el) => el.dependencyTasks.some((e) => e === updatedTask?.id))
        .map((el) => el.id);

      // Update fields

      updatedTask.name = payload.name;
      updatedTask.description = payload.description;
      updatedTask.priority = payload.priority;
      updatedTask.progress = payload.progress;
      updatedTask.difficulty = payload.difficulty;
      updatedTask.parentTaskId = payload.parentTaskId;
      updatedTask.dependencyTasks = payload.dependencyTasks;

      // Update old parent's child IDs

      if (oldParentTaskId !== null) {
        let oldParentTask = state.list.find((el) => el.id === oldParentTaskId);

        if (oldParentTask !== undefined) {
          oldParentTask.childTasks = oldParentTask.childTasks.filter(
            (el) => el !== updatedTask?.id
          );
        }
      } else {
        state.topLevelIDs = state.topLevelIDs.filter(
          (el) => el !== updatedTask?.id
        );
      }

      // Update new parent's child IDs

      if (payload.parentTaskId !== null) {
        let newParentTask = state.list.find(
          (el) => el.id === payload.parentTaskId
        );

        if (newParentTask !== undefined && updatedTask?.id !== null) {
          if (payload.beforeTaskId === null) {
            newParentTask.childTasks.push(updatedTask.id);
          } else {
            const beforeTaskIndex = newParentTask.childTasks.findIndex(
              (el) => el === payload.beforeTaskId
            );

            if (beforeTaskIndex !== -1) {
              newParentTask.childTasks.splice(
                beforeTaskIndex,
                0,
                updatedTask.id
              );
            }
          }
        }
      } else {
        if (payload.beforeTaskId === null) {
          state.topLevelIDs.push(updatedTask.id);
        } else {
          const beforeTaskIndex = state.topLevelIDs.findIndex(
            (el) => el === payload.beforeTaskId
          );

          if (beforeTaskIndex !== -1) {
            state.topLevelIDs.splice(beforeTaskIndex, 0, updatedTask.id);
          }
        }
      }

      // Update dependencyTasks for all blocked tasks (remove old, then add new)

      const deletedBlockedTasksIDs = oldBlockedTasks.filter(
        (el) => !payload.blockedTasks.includes(el)
      );
      const addedBlockedTasksIDs = payload.blockedTasks.filter(
        (el) => !oldBlockedTasks.includes(el)
      );

      if (
        deletedBlockedTasksIDs.length > 0 ||
        addedBlockedTasksIDs.length > 0
      ) {
        for (let index = 0; index < deletedBlockedTasksIDs.length; index++) {
          let anotherTask = state.list.find(
            (t) => t.id === deletedBlockedTasksIDs[index]
          );

          if (
            anotherTask === undefined ||
            anotherTask.id === updatedTask?.id ||
            anotherTask.id === updatedTask?.parentTaskId
          ) {
            continue;
          }

          anotherTask.dependencyTasks = anotherTask.dependencyTasks.filter(
            (el) => el !== updatedTask?.id
          );
        }

        for (let index = 0; index < addedBlockedTasksIDs.length; index++) {
          let anotherTask = state.list.find(
            (t) => t.id === addedBlockedTasksIDs[index]
          );

          if (
            anotherTask === undefined ||
            anotherTask.id === updatedTask?.id ||
            anotherTask.id === updatedTask?.parentTaskId
          ) {
            continue;
          }

          anotherTask.dependencyTasks.push(updatedTask?.id);
        }
      }

      recalculateProgress(state);
    },
    updateProgress(state, action: PayloadAction<UpdateProgressFormFields>) {
      const { payload } = action;

      let updatedTask = state.list.find((el) => el.id === payload.id);

      if (updatedTask === undefined) {
        return;
      }

      if (updatedTask.progress === payload.progress) {
        return;
      }

      updatedTask.progress = payload.progress;

      recalculateProgress(state);
    },
    deleteTask(state, action: PayloadAction<string>) {
      const { payload } = action;

      let task = state.list.find((el) => el.id === payload);

      if (task === undefined) {
        return;
      }

      // Find all the tasks to delete recursively, and write down their IDs

      let processedTasksIDs: string[] = [];
      let tasksToDelete: string[] = [task.id];

      let queue = [task.id];

      while (queue.length > 0) {
        let processedTaskID = queue.shift();

        let processedTask = state.list.find((el) => el.id === processedTaskID);

        if (processedTask === undefined) {
          continue;
        }

        for (let childID of processedTask.childTasks) {
          if (!processedTasksIDs.includes(childID)) {
            queue.push(childID);
            processedTasksIDs.push(childID);
            tasksToDelete.push(childID);
          }
        }
      }

      // Filter out the tasks by their IDs

      state.topLevelIDs = state.topLevelIDs.filter(
        (el) => !tasksToDelete.includes(el)
      );
      state.list = state.list.filter((el) => !tasksToDelete.includes(el.id));

      recalculateProgress(state);
    },
    clearTasks(state) {
      state.list = [];
      state.topLevelIDs = [];
    },
    loadTasks(state, action: PayloadAction<string>) {
      const loadedState = JSON.parse(action.payload);
      state.list = loadedState.list;
      state.topLevelIDs = loadedState.topLevelIDs;
    },
  },
});

export const {
  addTask,
  updateTask,
  updateProgress,
  deleteTask,
  clearTasks,
  loadTasks,
} = tasksSlice.actions;

// Selectors

export const selectTopLevelIDs = (state: RootState) => state.tasks.topLevelIDs;
export const selectAllTasks = (state: RootState) => state.tasks.list;

export const selectAllTopLevelTasks = createAppSelector(
  selectTopLevelIDs,
  selectAllTasks,
  (topLevelIDs, allTasks) =>
    topLevelIDs
      .map((tID) => allTasks.find((t) => t.id === tID) ?? null)
      .filter((e) => e !== null)
);

export const selectSelectedTask = createAppSelector(
  selectSelectedTaskId,
  selectAllTasks,
  (selTaskId, allTasks) => allTasks.find((t) => t.id === selTaskId)
);

export const makeSelectNeighborTasks = (task: Task | undefined) => {
  return createAppSelector(
    [selectAllTasks, selectTopLevelIDs, (_) => task],
    (tasks, topLevelIDs, t) => {
      if (t === undefined) {
        return [];
      }

      if (t.parentTaskId === null) {
        return tasks.filter((filteredTask) =>
          topLevelIDs.includes(filteredTask.id)
        );
      } else {
        return tasks.filter(
          (filteredTask) => t.parentTaskId === filteredTask.parentTaskId
        );
      }
    }
  );
};

export const makeSelectDependencyTasks = (task: Task | undefined) => {
  return createAppSelector([selectAllTasks, (_) => task], (tasks, t) => {
    if (t === undefined) {
      return [];
    }
    return tasks.filter((filteredTask) =>
      t.dependencyTasks.includes(filteredTask.id)
    );
  });
};

export const makeSelectBlockedTasks = (task: Task | undefined) => {
  return createAppSelector([selectAllTasks, (_) => task], (tasks, t) => {
    if (t === undefined) {
      return [];
    }
    return tasks.filter((filteredTask) =>
      filteredTask.dependencyTasks.includes(t.id)
    );
  });
};

export const makeSelectBlockedTasksIds = (task: Task | undefined) => {
  return createAppSelector([selectAllTasks, (_) => task], (tasks, t) => {
    if (t === undefined) {
      return [];
    }
    return tasks
      .filter((filteredTask) => filteredTask.dependencyTasks.includes(t.id))
      .map((mappedTask) => mappedTask.id);
  });
};

export const makeSelectChildTasks = (task: Task) => {
  return createAppSelector([selectAllTasks, (_) => task], (tasks, t) =>
    t.childTasks
      .map((tID) => tasks.find((searchedTask) => searchedTask.id === tID))
      .filter((e) => e !== undefined)
  );
};

export const makeSelectTaskById = (taskId: string | null | undefined) => {
  return createAppSelector(
    [selectAllTasks, (_) => taskId],
    (tasks, tId) => {
      if (!taskId) {
        return undefined;
      }

      return tasks.find((t) => t.id === tId);
    }
  );
};

export const makeSelectTasksByIds = (tasksIds: string[]) => {
  return createAppSelector(
    [selectAllTasks, (_) => tasksIds],
    (tasks, tIds) => tasks.filter((t) => tIds.includes(t.id))
  );
};

export const makeSelectTaskSubtreeIdsById = (taskId: string | null | undefined) => {
  return createAppSelector(
    [selectAllTasks, (_) => taskId],
    (tasks, tId) => {
      if (!tId) {
        return [];
      }

      let task = tasks.find((el) => el.id === tId);

      if (task === undefined) {
        return [];
      }

      // Find all the child tasks recursively, and write down their IDs

      let processedTasksIDs: string[] = [];
      let result: string[] = [task.id];

      let queue = [task.id];

      while (queue.length > 0) {
        let processedTaskID = queue.shift();

        let processedTask = tasks.find((el) => el.id === processedTaskID);

        if (processedTask === undefined) {
          continue;
        }

        for (let childID of processedTask.childTasks) {
          if (!processedTasksIDs.includes(childID)) {
            queue.push(childID);
            processedTasksIDs.push(childID);
            result.push(childID);
          }
        }
      }

      return result;
    }
  );
};

export default tasksSlice.reducer;
