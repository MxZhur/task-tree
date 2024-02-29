// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
async fn set_window_title(new_title: String, window: tauri::Window) {
    let _set_title = window.set_title(&new_title).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![set_window_title])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
