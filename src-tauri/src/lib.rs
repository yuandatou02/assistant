mod lcu;

use lcu::{
    get_client_path, get_lol_region, get_summoner_info, init_keyboard, launch_lol,
    listen_for_client_start,
};

#[tokio::main]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
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
        .invoke_handler(tauri::generate_handler![
            launch_lol,
            get_lol_region,
            listen_for_client_start,
            get_client_path,
            init_keyboard,
            get_summoner_info
        ])
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
