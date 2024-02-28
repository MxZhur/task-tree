import { createSlice, PayloadAction, nanoid, Draft } from "@reduxjs/toolkit";

type Task = {
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

type TaskFormFields = {
  name: string;
  description: string;
  priority: number;
  progress: number;
  difficulty: number;
  parentTaskId: string | null;
  dependencyTasks: string[];
  blockedTasks: string[];
};

type UpdateTaskFormFields = TaskFormFields & { id: string };
type UpdateProgressFormFields = {
  id: string;
  progress: number;
};

type MoveTaskFormFields = {
  id: string;
  parentId: string | null;
  beforeTaskId: string | null;
};

type TasksState = {
  topLevelIDs: string[];
  list: Task[];
};

const initialState: TasksState = {
  topLevelIDs: ['qwe', 'asd'],
  list: [
    {
      id: 'qwe',
      name: 'Qwerty',
      description: '',
      priority: 1,
      progress: 50,
      difficulty: 1,
      parentTaskId: null,
      childTasks: [],
      dependencyTasks: [],
    },
    {
      id: 'asd',
      name: 'Asdfgh',
      description: '',
      priority: 1,
      progress: 50,
      difficulty: 1,
      parentTaskId: null,
      childTasks: [],
      dependencyTasks: [],
    },
  ],
};

function calcAvgProgress(
  tasks: Draft<Task>[] | Task[],
  digitsAfterPoint: number = 1
) {
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
}

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
          let anotherTask = state.list[index];

          if (anotherTask.id === newTaskId) {
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
      updatedTask.parentTaskId !== payload.parentTaskId;
      updatedTask.dependencyTasks = payload.dependencyTasks;

      if (oldParentTaskId !== payload.parentTaskId) {
        // Update old parent's child IDs

        if (oldParentTaskId !== null) {
          let oldParentTask = state.list.find(
            (el) => el.id === oldParentTaskId
          );

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

        if (updatedTask.parentTaskId !== null) {
          let newParentTask = state.list.find(
            (el) => el.id === updatedTask?.parentTaskId
          );

          if (newParentTask !== undefined && updatedTask?.id !== null) {
            newParentTask.childTasks.push(updatedTask.id);
          }
        } else {
          state.topLevelIDs.push(updatedTask.id);
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
        deletedBlockedTasksIDs.length > 0 &&
        addedBlockedTasksIDs.length > 0
      ) {
        for (let index = 0; index < deletedBlockedTasksIDs.length; index++) {
          let anotherTask = state.list[index];

          if (anotherTask.id === payload.id) {
            continue;
          }

          anotherTask.dependencyTasks = anotherTask.dependencyTasks.filter(
            (el) => el !== updatedTask?.id
          );
        }

        for (let index = 0; index < addedBlockedTasksIDs.length; index++) {
          let anotherTask = state.list[index];

          if (anotherTask.id === payload.id) {
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
    moveTask(state, action: PayloadAction<MoveTaskFormFields>) {
      const { payload } = action;

      let movedTask = state.list.find((el) => el.id === payload.id);

      if (movedTask === undefined) {
        return;
      }

      const oldParentTaskId = movedTask.parentTaskId;

      movedTask.parentTaskId = payload.parentId;

      if (oldParentTaskId !== payload.parentId) {
        // Update old parent's child IDs

        if (oldParentTaskId !== null) {
          let oldParentTask = state.list.find(
            (el) => el.id === oldParentTaskId
          );

          if (oldParentTask !== undefined) {
            oldParentTask.childTasks = oldParentTask.childTasks.filter(
              (el) => el !== movedTask?.id
            );
          }
        } else {
          state.topLevelIDs = state.topLevelIDs.filter(
            (el) => el !== movedTask?.id
          );
        }

        // Update new parent's child IDs (at the specific place in the array)

        if (movedTask.parentTaskId !== null) {
          let newParentTask = state.list.find(
            (el) => el.id === movedTask?.parentTaskId
          );

          if (newParentTask !== undefined && movedTask?.id !== null) {
            if (payload.beforeTaskId === null) {
              newParentTask.childTasks.push(movedTask.id);
            } else {
              const beforeTaskIndex = newParentTask.childTasks.findIndex(
                (el) => el === payload.beforeTaskId
              );

              if (beforeTaskIndex !== -1) {
                newParentTask.childTasks.splice(
                  beforeTaskIndex,
                  0,
                  movedTask.id
                );
              }
            }
          } else {
            if (payload.beforeTaskId === null) {
              state.topLevelIDs.push(movedTask.id);
            } else {
              const beforeTaskIndex = state.topLevelIDs.findIndex(
                (el) => el === payload.beforeTaskId
              );

              if (beforeTaskIndex !== -1) {
                state.topLevelIDs.splice(beforeTaskIndex, 0, movedTask.id);
              }
            }
          }
        }
      }

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
  },
});

export const { addTask, updateTask, updateProgress, moveTask, deleteTask } =
  tasksSlice.actions;

// TODO: Selectors:
// - Find all top-level tasks

// export const selectAllTopLevelTasks = (state) => {
//   const topLevelTasks = state.tasks.topLevelIDs
//       .map((tID) => state.list.find((t) => t.id === tID) ?? null)
//       .filter((e) => e !== null);
// }



// - Find all child tasks by parent task ID

// - Get task by ID

export default tasksSlice.reducer;