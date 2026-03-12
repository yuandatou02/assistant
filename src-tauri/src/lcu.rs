mod client;
mod error;
mod types;
mod utils;

use crate::lcu::client::RESTClient;
use crate::lcu::types::rank::RankedStats;
use crate::lcu::types::summoner::{LcuSummonerInfo, Profile, SummonerInfo};
use crate::lcu::utils::global_key::init_global_keyboard;
use crate::lcu::utils::process_info::get_auth_info;
use crate::lcu::utils::tools::generate_rank_string;
use anyhow::Context;
use log::error;
use once_cell::sync::{Lazy, OnceCell};
use serde_json::Value;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter};

// 定义全局的REST客户端
static REST_CLIENT: OnceCell<RESTClient> = OnceCell::new();
static FAIL_RESULT: Lazy<[String; 3]> = Lazy::new(|| {
    [
        "未定级".to_string(),
        "未定级".to_string(),
        "未定级".to_string(),
    ]
});

// 获取 REST_CLIENT 的函数
fn get_client() -> anyhow::Result<&'static RESTClient> {
    REST_CLIENT.get().context("REST_CLIENT 没有初始化")
}

/// 获取召唤师荣誉等级信息
///
/// 通过 LCU API 获取当前玩家的荣誉档案信息，包括荣誉等级和荣誉里程数。
/// 该函数将原始 API 响应转换为格式化的荣誉信息字符串。
///
/// # Returns
/// * `Ok(String)` - 成功时返回格式化的荣誉信息字符串，格式为："荣誉等级 X 里程 Y"
///   - X: 当前的荣誉等级数值
///   - Y: 当前的荣誉里程数
/// * `Err(String)` - 失败时返回错误信息字符串
///
/// # Errors
/// 当出现以下情况时返回错误：
/// - REST_CLIENT 未初始化
/// - HTTP 请求失败
/// - JSON 反序列化失败
#[tauri::command]
pub async fn get_summoner_honor_level() -> Result<String, String> {
    // 获取 REST 客户端实例并发起 API 请求获取荣誉档案
    let client = get_client().map_err(|_| "Error".to_string())?;
    let value = client
        .get("/lol-honor-v2/v1/profile")
        .await
        .map_err(|_| "Error".to_string())?;

    // 将响应数据反序列化为 Profile 结构体
    let profile = serde_json::from_value::<Profile>(value).map_err(|e| {
        error!("JSON 反序列化失败：{}", e);
        "Error".to_string()
    })?;

    // 格式化并返回荣誉等级和里程信息
    Ok(format!(
        "荣誉等级{} 里程{}",
        profile.honor_level, profile.checkpoint
    ))
}

/// 获取排位赛积分信息
///
/// 通过 LCU API 获取指定端点的排位赛统计数据，包括单双排、灵活组排和云顶之弈的段位信息。
/// 该函数将原始 API 响应转换为前端所需的三个段位字符串格式。
///
/// # Parameters
/// * `endpoint` - LCU API 端点路径，用于获取排位赛信息的完整 URL 路径
///
/// # Returns
/// * `Ok([String; 3])` - 成功时返回包含三个段位字符串的数组：
///   - 索引 0: 单双排 (RANKED_SOLO_5x5) 段位信息
///   - 索引 1: 灵活组排 (RANKED_FLEX_SR) 段位信息
///   - 索引 2: 云顶之弈 (RANKED_TFT) 段位信息
///   每个段位字符串包含段位名称、胜点和胜率等信息
/// * `Err([String; 3])` - 失败时返回包含三个"未定级"字符串的错误数组
///
/// # Errors
/// 当出现以下情况时返回错误：
/// - REST_CLIENT 未初始化
/// - HTTP 请求失败
/// - JSON 反序列化失败
/// - 队列数据为空
#[tauri::command]
pub async fn get_rank_point(endpoint: &str) -> Result<[String; 3], [String; 3]> {
    // 获取 REST 客户端实例并发起 API 请求
    let client = get_client().map_err(|_| FAIL_RESULT.clone())?;
    let rank_point = client
        .get(endpoint)
        .await
        .map_err(|_| FAIL_RESULT.clone())?;

    // 将响应数据反序列化为 RankedStats 结构体
    let rank_point = serde_json::from_value::<RankedStats>(rank_point).map_err(|e| {
        error!("JSON 反序列化失败：{}", e);
        FAIL_RESULT.clone()
    })?;

    // 提取队列列表并检查是否为空
    let queue = rank_point.queues;
    if queue.is_empty() {
        return Ok(FAIL_RESULT.clone());
    }

    // 查找三种不同队列类型的排位数据
    let rank_sole = queue
        .iter()
        .find(|item| item.queue_type == "RANKED_SOLO_5x5");
    let rank_flex = queue
        .iter()
        .find(|item| item.queue_type == "RANKED_FLEX_SR");
    let rank_tft = queue.iter().find(|item| item.queue_type == "RANKED_TFT");

    // 将查找到的排位数据转换为格式化的段位字符串
    let rank_solo = generate_rank_string(rank_sole);
    let rank_flex = generate_rank_string(rank_flex);
    let rank_tft = generate_rank_string(rank_tft);

    // 返回包含三个段位字符串的数组
    Ok([rank_solo, rank_flex, rank_tft])
}

