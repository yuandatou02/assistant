mod client;
mod error;
mod utils;

use crate::lcu::client::RESTClient;
use crate::lcu::utils::process_info::get_auth_info;
use log::error;
use log::kv::Value;
use once_cell::sync::OnceCell;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter};

// 定义全局的REST客户端
static REST_CLIENT: OnceCell<RESTClient> = OnceCell::new();

// 获取 REST_CLIENT 的函数
fn get_client() -> Result<&'static RESTClient, String> {
    REST_CLIENT
        .get()
        .ok_or_else(|| "REST_CLIENT 没有初始化".to_string())
}

pub fn get_summoner_info(endpoint: &str) {
    todo!("没有完成")
}

/// 监听英雄联盟客户端启动事件
///
/// 该命令在后台异步运行，持续轮询检测英雄联盟客户端是否启动。
/// 一旦检测到客户端运行，就会初始化 REST_CLIENT 并向前端发送状态通知。
///
/// # 参数
/// * `app` - Tauri 应用句柄，用于向指定窗口发送事件消息
///
/// # 行为
/// - 设置 180 秒的超时时间
/// - 每 3 秒检查一次客户端认证信息
/// - 成功获取信息后初始化全局 REST_CLIENT
/// - 向 "background" 窗口发送 "client_status" 事件，值为 "ClientStarted"
/// - 超时后记录错误日志
///
/// # Note
/// 此函数在独立的 tokio 任务中运行，不会阻塞主线程
#[tauri::command]
pub fn listen_for_client_start(app: AppHandle) {
    // 在后台异步任务中执行客户端监听
    tokio::spawn(async move {
        // 记录开始时间和超时时长
        let start_time = Instant::now();
        let time_out = Duration::from_secs(180);

        // 循环检测客户端是否启动，直到超时
        while start_time.elapsed() < time_out {
            // 尝试获取客户端认证信息
            if let Ok(value) = get_auth_info() {
                // 初始化全局 REST_CLIENT 实例
                let _ = REST_CLIENT
                    .set(RESTClient::new(value.token, value.port).expect("创建 RESTClient 失败"))
                    .map_err(|_| "REST_CLIENT 已经初始化过了");

                // 向背景页面发送客户端已启动的状态事件
                app.emit_to("background", "client_status", "ClientStarted")
                    .expect("sent background error");
                break;
            }

            // 等待一段时间后再次检查
            tokio::time::sleep(Duration::from_secs(3)).await;
        }

        // 记录超时错误日志
        error!("客户端启动超时，未能获取信息。");
    });
}

/// 获取英雄联盟当前所在服务器区域
///
/// 该函数通过调用认证信息获取接口来获得当前用户的服务器区域信息
///
/// # Returns
/// * `Ok(String)` - 成功时返回服务器区域名称字符串
/// * `Err(String)` - 失败时返回错误信息，如"客户端未运行"
#[tauri::command]
pub fn get_lol_region() -> Result<String, String> {
    // 尝试获取认证信息并提取区域字段
    match get_auth_info() {
        Ok(info) => Ok(info.region),
        Err(_) => Err("客户端未运行".to_string()),
    }
}

/// 启动英雄联盟游戏
///
/// 该函数通过指定的路径启动英雄联盟游戏进程
///
/// # 参数
/// * `path` - 英雄联盟可执行文件的完整路径
///
/// # 返回值
/// * `Result<(), String>` - 成功时返回Ok(()), 失败时返回错误信息字符串
#[tauri::command]
pub async fn launch_lol(path: &str) -> Result<(), String> {
    std::process::Command::new(path)
        .spawn()
        .map(|_| ())
        .map_err(|e| e.to_string())
}
