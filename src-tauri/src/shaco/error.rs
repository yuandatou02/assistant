use std::{error::Error, fmt::Display};

#[derive(Debug, Clone)]
/// 表示获取进程信息时可能出现的错误类型
pub enum ProcessInfoError {
    /// 当目标进程不可用时触发此错误
    ProcessNotAvailable,
    /// 当未找到指定端口时触发此错误
    PortNotFound,
    /// 当认证令牌未找到时触发此错误
    AuthTokenNotFound,
}

impl Error for ProcessInfoError {}

// 为 ProcessInfoError 类型实现 Display trait，用于自定义错误信息的格式化输出
impl Display for ProcessInfoError {
    // fmt 方法是 Display trait 的要求，用于格式化输出
    // f 是一个格式化器，用于写入格式化后的字符串
    // 返回一个 std::fmt::Result，表示格式化操作是否成功
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        // 使用 match 语句匹配不同的错误类型
        match self {
            // 当错误为 ProcessNotAvailable 时，输出 Riot/League 客户端进程没有发现的错误信息
            Self::ProcessNotAvailable => write!(f, "{:?}:  Riot/League 客户端进程没有发现", self),
            // 当错误为 PortNotFound 时，输出端口没有发现的错误信息
            Self::PortNotFound => write!(f, "{:?}:  端口没有发现", self),
            // 当错误为 AuthTokenNotFound 时，输出 AuthToken 没有发现的错误信息
            Self::AuthTokenNotFound => write!(f, "{:?}:  AuthToken 没有发现", self),
        }
    }
}

/// LCU WebSocket错误类型枚举
/// 定义了与LCU(League Client Update)WebSocket通信过程中可能出现的各种错误情况
#[derive(Debug, Clone)]
pub enum LcuWebSocketError {
    /// LCU服务不可用错误
    /// 包含一个描述性字符串，提供更多关于错误的信息
    LcuNotAvailable(String),
    /// 认证错误
    /// 表示在尝试连接LCU WebSocket时发生的认证失败情况
    AuthError,
    /// 发送错误
    /// 表示在向LCU WebSocket发送消息时遇到的错误
    SendError,
    /// 连接断开错误
    /// 包含一个描述性字符串，说明连接断开的具体原因
    Disconnected(String),
}

impl Error for LcuWebSocketError {}

impl Display for LcuWebSocketError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::LcuNotAvailable(s) => write!(f, "LCU API不可用: {}", s),
            Self::AuthError => write!(f, "LCU认证失败"),
            Self::SendError => write!(f, "LCU发送消息失败"),
            Self::Disconnected(s) => write!(f, "LCU连接断开: {}", s),
        }
    }
}
