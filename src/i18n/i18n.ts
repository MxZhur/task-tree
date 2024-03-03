import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          titleNewProject: "New Project",
          clear: "Clear",
          about: "About",
          settings: "Settings",
          delete: "Delete",
          deleteTask: "Delete Task",
          completed: "Completed",
          projectProgress: "Project Progress",
          newTask: "New Task",
          editTask: "Edit Task",
          add: "Add",
          remove: "Remove",
          cancel: "Cancel",
          selectTask: "Select Task",
          change: "Change",
          back: 'Back',
          welcomePage: {
            newFile: "New File",
            openFile: "Open File...",
            recentFiles: "Recent Files",
          },
          menuBar: {
            newFile: "New File",
            openFile: "Open File...",
            saveFile: "Save",
            saveAs: "Save As...",
          },
          taskDetails: {
            pleaseSelectTask: "Select a task",
            details: "Details",
            addSubtask: "Subtask",
            edit: "Edit",
            delete: "Delete",
            description: "Description",
            dependencyTasks: "Dependency Tasks",
            blockedTasks: "Blocked Tasks",
            noTasks: "None",
          },
          taskFormFields: {
            labelName: "Name",
            labelDescription: "Description",
            labelProgress: "Progress",
            btnMarkAsDone: "Mark as done",
            msgProgressCalculated:
              "Calculated from child tasks. Change their progress if you want to change this.",
            labelPriority: "Priority",
            labelDifficulty: "Difficulty",
            labelParentTask: "Parent Task",
            msgParentTaskNone: "None",
            labelPlaceBefore: "Place Before",
            msgEndOfList: "End of list",
            labelDependencyTasks: "Dependency Tasks",
            labelBlockedTasks: "Blocked Tasks",
            btnSubmit: "Save",
          },
          priority: {
            priority: "priority",
            critical: "Critical",
            high: "High",
            medium: "Medium",
            low: "Low",
            none: "None",
            no: "No",
          },
          difficulty: {
            difficulty: "difficulty",
            hard: "Hard",
            normal: "Normal",
            easy: "Easy",
          },
          exitConfirmation: {
            youSure: "Are you sure?",
            saveChanges:
              "Your project has unsaved changes. Do you want to save them?",
          },
          aboutPage: {
            madeWith: 'Made with',
            githubPage: 'GitHub page',
          },
        },
      },
      ru: {
        translation: {
          titleNewProject: "Новый проект",
          clear: "Очистить",
          about: "О приложении",
          settings: "Настройки",
          delete: "Удалить",
          deleteTask: "Удалить задачу",
          completed: "Готово",
          projectProgress: "Прогресс проекта",
          newTask: "Новая задача",
          editTask: "Редактировать задачу",
          add: "Добавить",
          remove: "Удалить",
          cancel: "Отмена",
          selectTask: "Выбрать задачу",
          change: "Изменить",
          back: 'Назад',
          welcomePage: {
            newFile: "Новый проект",
            openFile: "Открыть проект...",
            recentFiles: "Недавние проекты",
          },
          menuBar: {
            newFile: "Новый проект",
            openFile: "Открыть проект...",
            saveFile: "Сохранить",
            saveAs: "Сохранить как...",
          },
          taskDetails: {
            pleaseSelectTask: "Выберите задачу",
            details: "Информация",
            addSubtask: "Подзадача",
            edit: "Изменить",
            delete: "Удалить",
            description: "Описание",
            dependencyTasks: "Зависимости",
            blockedTasks: "Блокируемые задачи",
            noTasks: "Нет",
          },
          taskFormFields: {
            labelName: "Название",
            labelDescription: "Описание",
            labelProgress: "Прогресс",
            btnMarkAsDone: "Отметить завершённой",
            msgProgressCalculated:
              "Вычислено из подзадач. Чтобы обновить это значение, обновите прогресс в подзадачах.",
            labelPriority: "Приоритет",
            labelDifficulty: "Сложность",
            labelParentTask: "Родительская задача",
            msgParentTaskNone: "Не указана",
            labelPlaceBefore: "Поставить перед",
            msgEndOfList: "В конец списка",
            labelDependencyTasks: "Зависимости",
            labelBlockedTasks: "Блокируемые задачи",
            btnSubmit: "Сохранить",
          },
          priority: {
            priority: "приоритет",
            critical: "Критический",
            high: "Высокий",
            medium: "Средний",
            low: "Низкий",
            none: "Очень низкий",
            no: "Очень низкий",
          },
          difficulty: {
            difficulty: "сложность",
            hard: "Тяжёлая",
            normal: "Средняя",
            easy: "Лёгкая",
          },
          exitConfirmation: {
            youSure: "Вы уверены?",
            saveChanges:
              "В проекте есть несохранённые изменения. Хотите ли вы их сохранить?",
          },
          aboutPage: {
            madeWith: 'Сделано с помощью',
            githubPage: 'Страница на GitHub',
          },
        },
      },
    },
  });

export default i18n;
