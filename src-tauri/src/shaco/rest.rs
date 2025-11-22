use std::time::Duration;

use reqwest::{Certificate, header};

pub struct RESTClient {
    port: String,
    request_client: reqwest::Client,
}

type Error = Box<dyn std::error::Error>;

impl RESTClient {
    /// 创建一个新的客户端实例
    /// 
    /// # 参数
    /// 
    /// * `auth_token` - 用于身份验证的令牌字符串
    /// * `port` - 服务器端口号字符串
    /// 
    /// # 返回值
    /// 
    /// 返回一个 `Result`，其中：
    /// - `Ok(Self)` 包含新创建的客户端实例
    /// - `Err(Error)` 包含创建过程中可能出现的错误
    /// 
    /// # 示例
    /// 
    pub fn new(auth_token: String, port: String) -> Result<Self, Error> {
        let request_client = build_request_client(Some(auth_token));
        Ok(Self {
            port,
            request_client,
        })
    }
}

/// 构建一个配置了 Riot Games 证书和认证信息的 HTTP 客户端
///
/// # 参数
/// * `auth_token` - 可选的认证令牌，用于 Basic 认证
///
/// # 返回值
/// 返回一个配置好的 reqwest::Client 实例
///
/// # 注意事项
/// - 函数会加载 Riot Games 的根证书用于 HTTPS 请求
/// - 如果提供了 auth_token，会自动添加 Authorization 请求头
/// - 设置了 3 秒的请求超时时间
///
/// # 可能的 panic
/// 当前实现使用了 unwrap()，在以下情况会 panic：
/// - 证书文件加载失败
/// - 认证头格式无效
/// - 客户端构建失败
fn build_request_client(auth_token: Option<String>) -> reqwest::Client {
    // 加载 Riot Games 的根证书，用于验证 HTTPS 请求
    let cert = Certificate::from_pem(include_bytes!("./riotgames.pem")).unwrap();

    // 创建请求头集合
    let mut headers = header::HeaderMap::new();

    // 如果提供了认证令牌，添加 Basic 认证头
    if let Some(token) = auth_token {
        // 构建 Basic 认证头
        let auth_header =
            header::HeaderValue::from_str(format!("Basic {}", token).as_str()).unwrap();
        headers.insert("Authorization", auth_header);
    }

    // 创建并配置 HTTP 客户端
    reqwest::ClientBuilder::new()
        .add_root_certificate(cert) // 添加根证书
        .default_headers(headers) // 设置默认请求头
        .timeout(Duration::from_secs(3)) // 设置请求超时时间
        .build() // 构建客户端
        .unwrap() // 处理构建结果
}
