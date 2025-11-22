use base64::{Engine, engine::general_purpose};
use sysinfo::System;

use crate::shaco::error::ProcessInfoError;

const TARGET_PROCESS: &str = "LeagueClientUx.exe";

/// 获取客户端信息，包括认证令牌和端口号
/// 
/// # 返回值
/// 返回一个Result，包含一个元组(String, String)或ProcessInfoError错误
/// 元组中的第一个元素是base64编码的认证信息，第二个元素是端口号
pub fn get_client_info() -> Result<(String, String), ProcessInfoError> {
    // 创建一个新的System实例，用于获取系统进程信息
    let mut sys = System::new_all();

    // 刷新所有进程信息，包括详细信息
    sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);

    // 查找目标进程，获取其命令行参数
    let args = sys
        .processes()
        .values()
        .find(|p| p.name() == TARGET_PROCESS)  // 查找名称匹配的目标进程
        .map(|p| p.cmd())  // 获取进程的命令行参数
        .ok_or(ProcessInfoError::ProcessNotAvailable)?;  // 如果找不到进程则返回错误

    // 从命令行参数中提取端口号
    let port = args
        .iter()
        .find(|arg| arg.to_string_lossy().starts_with("--app-port="))  // 查找包含端口号的参数
        .map(|arg| {
            arg.to_string_lossy()  // 将参数转换为字符串
                .strip_prefix("--app-port=")  // 移除参数前缀
                .unwrap()
                .to_string()
        })
        .ok_or(ProcessInfoError::PortNotFound)?;  // 如果找不到端口号则返回错误

    // 从命令行参数中提取认证令牌
    let auth_token = args
        .iter()
        .find(|arg| arg.to_string_lossy().starts_with("--remoting-auth-token="))  // 查找包含认证令牌的参数
        .map(|arg| {
            arg.to_string_lossy()  // 将参数转换为字符串
                .strip_prefix("--remoting-auth-token=")  // 移除参数前缀
                .unwrap()
                .to_string()
        })
        .ok_or(ProcessInfoError::AuthTokenNotFound)?;  // 如果找不到认证令牌则返回错误

    // 返回编码后的认证信息和端口号
    Ok((general_purpose::STANDARD.encode(format!("riot:{}",auth_token)),port))
}
