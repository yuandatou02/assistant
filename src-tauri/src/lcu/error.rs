use thiserror::Error;

/// 尝试获取 Riot 进程信息时可能发生的错误
#[derive(Debug, Clone, Error)]
pub(crate) enum ProcessInfoError {
    /// 英雄联盟客户端尚未启动
    #[error("无法找到 Riot/英雄联盟客户端进程")]
    ProcessNotAvailable,
    /// 获取 API 端口时发生错误
    #[error("无法从进程参数中解析 API 端口")]
    PortNotFound,
    /// 获取 API 认证令牌时发生错误
    #[error("无法从进程参数中解析 API 认证令牌")]
    AuthTokenNotFound,
    /// 获取 RSO 平台 ID 时发生错误
    #[error("无法从进程参数中解析 RSO 平台 ID")]
    PlatformIdNotFound,
}
