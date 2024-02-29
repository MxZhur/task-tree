import { invoke } from "@tauri-apps/api";

export const changeWindowTitle = async (newTitle: string) => {
  await invoke("set_window_title", { newTitle });
};
