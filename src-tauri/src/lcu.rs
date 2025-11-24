pub mod matchlisthanle;

use std::time::{Duration, Instant};

use crate::{
    lcu::matchlisthanle::MatchListDetails,
    shaco::{rest::RESTClient, utils::process_info::get_client_info},
};
use log::{error, info};
use once_cell::sync::OnceCell;
use serde_json::{Value, from_value};
use tauri::{AppHandle, Emitter};

// 定义全局的 REST 客户端
static REST_CLIENT: OnceCell<RESTClient> = OnceCell::new();

// 获取 REST_CLIENT 的函数
fn get_client() -> Result<&'static RESTClient, String> {
    REST_CLIENT
        .get()
        .ok_or_else(|| "REST_CLIENT未初始化".to_string())
}

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

#[tauri::command]
pub async fn invoke_lcu(method: &str, uri: &str, _body: &str) -> Result<Value, Value> {
    let client = get_client()?;
    match method.to_lowercase().as_str() {
        "get" => client.get(uri).await.map_err(|_| Value::Null),
        _ => Ok(Value::Null),
    }
}

#[tauri::command]
pub fn start_game(path: &str) {
    std::process::Command::new(&path)
        .spawn()
        .map_err(|e| e.to_string())
        .unwrap();
}

#[tauri::command]
pub fn is_lol_client() -> bool {
    get_client_info().is_ok()
}

#[tauri::command]
pub async fn get_match_list(uri: &str) -> Result<MatchListDetails, Value> {
    let client = get_client()?;
    info!("获取比赛列表地址: {}", uri);
    let res = client.get(uri).await.expect("Failed to Url");
    match from_value::<MatchListDetails>(res.clone()) {
        Ok(match_list) => Ok(match_list),
        Err(e) => {
            error!("获取比赛列表失败: {}", e);
            Err(Value::Null)
        }
    }
}