/// 获取召唤师信息
///
/// 通过 LCU API 获取指定端点的召唤师详细信息，包括基本信息、等级、经验值等。
/// 该函数将原始 API 响应转换为前端所需的 SummonerInfo 格式。
///
/// # Parameters
/// * `endpoint` - LCU API 端点路径，用于获取召唤师信息的完整 URL 路径
///
/// # Returns
/// * `Ok(SummonerInfo)` - 成功时返回召唤师信息对象，包含：
///   - `privacy`: 隐私设置信息
///   - `puuid`: 玩家唯一标识符
///   - `tag_line`: 玩家标签行（可选）
///   - `name`: 游戏内显示名称
///   - `current_id`: 当前召唤师 ID
///   - `lv`: 格式化后的等级字符串（如 "Lv 150"）
///   - `xp`: 当前等级经验值百分比（0-100）
///   - `img_url`: 玩家头像图片 URL 地址
/// * `Err(Value::Null)` - 失败时返回 Null 值，可能原因：
///   - 无法获取客户端实例
///   - API 请求失败
///   - JSON 反序列化失败
///
/// # Errors
/// 当出现以下情况时返回错误：
/// - REST_CLIENT 未初始化
/// - HTTP 请求失败
/// - 响应数据格式不正确
#[tauri::command]
pub async fn get_summoner_info(endpoint: &str) -> Result<SummonerInfo, Value> {
    // 获取 REST 客户端实例
    let client = get_client().map_err(|_| Value::Null)?;

    // 向指定端点发送 GET 请求获取原始召唤师数据
    let summoner_info = client.get(endpoint).await.map_err(|_| Value::Null)?;

    // 将 JSON 值反序列化为 LcuSummonerInfo 结构体
    let summoner_info = serde_json::from_value::<LcuSummonerInfo>(summoner_info).map_err(|e| {
        error!("JSON 反序列化失败：{}", e);
        Value::Null
    })?;

    // 构建并返回格式化后的召唤师信息对象
    Ok(SummonerInfo {
        privacy: summoner_info.privacy,
        puuid: summoner_info.puuid,
        tag_line: Some(summoner_info.tag_line),
        name: summoner_info.game_name,
        current_id: summoner_info.summoner_id,
        lv: format!("Lv {}", summoner_info.summoner_level),
        xp: ((summoner_info.xp_since_last_level as f64 / summoner_info.xp_until_next_level as f64)
            * 100.0) as i32,
        img_url: format!(
            "https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/{}.png",
            summoner_info.profile_icon_id
        ),
    })
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
    let path = path.replace("LeagueClient", r"TCLS\client.exe");
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
                    .set(RESTClient::new(value.token, value.port).expect("创建 RESTClient 失败"));

                // 向背景页面发送客户端已启动的状态事件
                app.emit_to("background", "client_status", "ClientStarted")
                    .expect("sent background error");
                break;
            }
            // 等待一段时间后再次检查
            tokio::time::sleep(Duration::from_secs(3)).await;
        }
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
