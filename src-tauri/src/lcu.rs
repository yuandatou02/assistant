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
