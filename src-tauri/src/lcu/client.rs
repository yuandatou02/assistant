use crate::lcu::utils::request::build_request_client;
use log::error;

pub struct RESTClient {
    port: String,
    client: reqwest::Client,
}

impl RESTClient {
    pub fn new(auth_token: String, port: String) -> anyhow::Result<Self> {
        let client = build_request_client(Some(auth_token));
        Ok(Self { port, client })
    }

    pub async fn get(&self, endpoint: &str) -> anyhow::Result<serde_json::Value> {
        let url = format!("https://127.0.0.1:{}{}", self.port, endpoint);

        // 发送请求，处理错误
        let response = match self.client.get(&url).send().await {
            Ok(resp) => resp,
            Err(e) => {
                error!("发送请求失败! URL: {}, 原因: {}", url, e);
                return Ok(serde_json::Value::Null);
            }
        };

        // 检查状态码
        let response = match response.error_for_status() {
            Ok(resp) => resp,
            Err(e) => {
                error!("HTTP 错误状态! URL: {}, 原因: {}", url, e);
                return Ok(serde_json::Value::Null);
            }
        };

        // 解析 JSON
        match response.json().await {
            Ok(json) => Ok(json),
            Err(e) => {
                error!("JSON 解析失败! URL: {}, 原因: {}", url, e);
                Ok(serde_json::Value::Null)
            }
        }
    }
}
