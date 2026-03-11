use reqwest::header::AUTHORIZATION;
use reqwest::{Certificate, header};
use std::time::Duration;

/// 构建带有自定义配置的 HTTP 请求客户端
///
/// 创建一个预配置了 Riot Games SSL 证书、认证头和超时设置的 reqwest 客户端实例。
/// 该客户端专门用于与 LCU (League Client Update) API 进行通信。
///
/// # 参数
/// * `auth_token` - 可选的认证令牌，如果提供，将自动添加到请求头中用于 API 认证
///
/// # 返回值
/// 返回一个配置好的 `reqwest::Client` 实例，具有以下特性：
/// - 内置 Riot Games 的根证书用于 HTTPS 验证
/// - 可选的 Basic Authentication 认证头
/// - 3 秒的请求超时时间
///
/// # Panics
/// 在以下情况下会触发 panic:
/// - 加载 Riot Games 证书失败
/// - 创建认证头失败
/// - 创建请求客户端失败
pub(crate) fn build_request_client(auth_token: Option<String>) -> reqwest::Client {
    // 加载 Riot Games 的 SSL 证书
    let cert =
        Certificate::from_pem(include_bytes!("riotgames.pem")).expect("加载 Riot Games 证书失败");

    // 初始化请求头映射表
    let mut headers = header::HeaderMap::new();

    // 如果提供了认证令牌，则添加到请求头中
    if let Some(token) = auth_token {
        let auth_header = header::HeaderValue::from_str(format!("Basic {}", token).as_str())
            .expect("创建认证头失败");
        headers.insert(AUTHORIZATION, auth_header);
    }

    // 构建并返回配置好的 HTTP 客户端
    reqwest::ClientBuilder::new()
        .add_root_certificate(cert)
        .default_headers(headers)
        .timeout(Duration::from_secs(5))
        .build()
        .expect("创建请求客户端失败")
}
