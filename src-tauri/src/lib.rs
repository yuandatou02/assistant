mod lcu;
mod shaco;

use crate::lcu::{invoke_lcu, listen_for_client_start, start_game};

#[tokio::main]
pub async fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            listen_for_client_start,
            invoke_lcu,
            start_game
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
