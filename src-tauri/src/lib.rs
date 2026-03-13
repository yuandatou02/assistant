mod lcu;

use lcu::{
    get_client_path, get_lol_region, get_mastery_champ_list, get_rank_point,
    get_summoner_honor_level, get_summoner_info, init_keyboard, launch_lol,
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
                        .format(|out, message, record| {
                            out.finish(format_args!(
                                "[{}][{}][{}:{}][{}] {}",
                                chrono::Local::now().format("%Y-%m-%d %H:%M:%S"),
                                record.level(),
                                record.file().unwrap_or("unknown"),
                                record.line().unwrap_or(0),
                                record.target(),
                                message
                            ))
                        })
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
            get_summoner_info,
            get_rank_point,
            get_summoner_honor_level,
            get_mastery_champ_list
        ])
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
