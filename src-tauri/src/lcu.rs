mod client;
mod error;
mod utils;

use crate::lcu::client::RESTClient;
use crate::lcu::utils::global_key::init_global_keyboard;
use crate::lcu::utils::process_info::get_auth_info;
use anyhow::Context;
use log::error;
use once_cell::sync::OnceCell;
use serde_json::Value;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter};

// 定义全局的REST客户端
static REST_CLIENT: OnceCell<RESTClient> = OnceCell::new();

// 获取 REST_CLIENT 的函数
fn get_client() -> anyhow::Result<&'static RESTClient> {
    REST_CLIENT.get().context("REST_CLIENT 没有初始化")
}

pub fn get_summoner_info(endpoint: &str) {
    todo!("没有完成")
}

/// 初始化全局键盘监听器
///
/// 在后台异步任务中启动全局键盘监听，用于捕获和处理全局键盘事件。
///
/// # Parameters
/// * `app` - Tauri 应用句柄，用于访问应用资源和窗口管理
///
/// # Returns
/// 无返回值
#[tauri::command]
pub async fn init_keyboard(app: AppHandle) {
    // 在独立的 Tokio 任务中运行全局键盘监听器
    tokio::spawn(async move {
        init_global_keyboard(app);
    });
}

/// 获取客户端安装路径
///
/// 通过 LCU API 获取 League Client 的安装目录，并将默认路径替换为
/// 自定义的 TCLS 客户端路径。
///
/// # Returns
/// * `Result<String, Value>` - 成功时返回客户端可执行文件的完整路径字符串
///   - 路径格式：`TCLS\\client.exe`（替换了默认的 LeagueClient 路径）
///   - 失败时返回 `Value::Null`
///
/// # Errors
/// 当出现以下情况时返回错误：
/// - 无法获取客户端实例
/// - API 请求失败
/// - JSON 反序列化失败
#[tauri::command]
pub async fn get_client_path() -> Result<String, Value> {
    // 获取客户端实例
    let client = get_client().map_err(|_| Value::Null)?;

    // 调用 LCU API 获取安装目录路径
    let path = client
        .get("/data-store/v1/install-dir")
        .await
        .map_err(|_| Value::Null)?;

    // 将响应值反序列化为字符串
    let path = serde_json::from_value::<String>(path).map_err(|e| {
        error!("JSON 反序列化失败：{}", e);
        Value::Null
    })?;

    // 替换为自定义客户端路径
    let path = path.replace("LeagueClient", r"TCLS\\client.exe");
    Ok(path)
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
