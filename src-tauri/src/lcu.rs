use std::time::{Duration, Instant};

use crate::shaco::{rest::RESTClient, utils::process_info::get_client_info};
use log::error;
use once_cell::sync::OnceCell;
use tauri::{AppHandle, Emitter};

// 定义全局的 REST 客户端
static REST_CLIENT: OnceCell<RESTClient> = OnceCell::new();

#[tauri::command]
pub fn listen_for_client_start(app: AppHandle) {
    tokio::spawn({
        async move {
            let start_time = Instant::now();
            let time_out = Duration::from_secs(180);
            loop {
                // 获取客户端信息
                let client_info = get_client_info();

                if let Ok(value) = client_info {
                    let _ = REST_CLIENT
                        .set(RESTClient::new(value.0, value.1).unwrap())
                        .map_err(|_| "REST_CLIENT已经初始化过了".to_string());
                    app.emit_to("background", "client_status", "ClientStarted")
                        .expect("sent background error");
                }
                // 超出指定时间自动退出
                if start_time.elapsed() > time_out {
                    error!("客户端启动超时，未能获取信息。");
                    break;
                }
                // 每隔一段时间重新检查一次
                tokio::time::sleep(Duration::from_secs(3)).await;
            }
        }
    });
}
